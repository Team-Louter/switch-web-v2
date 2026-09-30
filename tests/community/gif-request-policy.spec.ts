import { Buffer } from 'node:buffer'

import { serializeBlockNotePostContent } from '../../src/shared/lib/blockNotePostContent'

import { expect, test } from './fixtures'

for (const { host, alignment } of [
  { host: 'static.klipy.com', alignment: 'left' },
  { host: 'static1.klipy.com', alignment: 'center' },
  { host: 'static2.klipy.com', alignment: 'right' },
] as const) {
  test(`${host} GIF의 첫 요청부터 작성·상세·뷰어에서 요청 정책을 유지한다`, async ({ page, context, api }) => {
    const gifUrl = `https://${host}/test/private-gif.gif`
    api.posts.find((post) => post.postId === 1)!.postContent = serializeBlockNotePostContent([{
      id: 'private-gif',
      type: 'image',
      props: {
        backgroundColor: 'default', textAlignment: alignment, name: '보호된 GIF',
        url: gifUrl, caption: '', showPreview: true, previewWidth: 200,
      },
      content: undefined,
      children: [],
    }])
    await context.addCookies([{ name: 'cdn-session', value: 'must-not-send', domain: host, path: '/', secure: true, sameSite: 'None' }])
    const requests: Record<string, string>[] = []
    await page.route(gifUrl, async (route) => {
      requests.push(await route.request().allHeaders())
      await route.fulfill({
        contentType: 'image/gif',
        headers: { 'Access-Control-Allow-Origin': '*', 'Cache-Control': 'no-store' },
        body: Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64'),
      })
    })

    await page.goto('/community/1/edit')
    const editorImage = page.getByRole('img', { name: '보호된 GIF', exact: true })
    await expect(editorImage).toBeVisible()
    await expect(editorImage).toHaveAttribute('referrerpolicy', 'no-referrer')
    await expect(editorImage).toHaveAttribute('crossorigin', 'anonymous')
    await expect.poll(() => requests.length).toBeGreaterThan(0)

    await page.goto('/community/1')
    await page.reload()
    const preview = page.getByRole('button', { name: '보호된 GIF 크게 보기' })
    const bodyImage = preview.getByRole('img', { name: '보호된 GIF' })
    await expect(bodyImage).toBeVisible()
    await expect(bodyImage).toHaveAttribute('referrerpolicy', 'no-referrer')
    await expect(bodyImage).toHaveAttribute('crossorigin', 'anonymous')
    await preview.click()
    const viewerImage = page.getByRole('dialog', { name: '본문 이미지 보기' }).getByRole('img', { name: '보호된 GIF' })
    await expect(viewerImage).toBeVisible()
    await expect(viewerImage).toHaveAttribute('referrerpolicy', 'no-referrer')
    await expect(viewerImage).toHaveAttribute('crossorigin', 'anonymous')

    expect(requests.length).toBeGreaterThanOrEqual(2)
    for (const headers of requests) {
      expect(headers.referer).toBeUndefined()
      expect(headers.cookie).toBeUndefined()
      expect(headers.authorization).toBeUndefined()
      expect(headers.origin).toBe('http://127.0.0.1:4173')
    }
  })
}

test('일반 이미지의 기존 요청 정책과 표시를 유지한다', async ({ page, api }) => {
  const imageUrl = 'https://example.com/uploaded-image.gif'
  api.posts.find((post) => post.postId === 1)!.postContent = serializeBlockNotePostContent([{
    id: 'ordinary-image', type: 'image',
    props: {
      backgroundColor: 'default', textAlignment: 'center', name: '일반 이미지',
      url: imageUrl, caption: '', showPreview: true, previewWidth: 200,
    },
    content: undefined, children: [],
  }])
  await page.route(imageUrl, (route) => route.fulfill({
    contentType: 'image/gif',
    body: Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64'),
  }))
  await page.goto('/community/1/edit')
  const image = page.getByRole('img', { name: '일반 이미지', exact: true })
  await expect(image).toBeVisible()
  expect(await image.getAttribute('referrerpolicy')).toBeNull()
  expect(await image.getAttribute('crossorigin')).toBeNull()
  await page.goto('/community/1')
  await page.getByRole('button', { name: '일반 이미지 크게 보기' }).click()
  const viewer = page.getByRole('dialog', { name: '본문 이미지 보기' }).getByRole('img', { name: '일반 이미지', exact: true })
  await expect(viewer).toBeVisible()
  expect(await viewer.getAttribute('referrerpolicy')).toBeNull()
  expect(await viewer.getAttribute('crossorigin')).toBeNull()
})
