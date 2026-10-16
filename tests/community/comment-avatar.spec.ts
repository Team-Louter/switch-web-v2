import type { Locator, Page } from '@playwright/test'

import type { CommentResponse } from '../../src/entities/community/model/types'
import type { CreateCommentRequest } from '../../src/features/community/model/types'
import { expect, test } from './fixtures'

const avatarUrl = 'http://127.0.0.1:4173/comment-avatar.svg'
const avatarSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"><circle cx="16" cy="16" r="16" fill="#6090e0"/></svg>'

function deferred() {
  let release = () => {}
  const promise = new Promise<void>((resolve) => { release = resolve })
  return { promise, release }
}

function comment(commentId: number, overrides: Partial<CommentResponse> = {}): CommentResponse {
  return {
    commentId, userId: 42, userName: '테스트 작성자', userProfileImageUrl: '',
    content: '부모 댓글', depth: 0, createdAt: '2026-09-30T01:00:00Z',
    isAnonymous: false, deleted: false, replyCount: 0, ...overrides,
  }
}

function avatar(row: Locator) {
  return row.locator('span[aria-busy]')
}

async function mockProfile(page: Page) {
  await page.route('**/api/me', (route) => route.fulfill({ json: {
    userId: 42, userName: '테스트 작성자', role: 'LEADER', grade: 2,
    classRoom: 1, number: 1, majors: [], profileImageUrl: avatarUrl,
  } }))
}

for (const kind of ['댓글', '답글'] as const) {
  test(`익명 ${kind}은 API·이미지 로딩 중 skeleton을 표시하고 확정 시 DOM을 유지한다`, async ({ page, api }) => {
    if (kind === '답글') api.comments.push(comment(501))
    const response = deferred()
    const image = deferred()
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.setViewportSize({ width: 768, height: 844 })
    await mockProfile(page)
    await page.route(avatarUrl, async (route) => {
      await image.promise
      await route.fulfill({ contentType: 'image/svg+xml', body: avatarSvg })
    })
    await page.route('**/api/posts/1/comments', async (route) => {
      if (route.request().method() !== 'POST') return route.fallback()
      const body = route.request().postDataJSON() as CreateCommentRequest
      await response.promise
      await route.fulfill({ json: comment(701, {
        content: body.content, isAnonymous: true, userName: '익명',
        userProfileImageUrl: avatarUrl, depth: kind === '답글' ? 1 : 0,
      }) })
    })
    await page.goto('/community/1', { waitUntil: 'domcontentloaded' })
    if (kind === '답글') {
      await page.locator('#comment-501').getByRole('button', { name: '답글 작성', exact: true }).click()
    }
    const input = page.getByRole('textbox', { name: kind === '댓글' ? '댓글 내용' : '테스트 작성자 댓글에 답글 작성' })
    await input.fill('익명 아바타 회귀 검증')
    await page.getByRole('checkbox', { name: kind === '댓글' ? '익명으로 게시' : '익명', exact: true }).check()
    await page.getByRole('button', { name: kind === '댓글' ? '댓글 등록' : '답글', exact: true }).click()

    const pending = page.locator('[id="comment--1"]')
    await expect(pending).toContainText('익명 아바타 회귀 검증')
    await expect(pending.getByRole('status')).toHaveText('전송 중')
    await expect(pending.locator('img')).toHaveCount(0)
    const slot = avatar(pending)
    await expect(slot).toHaveAttribute('aria-busy', 'true')
    await expect(slot.locator(':scope > [aria-hidden="true"]')).toHaveCSS('animation-name', 'none')
    expect(await slot.evaluate((node) => [node.clientWidth, node.clientHeight])).toEqual([32, 32])
    const pendingNode = await pending.elementHandle()
    const pendingAvatar = await slot.elementHandle()

    response.release()
    const confirmed = page.locator('#comment-701')
    await expect(confirmed).toBeVisible()
    expect(await pendingNode!.evaluate((node) => node === document.getElementById('comment-701'))).toBe(true)
    expect(await pendingAvatar!.evaluate((node) => node === document.querySelector('#comment-701 span[aria-busy]'))).toBe(true)
    await expect(avatar(confirmed)).toHaveAttribute('aria-busy', 'true')
    await expect(confirmed.getByRole('status')).toHaveCount(0)
    await expect(confirmed.getByRole('img', { name: '익명 프로필' })).toBeHidden()

    image.release()
    await expect(confirmed.getByRole('img', { name: '익명 프로필' })).toBeVisible()
    await expect(avatar(confirmed)).toHaveAttribute('aria-busy', 'false')
    await expect(avatar(confirmed).locator(':scope > [aria-hidden="true"]')).toHaveCount(0)
    expect(await avatar(confirmed).evaluate((node) => [node.clientWidth, node.clientHeight])).toEqual([32, 32])
    await expect(confirmed.locator('img[src*="sidebar/profile"]')).toHaveCount(0)
  })
}

for (const imageState of ['empty', 'error'] as const) {
  test(`익명 댓글 응답의 이미지가 ${imageState}이면 skeleton과 깨진 이미지를 남기지 않는다`, async ({ page, api }) => {
    void api
    await page.route(avatarUrl, (route) => route.fulfill({ status: 404 }))
    await page.route('**/api/posts/1/comments', async (route) => {
      if (route.request().method() !== 'POST') return route.fallback()
      await route.fulfill({ json: comment(701, {
        content: '이미지 없는 익명 댓글', isAnonymous: true, userName: '익명',
        userProfileImageUrl: imageState === 'empty' ? '' : avatarUrl,
      }) })
    })
    await page.goto('/community/1', { waitUntil: 'domcontentloaded' })
    await page.getByRole('textbox', { name: '댓글 내용' }).fill('이미지 없는 익명 댓글')
    await page.getByRole('checkbox', { name: '익명으로 게시', exact: true }).check()
    await page.getByRole('button', { name: '댓글 등록', exact: true }).click()
    const row = page.locator('#comment-701')
    await expect(row).toBeVisible()
    await expect(avatar(row)).toHaveAttribute('aria-busy', 'false')
    await expect(avatar(row).locator(':scope > [aria-hidden="true"]')).toHaveCount(0)
    await expect(row.getByRole('img', { name: '익명 프로필' })).toBeHidden()
    if (imageState === 'error') {
      await expect(avatar(row).locator('img')).toHaveAttribute('src', avatarUrl)
    } else {
      await expect(avatar(row).locator('img')).toHaveCount(0)
    }
  })
}

test('일반 댓글의 로드된 프로필은 전송 중과 확정 후 동일한 이미지 DOM을 유지한다', async ({ page, api }) => {
  void api
  const response = deferred()
  await mockProfile(page)
  await page.route(avatarUrl, (route) => route.fulfill({ contentType: 'image/svg+xml', body: avatarSvg }))
  await page.route('**/api/posts/1/comments', async (route) => {
    if (route.request().method() !== 'POST') return route.fallback()
    await response.promise
    await route.fulfill({ json: comment(701, { content: '일반 댓글', userProfileImageUrl: avatarUrl }) })
  })
  await page.goto('/community/1', { waitUntil: 'domcontentloaded' })
  await page.getByRole('textbox', { name: '댓글 내용' }).fill('일반 댓글')
  await page.getByRole('button', { name: '댓글 등록', exact: true }).click()
  const pendingImage = page.locator('[id="comment--1"]').getByRole('img', { name: '테스트 작성자 프로필' })
  await expect(pendingImage).toBeVisible()
  const imageNode = await pendingImage.elementHandle()
  response.release()
  const row = page.locator('#comment-701')
  await expect(row.getByRole('img', { name: '테스트 작성자 프로필' })).toBeVisible()
  expect(await imageNode!.evaluate((node) => node === document.querySelector('#comment-701 img'))).toBe(true)
  await expect(avatar(row)).toHaveAttribute('aria-busy', 'false')
})

test('서버에서 이미지 URL이 바뀌면 새 이미지가 로드될 때까지 이전 이미지를 숨긴다', async ({ page, api }) => {
  void api
  const response = deferred()
  const image = deferred()
  const confirmedUrl = avatarUrl.replace('.svg', '-confirmed.svg')
  await mockProfile(page)
  await page.route(avatarUrl, (route) => route.fulfill({ contentType: 'image/svg+xml', body: avatarSvg }))
  await page.route(confirmedUrl, async (route) => {
    await image.promise
    await route.fulfill({ contentType: 'image/svg+xml', body: avatarSvg })
  })
  await page.route('**/api/posts/1/comments', async (route) => {
    if (route.request().method() !== 'POST') return route.fallback()
    await response.promise
    await route.fulfill({ json: comment(701, { content: '변경된 프로필', userProfileImageUrl: confirmedUrl }) })
  })
  await page.goto('/community/1', { waitUntil: 'domcontentloaded' })
  await page.getByRole('textbox', { name: '댓글 내용' }).fill('변경된 프로필')
  await page.getByRole('button', { name: '댓글 등록', exact: true }).click()
  await expect(page.locator('[id="comment--1"]').getByRole('img')).toBeVisible()
  response.release()
  const row = page.locator('#comment-701')
  await expect(avatar(row)).toHaveAttribute('aria-busy', 'true')
  await expect(row.getByRole('img')).toBeHidden()
  image.release()
  await expect(row.getByRole('img')).toBeVisible()
  await expect(row.getByRole('img')).toHaveAttribute('src', confirmedUrl)
  await expect(avatar(row)).toHaveAttribute('aria-busy', 'false')
})

test('답글 작성창의 프로필 실패도 개구리 이미지로 대체하지 않는다', async ({ page, api }) => {
  api.comments.push(comment(501))
  await mockProfile(page)
  await page.route(avatarUrl, (route) => route.fulfill({ status: 404 }))
  await page.goto('/community/1', { waitUntil: 'domcontentloaded' })
  const row = page.locator('#comment-501')
  await row.getByRole('button', { name: '답글 작성', exact: true }).click()
  await expect(row.getByRole('textbox', { name: '테스트 작성자 댓글에 답글 작성' })).toBeVisible()
  const slots = avatar(row)
  await expect(slots).toHaveCount(2)
  await expect(slots.last()).toHaveAttribute('aria-busy', 'false')
  await expect(slots.last().locator('img')).toBeHidden()
  await expect(slots.last().locator('img')).toHaveAttribute('src', avatarUrl)
})
