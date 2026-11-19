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

for (const entry of ['글쓰기', '수정하기'] as const) {
  test(`${entry} 진입 중 실패한 사전 로딩은 스타일을 다시 받은 후 에디터를 표시한다`, async ({ page, api }) => {
    void api
    if (entry === '수정하기') {
      await page.goto('/community/1')
      await page.getByRole('button', { name: '게시글 관리 메뉴' }).click()
    } else {
      await page.goto('/community')
    }
    const button = page.getByRole(entry === '수정하기' ? 'menuitem' : 'button', { name: entry, exact: true })
    await expect(button).toBeVisible()

    let attempts = 0
    let release = () => {}
    const gate = new Promise<void>((resolve) => { release = resolve })
    await page.route('**/assets/*.css', async (route) => {
      if (++attempts === 1) {
        await gate
        await route.abort('failed')
      } else {
        await route.continue()
      }
    })
    try {
      await button.hover()
      await expect.poll(() => attempts).toBe(1)
      await button.click()
      await expect(page).toHaveURL(entry === '수정하기' ? /\/community\/1\/edit$/ : /\/community\/write$/)
      await expect(page.locator('.tiptap[contenteditable="true"]')).toHaveCount(0)
    } finally {
      release()
    }
    await expect(page.locator('.tiptap .bn-block').first()).toHaveCSS('display', 'flex')
    expect(attempts).toBe(2)
  })
}

test('스타일 재시도도 실패하면 오류를 표시하고 새로고침으로 복구한다', async ({ page, api }) => {
  void api
  await page.goto('/community')
  const button = page.getByRole('button', { name: '글쓰기', exact: true })
  await expect(button).toBeVisible()

  let attempts = 0
  await page.route('**/assets/*.css', (route) => {
    attempts++
    return route.abort('failed')
  })
  const failedRequest = page.waitForEvent('requestfailed', (request) => request.resourceType() === 'stylesheet')
  await button.focus()
  await failedRequest
  await button.click()
  await expect(page.getByRole('alert')).toContainText('화면을 불러오지 못했습니다')
  await expect(page.locator('.tiptap[contenteditable="true"]')).toHaveCount(0)
  expect(attempts).toBe(2)

  await page.unroute('**/assets/*.css')
  await page.getByRole('button', { name: '새로고침' }).click()
  await expect(page.locator('.tiptap .bn-block').first()).toHaveCSS('display', 'flex')
})
