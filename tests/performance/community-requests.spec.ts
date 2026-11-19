import type { CommentResponse } from '../../src/entities/community/model/types'
import { expect, test } from '../community/fixtures'

function comment(commentId: number, replyCount = 0): CommentResponse {
  return {
    commentId, userId: 42, userName: '테스트 작성자', userProfileImageUrl: '',
    content: `측정 댓글 ${commentId}`, depth: 0, createdAt: '2026-09-30T01:00:00Z',
    isAnonymous: false, deleted: false, replyCount,
  }
}

test('답글 없는 댓글 50개는 전체 답글 수를 중복 조회하지 않는다', async ({ page, api }) => {
  api.comments.push(...Array.from({ length: 50 }, (_, index) => comment(index + 1)))
  await page.goto('/community/101')
  await expect(page.locator('#comment-50')).toContainText('측정 댓글 50')
  expect(api.commentRequests).toBe(1)
  expect(api.replyCountRequests).toEqual([])
})

test('직접 답글이 있으면 삭제 표시된 댓글도 전체 하위 개수를 조회한다', async ({ page, api }) => {
  api.comments.push(comment(1), { ...comment(2, 1), deleted: true, content: '삭제된 댓글입니다.' })
  await page.route('**/api/posts/101/comments/2/total-reply-count', (route) =>
    route.fulfill({ json: { commentId: 2, count: 3 } }))
  const requests: string[] = []
  page.on('request', (request) => {
    if (request.url().endsWith('/total-reply-count')) requests.push(request.url())
  })
  await page.goto('/community/101')
  await expect(page.getByRole('button', { name: '답글 더보기', exact: true })).toHaveCount(1)
  expect(requests).toHaveLength(1)
  expect(requests[0]).toContain('/comments/2/')
})

test('답글 수가 누락되었거나 전체 개수 조회가 실패하면 기존 처리를 유지한다', async ({ page, api }) => {
  void api
  await page.route('**/api/posts/101/comments', (route) => route.fulfill({ json: [
    { ...comment(1), replyCount: undefined }, comment(2, 2),
  ] }))
  await page.route('**/api/posts/101/comments/1/total-reply-count', (route) =>
    route.fulfill({ json: { commentId: 1, count: 4 } }))
  await page.route('**/api/posts/101/comments/2/total-reply-count', (route) =>
    route.fulfill({ status: 503, json: {} }))
  await page.goto('/community/101')
  await expect(page.getByRole('button', { name: '답글 더보기', exact: true })).toHaveCount(2, { timeout: 15_000 })
  await expect(page.locator('#comment-1')).toContainText('측정 댓글 1')
  await expect(page.locator('#comment-2')).toContainText('측정 댓글 2')
})

test('댓글을 재사용해도 입력 시 상대 시간과 답글 표시가 갱신된다', async ({ page, api }) => {
  const now = new Date('2026-11-16T03:00:10Z')
  await page.clock.setFixedTime(now)
  api.comments.push({ ...comment(1), createdAt: '2026-11-16T03:00:00Z' })
  await page.goto('/community/101')
  await expect(page.locator('#comment-1 time')).toHaveText('10초 전')
  await page.clock.setFixedTime(new Date(now.getTime() + 5_000))
  await page.getByRole('textbox', { name: '댓글 내용' }).fill('시간 갱신 확인')
  await expect(page.locator('#comment-1 time')).toHaveText('15초 전')
})

test('최근 댓글의 시간이 입력 없이 초에서 분으로 바뀌고 작성 중 초안을 유지한다', async ({ page, api }) => {
  await page.clock.install({ time: '2026-11-16T02:55:00Z' })
  api.comments.push(...Array.from({ length: 49 }, (_, index) => comment(index + 1)))
  api.comments.push({ ...comment(50), createdAt: '2026-11-16T02:59:01.250Z' })

  await page.goto('/community/101')
  const recentDate = page.locator('#comment-50 time')
  const oldDate = page.locator('#comment-1 time')
  await expect(recentDate).toHaveText('0초 전')
  await page.clock.pauseAt('2026-11-16T03:00:00Z')
  await expect(recentDate).toHaveText('58초 전')
  await expect(oldDate).toHaveText('1개월 전')
  await page.clock.runFor(250)
  await expect(recentDate).toHaveText('59초 전')

  const draft = page.getByRole('textbox', { name: '댓글 내용' })
  await draft.fill('작성 중인 댓글')
  await page.clock.runFor(1_000)
  await expect(recentDate).toHaveText('1분 전')
  await expect(oldDate).toHaveText('1개월 전')
  await expect(draft).toHaveValue('작성 중인 댓글')
})
