import { expect, test } from '../community/fixtures'

test('게시글 hover는 상세 코드만 준비하고 클릭할 때 상세 API를 한 번 호출한다', async ({ page, api }) => {
  void api
  const requests: string[] = []
  page.on('request', (request) => requests.push(request.url()))
  await page.goto('/community')
  const post = page.getByRole('link').filter({ hasText: '고정글 101' })
  await expect(post).toBeVisible()
  expect(requests.some((url) => /\/assets\/CommunityDetailPage-/.test(url))).toBe(false)
  expect(requests.some((url) => /\/assets\/CommunityWritePage-/.test(url))).toBe(false)
  await post.hover()
  await expect.poll(() => requests.filter((url) => /\/assets\/CommunityDetailPage-/.test(url)).length).toBe(1)
  expect(requests.filter((url) => /\/api\/posts\/101(?:\?|$)/.test(url))).toEqual([])
  await post.click()
  await expect(page.getByRole('heading', { name: /고정글 101$/ })).toBeVisible()
  expect(requests.filter((url) => /\/assets\/CommunityDetailPage-/.test(url))).toHaveLength(1)
  expect(requests.filter((url) => /\/api\/posts\/101(?:\?|$)/.test(url))).toHaveLength(1)
})

test('글쓰기와 사이드바의 키보드 포커스는 화면 코드만 준비한다', async ({ page, api }) => {
  void api
  const requests: string[] = []
  page.on('request', (request) => requests.push(request.url()))
  await page.goto('/community')
  await expect(page.getByText('게시글 1', { exact: true })).toBeVisible()
  await page.getByRole('button', { name: '홈', exact: true }).focus()
  await expect.poll(() => requests.some((url) => /\/assets\/home-/.test(url))).toBe(true)
  expect(requests.filter((url) => /\/api\/(?:schedules|members|posts\/hot)/.test(url))).toEqual([])
  const write = page.getByRole('button', { name: '글쓰기', exact: true })
  await write.focus()
  await expect.poll(() => requests.filter((url) => /\/assets\/CommunityWritePage-/.test(url)).length).toBe(1)
  await expect(page.locator('.tiptap[contenteditable="true"]')).toHaveCount(0)
  await write.press('Enter')
  await expect(page.getByRole('textbox', { name: '게시글 제목' })).toBeVisible()
  await expect(page.locator('.tiptap[contenteditable="true"]')).toBeVisible()
  expect(requests.filter((url) => /\/assets\/CommunityWritePage-/.test(url))).toHaveLength(1)
})

test('사전 로딩 실패는 현재 목록과 다른 메뉴 사용을 막지 않는다', async ({ page, api }) => {
  void api
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.route(/\/assets\/CommunityWritePage-[^/]+\.js$/, (route) => route.abort('failed'))
  await page.goto('/community')
  await page.getByRole('button', { name: '글쓰기', exact: true }).hover()
  await expect(page.getByText('게시글 1', { exact: true })).toBeVisible()
  await page.getByRole('button', { name: '타자연습', exact: true }).click()
  await expect(page.getByRole('heading', { name: '타자 연습' })).toBeVisible()
  expect(errors).toEqual([])
})
