import { Buffer } from 'node:buffer'

import { expect, test } from './fixtures'

const gifHref = 'https://klipy.com/gifs/preview-cat'
const gifUrl = 'https://static.klipy.com/test/preview-cat.gif'
const gifApiPattern = /^https:\/\/api\.klipy\.com\/api\/v1\/[^/]+\/gifs\/items/

test.beforeEach(async ({ page, api }) => {
  api.comments.push({
    commentId: 501,
    userId: 42,
    userName: '테스트 작성자',
    userProfileImageUrl: '',
    content: `고양이 GIF ${gifHref}`,
    depth: 0,
    createdAt: '2026-09-30T01:00:00Z',
    isAnonymous: false,
    deleted: false,
    replyCount: 0,
  })
  await page.route(gifApiPattern, (route) => route.fulfill({ json: {
    result: true,
    data: { data: [{
      slug: 'preview-cat',
      title: '고양이',
      file: { sm: { gif: { url: gifUrl, width: 160, height: 160 } } },
    }] },
  } }))
  await page.route(gifUrl, (route) => route.fulfill({
    contentType: 'image/gif', headers: { 'Access-Control-Allow-Origin': '*' },
    body: Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64'),
  }))
})

test('댓글 GIF만 확대하고 외부 이동 방지·닫기·포커스 복귀·작은 화면 배치를 유지한다', async ({ page }) => {
  await page.goto('/community/1')
  const preview = page.getByRole('button', { name: '고양이 크게 보기' })
  await expect(preview).toBeVisible()
  await expect(page.getByText('Powered by KLIPY')).toHaveCount(0)
  await expect(page.getByRole('link', { name: gifHref })).toHaveCount(0)
  const previewBox = await preview.boundingBox()
  expect(previewBox).not.toBeNull()
  const initialPages = page.context().pages().length

  await preview.click()
  const dialog = page.getByRole('dialog', { name: 'GIF 크게 보기', exact: true })
  const expandedImage = dialog.getByRole('img', { name: '고양이' })
  await expect(expandedImage).toHaveAttribute('src', gifUrl)
  await expect(dialog.getByRole('heading')).toHaveCount(0)
  const closeButton = dialog.getByRole('button', { name: 'GIF 크게 보기 닫기' })
  await expect(closeButton).toBeFocused()
  await page.keyboard.press('Tab')
  await expect(closeButton).toBeFocused()
  await page.keyboard.press('Shift+Tab')
  await expect(closeButton).toBeFocused()
  const expandedBox = await expandedImage.boundingBox()
  expect(expandedBox).not.toBeNull()
  expect(expandedBox!.width).toBeGreaterThan(previewBox!.width)
  await expect(page).toHaveURL('/community/1')
  expect(page.context().pages()).toHaveLength(initialPages)
  await page.keyboard.press('Escape')
  await expect(dialog).toBeHidden()
  await expect(preview).toBeFocused()

  await preview.click()
  await dialog.getByRole('button', { name: 'GIF 크게 보기 닫기' }).click()
  await expect(dialog).toBeHidden()
  await expect(preview).toBeFocused()
  await preview.click()
  await page.mouse.click(5, 5)
  await expect(dialog).toBeHidden()

  await page.setViewportSize({ width: 390, height: 320 })
  await preview.click()
  const mobileBox = await dialog.boundingBox()
  expect(mobileBox).not.toBeNull()
  expect(mobileBox!.x).toBeGreaterThanOrEqual(0)
  expect(mobileBox!.y).toBeGreaterThanOrEqual(0)
  expect(mobileBox!.x + mobileBox!.width).toBeLessThanOrEqual(390)
  expect(mobileBox!.y + mobileBox!.height).toBeLessThanOrEqual(320)
  await expect(closeButton).toBeInViewport()
  const closeBox = await closeButton.boundingBox()
  expect(closeBox).not.toBeNull()
  expect(closeBox!.y).toBeLessThanOrEqual(20)
  expect(closeBox!.x + closeBox!.width).toBeGreaterThanOrEqual(370)
})

test('Powered 문구를 제거해도 API가 제공하는 제작자와 콘텐츠 출처는 표시한다', async ({ page }) => {
  await page.route(gifApiPattern, (route) => route.fulfill({ json: {
    result: true,
    data: { data: [{
      slug: 'preview-cat',
      title: '고양이',
      username: '테스트 제작자',
      source: 'Test Studio',
      file: { sm: { gif: { url: gifUrl, width: 160, height: 160 } } },
    }] },
  } }))
  await page.goto('/community/1')
  await expect(page.getByText('출처: 테스트 제작자')).toBeVisible()
  await expect(page.getByText('· Test Studio')).toBeVisible()
  await expect(page.getByText('Powered by KLIPY')).toHaveCount(0)
})

test('댓글 GIF 이미지를 불러오지 못하면 원본 링크를 표시한다', async ({ page }) => {
  await page.route(gifUrl, (route) => route.fulfill({ status: 404, body: '' }))
  await page.goto('/community/1')
  await expect(page.getByRole('link', { name: gifHref })).toHaveAttribute('href', gifHref)
  await expect(page.getByRole('button', { name: '고양이 크게 보기' })).toHaveCount(0)
  await expect(page.getByRole('dialog', { name: 'GIF 크게 보기', exact: true })).toHaveCount(0)
})

test('공유용 접미사와 API 응답 slug가 달라도 기존 댓글 GIF를 표시하고 새로고침 후 유지한다', async ({ page, api }) => {
  const sharedSlug = 'cute-dog-181--k9DMkoX1H'
  const href = `https://klipy.com/gifs/${sharedSlug}`
  api.comments[0].content = `기존 댓글 ${href}`
  const requestedSlugs: string[] = []
  await page.route(gifApiPattern, (route) => {
    requestedSlugs.push(new URL(route.request().url()).searchParams.get('slugs') ?? '')
    return route.fulfill({ json: {
      result: true,
      data: { data: [{
        slug: 'cute-dog-181', title: '웃는 강아지',
        file: { sm: { gif: { url: gifUrl, width: 160, height: 160 } } },
      }] },
    } })
  })
  await page.goto('/community/1')
  const image = page.locator('#comment-501').getByRole('img', { name: '웃는 강아지' })
  await expect(image).toBeVisible()
  await expect.poll(() => image.evaluate((element) => (element as HTMLImageElement).naturalWidth)).toBeGreaterThan(0)
  await expect(page.getByRole('link', { name: href })).toHaveCount(0)
  await page.reload()
  await expect(image).toBeVisible()
  await expect(page.getByRole('link', { name: href })).toHaveCount(0)
  expect(requestedSlugs.length).toBeGreaterThanOrEqual(2)
  expect(new Set(requestedSlugs)).toEqual(new Set([sharedSlug]))
})

test('접미사와 다른 식별자의 응답은 표시하지 않고 원본 링크를 유지한다', async ({ page, api }) => {
  const href = 'https://klipy.com/gifs/cute-dog-181--k9DMkoX1H'
  api.comments[0].content = href
  await page.route(gifApiPattern, (route) => route.fulfill({ json: {
    result: true,
    data: { data: [{
      slug: 'another-dog', title: '다른 강아지',
      file: { sm: { gif: { url: gifUrl, width: 160, height: 160 } } },
    }] },
  } }))
  const responsePromise = page.waitForResponse(gifApiPattern)
  await page.goto('/community/1')
  const response = await responsePromise
  await response.finished()
  await page.evaluate(() => new Promise<void>((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
  }))
  await expect(page.getByRole('link', { name: href })).toHaveAttribute('href', href)
  await expect(page.getByRole('img', { name: '다른 강아지' })).toHaveCount(0)
})

test('원본 slug와 접미사를 제외한 slug 응답이 함께 있으면 원본 일치 항목을 우선한다', async ({ page, api }) => {
  const sharedSlug = 'cute-dog-181--k9DMkoX1H'
  api.comments[0].content = `https://klipy.com/gifs/${sharedSlug}`
  await page.route(gifApiPattern, (route) => route.fulfill({ json: {
    result: true,
    data: { data: ['cute-dog-181', sharedSlug].map((slug) => ({
      slug, title: slug === sharedSlug ? '원본 강아지' : '기본 강아지',
      file: { sm: { gif: { url: gifUrl, width: 160, height: 160 } } },
    })) },
  } }))
  await page.goto('/community/1')
  await expect(page.getByRole('img', { name: '원본 강아지' })).toBeVisible()
  await expect(page.getByRole('img', { name: '기본 강아지' })).toHaveCount(0)
})
