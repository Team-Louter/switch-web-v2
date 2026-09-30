import { test, expect } from './fixtures'

test('타자 연습 화면을 오가도 순위와 이전 결과 조회를 재사용한다', async ({ page, api }) => {
  await page.goto('/typing')

  await expect(page.getByRole('heading', { name: '타자 연습' })).toBeVisible()
  await expect.poll(() => api.typingRankingRequests).toEqual(['DAILY'])
  await expect.poll(() => api.typingPreviousResultRequests).toBe(1)

  await page.getByRole('button', { name: '시작하기' }).click()
  await expect(page.getByText('Hello world.', { exact: true })).toBeVisible()

  await page.goBack()

  await expect(page.getByRole('heading', { name: '타자 연습' })).toBeVisible()
  expect(api.typingRankingRequests).toEqual(['DAILY'])
  expect(api.typingPreviousResultRequests).toBe(1)
})
