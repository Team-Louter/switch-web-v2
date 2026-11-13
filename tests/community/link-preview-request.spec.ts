import type { Request } from '@playwright/test'

import type { LinkPreviewResponse } from '../../src/entities/community/model/linkPreview'
import { serializeBlockNotePostContent } from '../../src/shared/lib/blockNotePostContent'
import { accessToken, expect, test } from './fixtures'

const href = 'https://example.com/practice?topic=sql&level=1'
const previewPattern = '**/api/link-preview?**'
const preview: LinkPreviewResponse = {
  title: '실기 문제은행',
  description: 'SQL 실전형 문제를 연습하세요.',
  siteName: '실기연구소',
  imageUrl: null,
  imageAlt: '',
  layout: 'large',
}

test.beforeEach(async ({ api, context }) => {
  api.posts.find((post) => post.postId === 1)!.postContent = serializeBlockNotePostContent([{
    id: 'public-link', type: 'paragraph',
    props: { backgroundColor: 'default', textColor: 'default', textAlignment: 'left' }, children: [],
    content: [{ type: 'text', text: href, styles: {} }],
  }])
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
  const card = page.getByRole('region', { name: '게시글 본문' }).getByRole('link')
  await expect(card).toContainText(preview.title)
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

for (const status of [401, 502]) {
  test(`미리보기 ${status} 응답은 원본 링크를 유지하고 로그인 갱신·해제를 유발하지 않는다`, async ({ page }) => {
    const authRequests: string[] = []
    page.on('request', (request) => {
      if (new URL(request.url()).pathname.startsWith('/api/auth/')) authRequests.push(request.url())
    })
    await page.route(previewPattern, (route) => route.fulfill({ status, json: { message: '조회 실패' } }))
    const failedResponse = page.waitForResponse(previewPattern)
    await page.goto('/community/1')
    await (await failedResponse).finished()
    const card = page.getByRole('region', { name: '게시글 본문' }).getByRole('link')
    await expect(card).toHaveAttribute('href', href)
    await expect(card).toContainText('example.com')
    await expect(card).not.toContainText(preview.title)
    await expect(page).toHaveURL('/community/1')
    expect(await page.evaluate(() => localStorage.getItem('accessToken'))).toBe(accessToken)
    expect(authRequests).toEqual([])
  })
}
