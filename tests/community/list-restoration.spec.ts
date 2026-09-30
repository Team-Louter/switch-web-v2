import type { Page } from '@playwright/test'

import { accessToken, expect, test } from './fixtures'
import type { CommentResponse } from '../../src/entities/community/model/types'

const list = (page: Page) => page.getByRole('region', { name: '게시글 목록' })
const skeleton = (page: Page) =>
  list(page).getByRole('status', { name: '게시글을 불러오는 중입니다.' })
const postRow = (page: Page, title: string) =>
  list(page).getByRole('link').filter({ has: page.getByText(title, { exact: true }) })

async function openPost(page: Page, title: string) {
  await postRow(page, title).click()
  await expect(page.getByRole('heading', { name: title, exact: true })).toBeVisible()
}

function createComment(
  commentId: number,
  content: string,
  depth = 0,
  replyCount = 0,
): CommentResponse {
  return {
    commentId,
    userId: 42,
    userName: '테스트 작성자',
    userProfileImageUrl: '',
    content,
    depth,
    createdAt: '2026-09-30T01:00:00Z',
    isAnonymous: false,
    deleted: false,
    replyCount,
  }
}

test('최초 조회는 스켈레톤을 표시하고 전체글 첫 페이지를 한 번만 요청한다', async ({ page, api }) => {
  api.pauseLists()
  await page.goto('/community')
  await expect(skeleton(page)).toBeVisible()
  await expect.poll(() => api.listRequests.length).toBe(1)
  api.resumeLists()

  await expect(postRow(page, '게시글 1')).toBeVisible()
  await expect(skeleton(page)).toHaveCount(0)
  await expect(postRow(page, '고정글 101')).toHaveCount(1)
  expect(api.listRequests).toEqual([{ category: null, page: 0 }])
})

test('최초 조회 실패 시 오류를 표시하고 중복 요청 없이 재시도한다', async ({ page, api }) => {
  api.failLists = true
  await page.goto('/community')
  await expect(list(page).getByRole('alert')).toContainText('게시글을 불러오지 못했습니다.')
  await expect(skeleton(page)).toHaveCount(0)
  await expect(page.getByText('등록된 게시글이 없습니다.')).toHaveCount(0)

  api.failLists = false
  await page.getByRole('button', { name: '다시 시도' }).click()
  await expect(postRow(page, '게시글 1')).toBeVisible()
  expect(api.listRequests.length).toBe(2)
})

test('프로필 조회 실패 시 다시 시도에서 프로필을 재조회하고 목록을 복구한다', async ({ page, api }) => {
  api.failProfile = true
  await page.goto('/community')
  await expect(list(page).getByRole('alert')).toContainText('사용자 정보를 불러오지 못했습니다.')
  const initialProfileRequests = api.profileRequests

  api.failProfile = false
  await page.getByRole('button', { name: '다시 시도' }).click()

  await expect(postRow(page, '게시글 1')).toBeVisible()
  await expect.poll(() => api.profileRequests).toBeGreaterThan(initialProfileRequests)
  expect(api.listRequests.length).toBe(1)
})

test('빈 목록은 로딩 완료 후 빈 상태를 표시한다', async ({ page, api }) => {
  api.posts = []
  await page.goto('/community')
  await expect(page.getByText('등록된 게시글이 없습니다.')).toBeVisible()
  await expect(skeleton(page)).toHaveCount(0)
})

test('카테고리와 페이지를 URL에 저장하고 뒤로가기 시 목록과 스크롤을 복원한다', async ({ page, api }, testInfo) => {
  await page.goto('/community')
  await expect(postRow(page, '게시글 1')).toBeVisible()
  await page.getByRole('tab', { name: '자유게시판', exact: true }).click()
  await expect(page).toHaveURL(/category=FREE/)
  await page.getByRole('button', { name: '2', exact: true }).click()
  await expect(page).toHaveURL(/category=FREE&page=2/)
  await postRow(page, '게시글 60').scrollIntoViewIfNeeded()
  const scrollY = await page.evaluate(() => window.scrollY)
  expect(scrollY).toBeGreaterThan(0)
  const requestCount = api.listRequests.length

  await openPost(page, '게시글 60')
  await page.goBack()
  await expect(page.getByRole('tab', { name: '자유게시판', exact: true })).toHaveAttribute('aria-selected', 'true')
  await expect(page.getByRole('button', { name: '2', exact: true })).toHaveAttribute('aria-current', 'page')
  await expect(postRow(page, '게시글 60')).toBeVisible()
  await expect(skeleton(page)).toHaveCount(0)
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeCloseTo(scrollY, 0)
  expect(api.listRequests.length).toBe(requestCount)
  await page.screenshot({ path: testInfo.outputPath('restored-list.png') })
})

test('상세 화면의 목록 보기 버튼도 이전 필터와 스크롤을 복원한다', async ({ page, api }) => {
  await page.goto('/community?category=FREE&page=2')
  await postRow(page, '게시글 60').scrollIntoViewIfNeeded()
  const scrollY = await page.evaluate(() => window.scrollY)
  await openPost(page, '게시글 60')
  await page.getByRole('button', { name: '목록 보기' }).click()

  await expect(page).toHaveURL(/category=FREE&page=2/)
  await expect(postRow(page, '게시글 60')).toBeVisible()
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeCloseTo(scrollY, 0)
  expect(api.listRequests.length).toBe(2)
})

test('작성 취소 시 이전 목록 필터로 돌아온다', async ({ page, api }) => {
  await page.goto('/community?category=FREE&page=2')
  await expect(postRow(page, '게시글 33')).toBeVisible()
  await page.getByRole('button', { name: '글쓰기' }).click()
  await expect(page.getByRole('heading', { name: '게시글 작성' })).toBeVisible()
  await page.getByRole('button', { name: '목록 보기' }).click()

  await expect(page).toHaveURL(/category=FREE&page=2/)
  await expect(postRow(page, '게시글 33')).toBeVisible()
  expect(api.listRequests.length).toBe(2)
})

test('백그라운드 갱신 실패 시 기존 목록을 유지하며 재시도한다', async ({ page, api }) => {
  await page.clock.install()
  await page.goto('/community')
  await openPost(page, '게시글 1')
  await page.clock.fastForward(31_000)
  api.pauseLists()
  api.failLists = true
  api.posts.find((post) => post.postId === 1)!.postTitle = '서버에서 변경된 제목'
  await page.goBack()

  await expect.poll(() => api.listRequests.length).toBe(2)
  await expect(postRow(page, '게시글 1')).toBeVisible()
  await expect(skeleton(page)).toHaveCount(0)
  await expect(list(page)).toHaveAttribute('aria-busy', 'true')
  api.resumeLists()
  await expect(list(page).getByRole('alert')).toContainText('이전 데이터를 표시합니다.')
  await expect(postRow(page, '게시글 1')).toBeVisible()

  api.failLists = false
  await page.getByRole('button', { name: '다시 시도' }).click()
  await expect(postRow(page, '서버에서 변경된 제목')).toBeVisible()
  await expect(list(page).getByRole('alert')).toHaveCount(0)
  expect(api.listRequests.length).toBe(3)
})

test('캐시가 제거된 뒤 복귀해도 재조회 완료 후 이전 스크롤을 복원한다', async ({ page, api }) => {
  await page.clock.install()
  await page.goto('/community?category=FREE&page=2')
  await postRow(page, '게시글 60').scrollIntoViewIfNeeded()
  const scrollY = await page.evaluate(() => window.scrollY)
  await openPost(page, '게시글 60')
  await page.clock.fastForward(5 * 60_000 + 1_000)
  api.pauseLists()
  await page.goBack()

  await expect(skeleton(page)).toBeVisible()
  await expect.poll(() => api.listRequests.length).toBe(4)
  api.resumeLists()
  await expect(postRow(page, '게시글 60')).toBeVisible()
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeCloseTo(scrollY, 0)
})

test('로그아웃 후 다시 로그인하면 이전 계정의 목록 캐시를 재사용하지 않는다', async ({ page, api }) => {
  await page.goto('/community')
  await expect(postRow(page, '게시글 1')).toBeVisible()
  await page.evaluate(() => {
    localStorage.removeItem('accessToken')
    window.dispatchEvent(new Event('auth:state-changed'))
  })
  await expect(page).toHaveURL(/\/login/)
  api.posts.find((post) => post.postId === 1)!.postTitle = '새 로그인에서 조회한 목록'
  await page.evaluate((token) => {
    localStorage.setItem('accessToken', token)
    window.dispatchEvent(new Event('auth:state-changed'))
  }, accessToken)

  await expect(postRow(page, '새 로그인에서 조회한 목록')).toBeVisible()
  expect(api.listRequests.length).toBe(2)
})

test('좋아요 변경 성공 후 목록으로 복귀하면 갱신된 반응 수를 조회한다', async ({ page, api }) => {
  await page.goto('/community')
  await openPost(page, '게시글 1')
  const heart = page.getByRole('button', { name: /좋아요/ })
  await heart.click()
  await expect(heart).toHaveAttribute('aria-pressed', 'true')
  await page.goBack()

  await expect(postRow(page, '게시글 1').getByLabel('좋아요 1, 댓글 0, 조회 10')).toBeVisible()
  expect(api.listRequests.length).toBe(2)
})

test('변경 API 실패 시 정상 목록 캐시를 무효화하지 않는다', async ({ page, api }) => {
  await page.goto('/community')
  await openPost(page, '게시글 1')
  api.failMutations = true
  await page.getByRole('button', { name: /좋아요/ }).click()
  await expect(page.getByRole('alert')).toBeVisible()
  await page.goBack()

  await expect(postRow(page, '게시글 1').getByLabel('좋아요 0, 댓글 0, 조회 10')).toBeVisible()
  expect(api.listRequests.length).toBe(1)
})

test('게시글 고정 변경 후 고정글 목록을 갱신한다', async ({ page, api }) => {
  await page.goto('/community')
  await openPost(page, '게시글 1')
  await page.getByRole('button', { name: '게시글 관리 메뉴' }).click()
  await page.getByRole('menuitem', { name: '고정하기' }).click()
  await expect(page.getByRole('img', { name: '고정된 게시글' })).toBeVisible()
  await page.goBack()

  await expect(postRow(page, '게시글 1').getByRole('img', { name: '고정된 게시글' })).toBeVisible()
  expect(api.listRequests.length).toBe(2)
})

test('마지막 페이지의 유일한 게시글 삭제 후 유효한 페이지로 복귀한다', async ({ page, api }) => {
  api.posts = api.posts.filter((post) => post.pinned || post.postId <= 65)
  await page.goto('/community?category=FREE&page=3')
  await openPost(page, '게시글 65')
  await page.getByRole('button', { name: '게시글 관리 메뉴' }).click()
  await page.getByRole('menuitem', { name: '삭제하기' }).click()
  await page.getByRole('dialog').getByRole('button', { name: '삭제', exact: true }).click()

  await expect(page).toHaveURL(/category=FREE&page=2/)
  await expect(postRow(page, '게시글 33')).toBeVisible()
  await expect(postRow(page, '게시글 65')).toHaveCount(0)
})

test('게시글 작성 후 이전 카테고리로 복귀하고 새 게시글을 조회한다', async ({ page, api }) => {
  await page.goto('/community?category=FREE')
  await expect(postRow(page, '게시글 1')).toBeVisible()
  await page.getByRole('button', { name: '글쓰기' }).click()
  await page.getByRole('combobox', { name: '카테고리' }).click()
  await page.getByRole('option', { name: '자유게시판', exact: true }).click()
  await page.getByRole('textbox', { name: '게시글 제목' }).fill('새 게시글')
  await page.getByLabel('게시글 내용', { exact: true }).fill('작성 후 목록 캐시 갱신 확인')
  await page.getByRole('button', { name: '게시하기' }).click()
  await expect(page.getByRole('heading', { name: '새 게시글', exact: true })).toBeVisible()
  await page.getByRole('button', { name: '목록 보기' }).click()

  await expect(page).toHaveURL(/category=FREE/)
  await expect(postRow(page, '새 게시글')).toBeVisible()
  expect(api.listRequests.length).toBe(4)
})

test('게시글 수정 후 이전 페이지로 복귀하고 변경된 제목을 조회한다', async ({ page, api }) => {
  await page.goto('/community?category=FREE&page=2')
  await openPost(page, '게시글 40')
  await page.getByRole('button', { name: '게시글 관리 메뉴' }).click()
  await page.getByRole('menuitem', { name: '수정하기' }).click()
  await page.getByRole('textbox', { name: '게시글 제목' }).fill('수정된 게시글 40')
  await page.getByRole('button', { name: '저장하기' }).click()
  await expect(page.getByRole('heading', { name: '수정된 게시글 40', exact: true })).toBeVisible()
  await page.getByRole('button', { name: '목록 보기' }).click()

  await expect(page).toHaveURL(/category=FREE&page=2/)
  await expect(postRow(page, '수정된 게시글 40')).toBeVisible()
  expect(api.listRequests.length).toBe(4)
})

test('댓글 등록과 삭제 후 목록의 댓글 수를 갱신한다', async ({ page, api }) => {
  await page.goto('/community')
  await openPost(page, '게시글 1')
  await page.getByRole('textbox', { name: '댓글 내용' }).fill('댓글 수 갱신 확인')
  await page.getByRole('button', { name: '댓글 등록' }).click()
  await expect(page.getByText('댓글 수 갱신 확인', { exact: true })).toBeVisible()
  await page.getByRole('button', { name: '목록 보기' }).click()
  await expect(postRow(page, '게시글 1').getByLabel('좋아요 0, 댓글 1, 조회 10')).toBeVisible()

  await openPost(page, '게시글 1')
  await page.getByRole('button', { name: '댓글 관리 메뉴' }).click()
  await page.getByRole('menuitem', { name: '삭제하기' }).click()
  await page.getByRole('dialog').getByRole('button', { name: '삭제', exact: true }).click()
  await expect(page.getByText('댓글 수 갱신 확인', { exact: true })).toHaveCount(0)
  await page.getByRole('button', { name: '목록 보기' }).click()

  await expect(postRow(page, '게시글 1').getByLabel('좋아요 0, 댓글 0, 조회 10')).toBeVisible()
  expect(api.listRequests.length).toBe(3)
})

test('알림 해시로 새 답글에 이동하면 댓글과 답글 캐시를 갱신한다', async ({ page, api }) => {
  api.comments.push(createComment(501, '기존 댓글'))
  api.replies.set(501, [])

  await page.goto('/community/1')
  await expect(page.locator('#comment-501')).toBeVisible()
  await expect.poll(() => api.commentRequests).toBe(1)
  await expect.poll(() => api.replyCountRequests.length).toBeGreaterThan(0)

  api.replies.set(501, [createComment(502, '새 알림 답글', 1)])
  await page.evaluate(() => {
    const nextUrl = new URL(window.location.href)
    nextUrl.hash = 'comment-502'
    window.history.pushState(window.history.state, '', nextUrl)
    window.dispatchEvent(
      new PopStateEvent('popstate', { state: window.history.state }),
    )
  })

  await expect(page.locator('#comment-502')).toContainText('새 알림 답글')
  await expect.poll(() => api.commentRequests).toBe(2)
  expect(api.replyCountRequests.filter((commentId) => commentId === 501)).toHaveLength(2)
  expect(api.replyRequests).toContain(501)
})

test('유효하지 않은 URL 필터는 전체글 첫 페이지로 안전하게 처리한다', async ({ page, api }) => {
  await page.goto('/community?category=UNKNOWN&page=-2')
  await expect(page.getByRole('tab', { name: '전체글', exact: true })).toHaveAttribute('aria-selected', 'true')
  await expect(postRow(page, '게시글 1')).toBeVisible()
  expect(api.listRequests).toEqual([{ category: null, page: 0 }])
})

test('변경 전에 시작한 조회가 늦게 도착해도 최신 목록 캐시를 덮어쓰지 않는다', async ({ page, api }) => {
  await page.clock.install()
  await page.goto('/community')
  await openPost(page, '게시글 1')
  await page.clock.fastForward(31_000)
  api.pauseNextList()
  await page.goBack()
  await expect.poll(() => api.listRequests.length).toBe(2)
  await expect(list(page)).toHaveAttribute('aria-busy', 'true')

  await openPost(page, '게시글 1')
  const heart = page.getByRole('button', { name: /좋아요/ })
  await heart.click()
  await expect(heart).toHaveAttribute('aria-pressed', 'true')
  await page.goBack()
  const updatedStats = postRow(page, '게시글 1').getByLabel('좋아요 1, 댓글 0, 조회 10')
  await expect(updatedStats).toBeVisible()
  expect(api.listRequests.length).toBe(3)

  const obsoleteResponse = page.waitForResponse((response) => {
    return new URL(response.url()).pathname === '/api/posts'
  })
  api.resumeLists()
  await obsoleteResponse
  await expect(updatedStats).toBeVisible()
})
