import { Buffer } from 'node:buffer'
import type { Page } from '@playwright/test'

import type { CommentResponse } from '../../src/entities/community/model/types'
import type { CreateCommentRequest } from '../../src/features/community/model/types'
import { expect, test } from './fixtures'

const gifUrl = 'https://static.klipy.com/test/comment-cat.gif'
const gifHref = 'https://klipy.com/gifs/comment-cat'
const gifItems = ['comment-cat', 'second-cat'].map((slug, index) => ({
  slug, type: 'gif', title: index === 0 ? '고양이' : '두 번째 고양이',
  content_description: index === 0 ? '웃는 고양이' : '두 번째 고양이',
  file: { sm: { gif: { url: gifUrl, width: 160, height: 160 } } },
}))

function comment(commentId: number, content: string, depth = 0, replyCount = 0): CommentResponse {
  return {
    commentId, content, depth, replyCount, userId: 42, userName: '테스트 작성자',
    userProfileImageUrl: '', createdAt: '2026-09-30T01:00:00Z',
    isAnonymous: false, deleted: false,
  }
}

async function chooseGif(page: Page, label: string, name = '웃는 고양이') {
  await page.getByRole('button', { name: label, exact: true }).click()
  const picker = page.getByRole('dialog', { name: 'GIF 선택', exact: true })
  await picker.getByRole('button', { name: `${name} 삽입`, exact: true }).click()
  await expect(picker).toBeHidden()
}

test.beforeEach(async ({ page, api }) => {
  void api
  await page.route(/^https:\/\/api\.klipy\.com\/api\/v1\/[^/]+\/gifs\/(trending|search|items)/, (route) => route.fulfill({
    json: { result: true, data: { data: gifItems, has_next: false } },
  }))
  await page.route(gifUrl, (route) => route.fulfill({
    contentType: 'image/gif', headers: { 'Access-Control-Allow-Origin': '*' },
    body: Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64'),
  }))
})

test('댓글에 텍스트·GIF·익명 설정을 함께 전송하고 성공하면 첨부를 비운다', async ({ page, api }) => {
  const requests: CreateCommentRequest[] = []
  await page.route('**/api/posts/1/comments', async (route) => {
    if (route.request().method() === 'POST') requests.push(route.request().postDataJSON() as CreateCommentRequest)
    await route.fallback()
  })
  await page.goto('/community/1')
  await page.getByRole('textbox', { name: '댓글 내용' }).fill('반가워요')
  await chooseGif(page, '댓글 GIF 선택')
  const attachment = page.getByRole('group', { name: '댓글 GIF 미리보기' })
  await expect(attachment.getByRole('img', { name: '웃는 고양이' })).toHaveAttribute('referrerpolicy', 'no-referrer')
  await expect(attachment.getByRole('img', { name: '웃는 고양이' })).toHaveAttribute('crossorigin', 'anonymous')
  await page.getByRole('checkbox', { name: '익명으로 게시', exact: true }).check()
  await page.getByRole('button', { name: '댓글 등록', exact: true }).click()
  await expect.poll(() => api.comments.length).toBe(1)
  expect(requests).toEqual([{ content: `반가워요\n${gifHref}`, isAnonymous: true }])
  await expect(attachment).toHaveCount(0)
  await expect(page.getByRole('textbox', { name: '댓글 내용' })).toHaveValue('')
  await expect(page.getByRole('checkbox', { name: '익명으로 게시', exact: true })).not.toBeChecked()
  await expect(page.locator('#comment-501').getByRole('button', { name: '웃는 고양이 크게 보기' })).toBeVisible()
  await expect(page.locator('#comment-501')).not.toContainText(gifHref)
})

test('댓글 GIF를 교체·제거하고 선택창 취소 시 기존 내용을 유지한다', async ({ page }) => {
  await page.goto('/community/1')
  const input = page.getByRole('textbox', { name: '댓글 내용' })
  await input.fill('작성 중인 내용')
  await chooseGif(page, '댓글 GIF 선택')
  await chooseGif(page, '댓글 GIF 선택', '두 번째 고양이')
  const attachment = page.getByRole('group', { name: '댓글 GIF 미리보기' })
  await expect(attachment.getByRole('img', { name: '두 번째 고양이' })).toBeVisible()
  await page.getByRole('button', { name: '댓글 GIF 선택', exact: true }).click()
  await page.keyboard.press('Escape')
  await expect(attachment.getByRole('img', { name: '두 번째 고양이' })).toBeVisible()
  await attachment.getByRole('button', { name: '첨부 GIF 제거' }).click()
  await expect(attachment).toHaveCount(0)
  await expect(input).toHaveValue('작성 중인 내용')
  await expect(page.getByRole('button', { name: '댓글 등록', exact: true })).toBeEnabled()
  await input.fill('')
  await expect(page.getByRole('button', { name: '댓글 등록', exact: true })).toBeDisabled()
})

test('GIF만 선택한 댓글도 Enter로 전송한다', async ({ page, api }) => {
  await page.goto('/community/1')
  await chooseGif(page, '댓글 GIF 선택')
  await page.getByRole('textbox', { name: '댓글 내용' }).press('Enter')
  await expect.poll(() => api.comments.length).toBe(1)
  expect(api.comments[0].content).toBe(gifHref)
  await expect(page.getByRole('group', { name: '댓글 GIF 미리보기' })).toHaveCount(0)
})

for (const kind of ['댓글', '답글'] as const) {
  test(`${kind} 전송 중 첨부 조작을 막고 실패하면 내용·GIF를 유지한 채 재시도한다`, async ({ page, api }) => {
    if (kind === '답글') api.comments.push(comment(501, '부모 댓글'))
    let fail = true
    let release = () => {}
    const gate = new Promise<void>((resolve) => { release = resolve })
    const requests: CreateCommentRequest[] = []
    await page.route('**/api/posts/1/comments', async (route) => {
      if (route.request().method() !== 'POST') return route.fallback()
      const body = route.request().postDataJSON() as CreateCommentRequest
      requests.push(body)
      await gate
      await route.fulfill(fail
        ? { status: 503, json: { message: '전송 실패' } }
        : { json: { ...comment(701, body.content, kind === '답글' ? 1 : 0), isAnonymous: body.isAnonymous } })
    })
    await page.goto('/community/1')
    if (kind === '답글') await page.locator('#comment-501').getByRole('button', { name: '답글 작성', exact: true }).click()
    const input = kind === '댓글'
      ? page.getByRole('textbox', { name: '댓글 내용' })
      : page.getByRole('textbox', { name: '테스트 작성자 댓글에 답글 작성' })
    const submit = page.getByRole('button', { name: kind === '댓글' ? '댓글 등록' : '답글', exact: true })
    await input.fill('실패해도 유지할 내용')
    await chooseGif(page, `${kind} GIF 선택`)
    await submit.click()
    await expect.poll(() => requests.length).toBe(1)
    await expect(input).toBeDisabled()
    await expect(page.getByRole('button', { name: `${kind} GIF 선택`, exact: true })).toBeDisabled()
    await expect(page.getByRole('button', { name: '첨부 GIF 제거' })).toBeDisabled()
    release()
    await expect(page.getByRole('alert').filter({ hasText: `${kind}을 등록하지 못했습니다.` })).toBeVisible()
    await expect(input).toHaveValue('실패해도 유지할 내용')
    await expect(page.getByRole('group', { name: `${kind} GIF 미리보기` })).toBeVisible()
    fail = false
    await submit.click()
    await expect(page.getByRole('group', { name: `${kind} GIF 미리보기` })).toHaveCount(0)
    expect(requests).toHaveLength(2)
    expect(requests[1]).toEqual(requests[0])
  })
}

test('대댓글에 GIF만 익명으로 전송하고 취소 시 첨부를 초기화한다', async ({ page, api }) => {
  api.comments.push(comment(501, '부모 댓글', 0, 1))
  api.replies.set(501, [comment(601, '기존 대댓글', 1)])
  const requests: CreateCommentRequest[] = []
  await page.route('**/api/posts/1/comments', async (route) => {
    if (route.request().method() !== 'POST') return route.fallback()
    const body = route.request().postDataJSON() as CreateCommentRequest
    requests.push(body)
    await route.fulfill({ json: { ...comment(701, body.content, 2), isAnonymous: body.isAnonymous } })
  })
  await page.goto('/community/1')
  await page.getByRole('button', { name: '답글 더보기', exact: true }).click()
  const child = page.locator('#comment-601')
  await child.getByRole('button', { name: '답글 작성', exact: true }).click()
  await chooseGif(page, '답글 GIF 선택')
  await child.getByRole('button', { name: '취소', exact: true }).click()
  await child.getByRole('button', { name: '답글 작성', exact: true }).click()
  await expect(child.getByRole('group', { name: '답글 GIF 미리보기' })).toHaveCount(0)
  await expect(child.getByRole('button', { name: '답글', exact: true })).toBeDisabled()
  await chooseGif(page, '답글 GIF 선택')
  await child.getByRole('checkbox', { name: '익명', exact: true }).check()
  await child.getByRole('button', { name: '답글', exact: true }).click()
  await expect(page.locator('#comment-701').getByRole('button', { name: '웃는 고양이 크게 보기' })).toBeVisible()
  expect(requests).toEqual([{ content: gifHref, isAnonymous: true, parentId: 601 }])
  await expect(child.getByRole('group', { name: '답글 GIF 미리보기' })).toHaveCount(0)
})

test('좁은 화면에서도 댓글·대댓글 GIF 첨부와 도구가 작성 영역 안에 배치된다', async ({ page, api }, testInfo) => {
  api.comments.push(comment(501, '부모 댓글'))
  await page.setViewportSize({ width: 768, height: 844 })
  await page.goto('/community/1')
  await chooseGif(page, '댓글 GIF 선택')
  await page.locator('#comment-501').getByRole('button', { name: '답글 작성', exact: true }).click()
  await chooseGif(page, '답글 GIF 선택')
  for (const label of ['댓글 GIF 선택', '답글 GIF 선택', '첨부 GIF 제거']) {
    for (const button of await page.getByRole('button', { name: label, exact: true }).all()) {
      const box = await button.boundingBox()
      expect(box).not.toBeNull()
      expect(box!.x).toBeGreaterThanOrEqual(0)
      expect(box!.x + box!.width).toBeLessThanOrEqual(768)
    }
  }
  await page.screenshot({ path: testInfo.outputPath('mobile-gif-composers.png'), fullPage: true })
})
