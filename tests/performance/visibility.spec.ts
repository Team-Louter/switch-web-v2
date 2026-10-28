import { test, expect } from '../community/fixtures'

test('visibility 변경 시 통계 요청을 중단하고 복귀하면 한 번 갱신한다', async ({ page, api }) => {
  void api
  let statsRequests = 0
  await page.route('**/api/posts/101/stats', (route) => {
    statsRequests += 1
    return route.fulfill({ json: { viewers: 10, likeCount: 0 } })
  })
  await page.clock.install()
  await page.goto('/community/101')
  await expect(page.getByRole('heading', { name: '고정글 101' })).toBeVisible()
  await page.clock.runFor(5_100)
  await expect.poll(() => statsRequests).toBe(1)
  await page.evaluate(() => {
    Object.defineProperty(document, 'hidden', { configurable: true, value: true })
    document.dispatchEvent(new Event('visibilitychange'))
  })
  await page.clock.runFor(10_000)
  expect(statsRequests).toBe(1)
  await page.evaluate(() => {
    Object.defineProperty(document, 'hidden', { configurable: true, value: false })
    document.dispatchEvent(new Event('visibilitychange'))
  })
  await expect.poll(() => statsRequests).toBe(2)
})
