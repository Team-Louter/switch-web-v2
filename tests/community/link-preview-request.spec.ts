import type { Request } from '@playwright/test'

import type { LinkPreviewResponse } from '../../src/entities/community/model/linkPreview'
import type { CommentResponse } from '../../src/entities/community/model/types'
import { serializeBlockNotePostContent } from '../../src/shared/lib/blockNotePostContent'
import { accessToken, expect, test } from './fixtures'

const href = 'https://example.com/practice?topic=sql&level=1'
const previewPattern = '**/api/link-preview?**'
const imageUrl = 'https://example.com/preview.svg'
const preview: LinkPreviewResponse = {
  title: '실기 문제은행',
  description: 'SQL 실전형 문제를 연습하세요.',
  siteName: '실기연구소',
  imageUrl,
  imageAlt: '실기 문제은행 대표 이미지',
  layout: 'large',
}

function postWithLink(url: string) {
  return serializeBlockNotePostContent([{
    id: 'public-link', type: 'paragraph',
    props: { backgroundColor: 'default', textColor: 'default', textAlignment: 'left' }, children: [],
    content: [{ type: 'text', text: url, styles: {} }],
  }])
}

test.beforeEach(async ({ api, context, page }) => {
  api.posts.find((post) => post.postId === 1)!.postContent = postWithLink(href)
  await page.route(imageUrl, (route) => route.fulfill({
    contentType: 'image/svg+xml',
    body: '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><rect width="1200" height="630" fill="#fff"/></svg>',
  }))
  await context.addCookies([{
    name: 'session', value: 'fixture-session', url: 'http://127.0.0.1:4173',
  }])
})

test('로그인 상태에서도 미리보기에는 인증 헤더·쿠키를 보내지 않고 일반 API 인증은 유지한다', async ({ page }) => {
  const previewRequests: Request[] = []
  await page.route(previewPattern, async (route) => {
    previewRequests.push(route.request())
    await route.fulfill({ json: preview })
  })
  const postRequest = page.waitForRequest('**/api/posts/1')
  await page.goto('/community/1')
  const body = page.getByRole('region', { name: '게시글 본문' })
  const source = body.getByRole('link', { name: href, exact: true })
  const card = body.getByRole('link', { name: new RegExp(preview.title) })
  await expect(source).toHaveAttribute('href', href)
  await expect(card).toContainText(preview.siteName)
  await expect(card).not.toContainText(href)
  const image = card.getByRole('img', { name: preview.imageAlt })
  await expect(image).toHaveAttribute('src', imageUrl)
  await expect.poll(() => image.evaluate((element: HTMLImageElement) => element.naturalWidth)).toBe(1200)
  await expect(card).toContainText(preview.description)
  await expect(card).toHaveAttribute('href', href)
  expect(previewRequests.length).toBeGreaterThan(0)
  for (const request of previewRequests) {
    const headers = await request.allHeaders()
    expect(headers.authorization).toBeUndefined()
    expect(headers.cookie).toBeUndefined()
    expect(headers.accept).toBe('application/json')
    expect(new URL(request.url()).origin).toBe('http://127.0.0.1:4173')
    expect(new URL(request.url()).searchParams.get('url')).toBe(href)
  }
  const authenticatedHeaders = await (await postRequest).allHeaders()
  expect(authenticatedHeaders.authorization).toBe(`Bearer ${accessToken}`)
  expect(authenticatedHeaders.cookie).toContain('session=fixture-session')
})

for (const status of [401, 502, 500]) {
  test(`미리보기 ${status} 응답은 원본 링크를 유지하고 로그인 갱신·해제를 유발하지 않는다`, async ({ page }) => {
    const authRequests: string[] = []
    page.on('request', (request) => {
      if (new URL(request.url()).pathname.startsWith('/api/auth/')) authRequests.push(request.url())
    })
    await page.route(previewPattern, (route) => route.fulfill({ status, json: { message: '조회 실패' } }))
    const failedResponse = page.waitForResponse(previewPattern)
    await page.goto('/community/1')
    await (await failedResponse).finished()
    const body = page.getByRole('region', { name: '게시글 본문' })
    await expect(body.getByRole('link')).toHaveCount(1)
    await expect(body.getByRole('link', { name: href, exact: true })).toHaveAttribute('href', href)
    await expect(body.getByText(preview.title)).toHaveCount(0)
    await expect(page).toHaveURL('/community/1')
    expect(await page.evaluate(() => localStorage.getItem('accessToken'))).toBe(accessToken)
    expect(authRequests).toEqual([])
  })
}


function comment(commentId: number, content: string, depth = 0, replyCount = 0): CommentResponse {
  return {
    commentId, content, depth, replyCount, userId: 42, userName: '테스트 작성자',
    userProfileImageUrl: '', createdAt: '2026-09-30T01:00:00Z',
    isAnonymous: false, deleted: false,
  }
}

test('댓글과 답글의 원본 링크를 열 수 있고 미리보기에는 메타데이터를 표시한다', async ({ page, api, context }) => {
  const commentHref = 'https://example.net/guide_(SQL)'
  const replyHref = 'https://example.org/sql'
  const commentPreview = { ...preview, title: 'SQL 안내', siteName: 'SQL 안내' }
  const replyPreview = { ...preview, title: '답글 참고 자료' }

  api.comments.push(comment(81, `확인 (${commentHref}). 다시 ${commentHref}!`, 0, 1))
  api.replies.set(81, [comment(82, `참고: ${replyHref}.`, 1)])
  await context.route((url) => url.href === commentHref, (route) =>
    route.fulfill({ contentType: 'text/html', body: '<title>원본 링크</title>' }))
  await page.route(previewPattern, (route) => {
    const url = new URL(route.request().url()).searchParams.get('url')
    return route.fulfill({ json: url === commentHref ? commentPreview : url === replyHref ? replyPreview : preview })
  })

  await page.goto('/community/1')
  const parent = page.locator('#comment-81')
  const links = parent.getByRole('link', { name: commentHref, exact: true })
  await expect(links).toHaveCount(2)
  await expect(links.first()).toHaveAttribute('href', commentHref)
  await expect(parent.getByText(`확인 (${commentHref}). 다시 ${commentHref}!`, { exact: true })).toBeVisible()
  await expect(parent.getByRole('link', { name: /SQL 안내/ })).toHaveCount(1)
  await expect(parent.getByText('SQL 안내', { exact: true })).toHaveCount(1)
  const popupPromise = page.waitForEvent('popup')
  await links.first().click()
  const popup = await popupPromise
  await expect(popup).toHaveURL(commentHref)
  await popup.close()

  await page.getByRole('button', { name: '답글 더보기', exact: true }).click()
  const reply = page.locator('#comment-82')
  await expect(reply.getByRole('link', { name: replyHref, exact: true })).toHaveAttribute('href', replyHref)
  await expect(reply.getByRole('link', { name: /답글 참고 자료/ })).toBeVisible()
})

test('댓글에서 메타데이터가 없거나 실패하면 원본 링크만 표시한다', async ({ page, api }) => {
  const failedHref = 'https://example.org/failed'
  api.comments.push(comment(83, `${href} ${failedHref} javascript:alert(1)`))
  const barePreview = { ...preview, siteName: 'example.com', title: 'example.com', description: '', imageUrl: null }
  await page.route(previewPattern, (route) => {
    const url = new URL(route.request().url()).searchParams.get('url')
    return url === failedHref
      ? route.fulfill({ status: 502, json: { message: '조회 실패' } })
      : route.fulfill({ json: barePreview })
  })
  const failedResponse = page.waitForResponse((response) =>
    response.status() === 502 && new URL(response.url()).searchParams.get('url') === failedHref)
  await page.goto('/community/1')
  await failedResponse
  const commentBody = page.locator('#comment-83')
  await expect(commentBody.getByRole('link')).toHaveCount(2)
  await expect(commentBody.getByRole('link', { name: href, exact: true })).toHaveAttribute('href', href)
  await expect(commentBody.getByRole('link', { name: failedHref, exact: true })).toHaveAttribute('href', failedHref)
  await expect(commentBody.getByRole('link', { name: 'javascript:alert(1)' })).toHaveCount(0)
})


test('게시글 YouTube 링크는 기존 제목 조회와 누른 뒤 재생을 유지한다', async ({ page, api }) => {
  const videoId = 'dQw4w9WgXcQ'
  const videoHref = `https://youtu.be/${videoId}`
  const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&autoplay=1`
  api.posts.find((post) => post.postId === 1)!.postContent = postWithLink(videoHref)
  await page.route('https://www.youtube.com/oembed?**', (route) =>
    route.fulfill({ headers: { 'Access-Control-Allow-Origin': '*' }, json: { title: 'SQL 학습 영상' } }))
  await page.route((url) => url.href === embedUrl, (route) => route.fulfill({ body: '동영상' }))

  await page.goto('/community/1')
  const body = page.getByRole('region', { name: '게시글 본문' })
  await expect(body.getByRole('link', { name: videoHref, exact: true })).toHaveAttribute('href', videoHref)
  await expect(body.getByRole('link', { name: /SQL 학습 영상/ })).toBeVisible()
  const player = body.locator('iframe')
  await expect(player).toHaveCount(0)
  await body.getByRole('button', { name: 'YouTube 동영상 재생' }).click()
  await expect(player).toHaveAttribute('src', embedUrl)
})
