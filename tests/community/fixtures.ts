import { Buffer } from 'node:buffer'
import { test as base, expect, type Page } from '@playwright/test'

import type { CommentResponse, PostResponse } from '../../src/entities/community/model/types'

export const accessToken = `e30.${Buffer.from(
  JSON.stringify({ exp: 2_000_000_000 }),
).toString('base64url')}.fixture`

function createPost(postId: number, pinned = false): PostResponse {
  return {
    postId,
    userId: 42,
    userName: '테스트 작성자',
    userProfileImageUrl: '',
    postTitle: `${pinned ? '고정글' : '게시글'} ${postId}`,
    postContent: '목록 복귀 회귀 테스트 본문입니다.',
    category: pinned ? 'NOTICE' : 'FREE',
    createdAt: '2026-09-30T01:00:00Z',
    isAnonymous: false,
    viewers: 10,
    likeCount: 0,
    commentCount: 0,
    isHearted: false,
    pinned,
    files: [],
  }
}

async function mockCommunityApi(page: Page) {
  let listGate: Promise<void> | undefined
  let pauseOnlyNextList = false
  let releaseListGate = () => {}
  const comments: CommentResponse[] = []
  const api = {
    posts: [
      createPost(101, true),
      createPost(102, true),
      ...Array.from({ length: 70 }, (_, index) => createPost(index + 1)),
    ],
    comments,
    replies: new Map<number, CommentResponse[]>(),
    listRequests: [] as { category: string | null; page: number }[],
    profileRequests: 0,
    commentRequests: 0,
    replyCountRequests: [] as number[],
    replyRequests: [] as number[],
    typingRankingRequests: [] as string[],
    typingPreviousResultRequests: 0,
    failProfile: false,
    failLists: false,
    failMutations: false,
    pauseLists() {
      listGate = new Promise<void>((resolve) => {
        releaseListGate = resolve
      })
    },
    pauseNextList() {
      api.pauseLists()
      pauseOnlyNextList = true
    },
    resumeLists() {
      listGate = undefined
      releaseListGate()
    },
  }

  await page.addInitScript((token) => {
    localStorage.setItem('accessToken', token)
  }, accessToken)

  await page.route(/^http:\/\/127\.0\.0\.1:4173\/api\//, async (route) => {
    const request = route.request()
    const url = new URL(request.url())
    const path = url.pathname.replace(/^\/api/, '')
    const method = request.method()

    if (path === '/me') {
      api.profileRequests += 1
      if (api.failProfile) {
        await route.fulfill({ status: 503, json: { message: '프로필 조회 실패' } })
        return
      }

      await route.fulfill({
        json: {
          userId: 42,
          userName: '테스트 작성자',
          role: 'LEADER',
          grade: 2,
          classRoom: 1,
          number: 1,
          majors: [],
          profileImageUrl: '',
        },
      })
      return
    }

    if (path === '/in-app-notifications/unread-count') {
      await route.fulfill({ json: { unreadCount: 0 } })
      return
    }

    if (method !== 'GET' && api.failMutations) {
      await route.fulfill({ status: 503, json: { message: '변경 실패' } })
      return
    }

    if (method === 'GET' && path === '/typing/results/previous') {
      api.typingPreviousResultRequests += 1
      await route.fulfill({
        json: {
          resultId: 7,
          accuracy: 98,
          elapsedTime: 60,
          averageSpeed: 120,
          problemType: 'DAILY',
          rank: 1,
          totalPracticeCount: 5,
        },
      })
      return
    }

    const typingRankingMatch = path.match(/^\/typing\/results\/rankings\/([^/]+)$/)
    if (method === 'GET' && typingRankingMatch) {
      const type = typingRankingMatch[1]
      api.typingRankingRequests.push(type)
      await route.fulfill({
        json: {
          problemType: type,
          topRankings: [
            { rank: 1, userId: 42, userName: '테스트 작성자', averageSpeed: 120 },
          ],
          myRanking: null,
        },
      })
      return
    }

    if (method === 'POST' && path === '/typing/rounds/DAILY') {
      await route.fulfill({
        json: {
          roundId: 8,
          userId: 42,
          problems: [{ problemId: 1, problemType: 'DAILY', content: 'Hello world.' }],
          resultId: 0,
          problemType: 'DAILY',
        },
      })
      return
    }

    if (method === 'GET' && /^\/posts(?:\/category\/[^/]+)?$/.test(path)) {
      const category = path.startsWith('/posts/category/')
        ? path.split('/').at(-1) ?? null
        : null
      const pageNumber = Number(url.searchParams.get('page') ?? 0)
      const size = Number(url.searchParams.get('size') ?? 32)
      const filtered = api.posts
        .filter((post) => !category || post.category === category)
        .sort((left, right) => Number(right.pinned) - Number(left.pinned))
      const content = filtered.slice(pageNumber * size, (pageNumber + 1) * size)
      const response = structuredClone({
        content,
        totalPages: Math.ceil(filtered.length / size),
        totalElements: filtered.length,
        number: pageNumber,
        size,
        empty: content.length === 0,
      })
      const shouldFail = api.failLists
      const requestGate = listGate
      if (pauseOnlyNextList) {
        listGate = undefined
        pauseOnlyNextList = false
      }
      api.listRequests.push({ category, page: pageNumber })

      // 응답 지연 중 변경 API가 호출되는 경합도 재현할 수 있도록 요청 당시 값을 보존한다.
      await requestGate
      await route.fulfill(
        shouldFail
          ? { status: 503, json: { message: '목록 조회 실패' } }
          : { json: response },
      )
      return
    }

    if (path === '/posts' && method === 'POST') {
      const body = request.postDataJSON()
      const post = {
        ...createPost(200),
        postTitle: body.title,
        postContent: body.content,
        category: body.category,
        isAnonymous: body.isAnonymous,
      }
      api.posts.unshift(post)
      await route.fulfill({ json: post })
      return
    }

    const postMatch = path.match(/^\/posts\/(\d+)(.*)$/)
    const post = api.posts.find((entry) => entry.postId === Number(postMatch?.[1]))
    const suffix = postMatch?.[2]

    if (!post) {
      await route.fulfill({ status: 404, json: { message: '게시글 없음' } })
      return
    }

    if (!suffix && method === 'DELETE') {
      api.posts = api.posts.filter((entry) => entry.postId !== post.postId)
      await route.fulfill({ status: 204 })
    } else if (!suffix && method === 'PUT') {
      const body = request.postDataJSON()
      Object.assign(post, { postTitle: body.title, postContent: body.content })
      await route.fulfill({ json: post })
    } else if (!suffix) {
      await route.fulfill({ json: post })
    } else if (suffix === '/stats') {
      await route.fulfill({ json: { viewers: post.viewers, likeCount: post.likeCount } })
    } else if (suffix === '/heart') {
      post.isHearted = !post.isHearted
      post.likeCount += post.isHearted ? 1 : -1
      await route.fulfill({ status: 204 })
    } else if (suffix === '/pin') {
      post.pinned = url.searchParams.get('pinned') === 'true'
      await route.fulfill({ status: 204 })
    } else if (suffix === '/comments' && method === 'GET') {
      api.commentRequests += 1
      await route.fulfill({ json: structuredClone(comments) })
    } else if (suffix === '/comments' && method === 'POST') {
      const body = request.postDataJSON()
      const comment: CommentResponse = {
        commentId: 501,
        userId: 42,
        userName: '테스트 작성자',
        userProfileImageUrl: '',
        content: body.content,
        depth: 0,
        createdAt: '2026-09-30T01:00:00Z',
        isAnonymous: body.isAnonymous,
        deleted: false,
        replyCount: 0,
      }
      comments.push(comment)
      post.commentCount += 1
      await route.fulfill({ json: comment })
    } else if (suffix?.match(/^\/comments\/\d+$/) && method === 'DELETE') {
      comments.splice(0, comments.length)
      post.commentCount = 0
      await route.fulfill({ status: 204 })
    } else if (suffix?.match(/^\/comments\/(\d+)\/replies$/) && method === 'GET') {
      const commentId = Number(suffix.split('/')[2])
      api.replyRequests.push(commentId)
      await route.fulfill({ json: structuredClone(api.replies.get(commentId) ?? []) })
    } else if (suffix?.match(/^\/comments\/(\d+)\/total-reply-count$/) && method === 'GET') {
      const commentId = Number(suffix.split('/')[2])
      api.replyCountRequests.push(commentId)
      await route.fulfill({
        json: {
          commentId,
          count: api.replies.get(commentId)?.length ?? 0,
        },
      })
    } else {
      await route.fulfill({ status: 404, json: { message: '지원하지 않는 테스트 경로' } })
    }
  })

  return api
}

export const test = base.extend<{ api: Awaited<ReturnType<typeof mockCommunityApi>> }>({
  api: async ({ page }, provide) => {
    const api = await mockCommunityApi(page)
    await provide(api)
  },
})

export { expect }
