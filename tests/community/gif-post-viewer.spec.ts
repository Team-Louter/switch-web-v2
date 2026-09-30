import { Buffer } from 'node:buffer'

import { serializeBlockNotePostContent } from '../../src/shared/lib/blockNotePostContent'

import { expect, test } from './fixtures'

const gifUrl = 'https://static.klipy.com/test/post-viewer.gif'

for (const alignment of ['left', 'center', 'right'] as const) {
  test(`${alignment} 정렬한 본문 GIF를 전체 화면 배경 위에서 보고 닫는다`, async ({ page, api }) => {
    api.posts.find((post) => post.postId === 1)!.postContent = serializeBlockNotePostContent([{
      id: 'preview-gif',
      type: 'image',
      props: {
        backgroundColor: 'default',
        textAlignment: alignment,
        name: '본문 고양이',
        url: gifUrl,
        caption: '본문에만 표시하는 설명',
        showPreview: true,
        previewWidth: 745,
      },
      content: undefined,
      children: [],
    }])
    const gif = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64')
    gif.writeUInt16LE(165, 6)
    gif.writeUInt16LE(199, 8)
    await page.route(gifUrl, (route) => route.fulfill({ contentType: 'image/gif', body: gif }))

    await page.goto('/community/1')
    const preview = page.getByRole('button', { name: '본문 고양이 크게 보기' })
    await expect(preview).toBeVisible()
    const bodyImage = preview.getByRole('img', { name: '본문 고양이' })
    await expect(bodyImage).toHaveAttribute('width', '745')
    const originalBox = (await bodyImage.boundingBox())!
    const initialPages = page.context().pages().length

    // 기본 렌더러와 BlockNote 렌더러 모두 마우스·키보드로 동일한 뷰어를 엽니다.
    await preview.press('Enter')
    const dialog = page.getByRole('dialog', { name: '본문 이미지 보기', exact: true })
    const viewerImage = dialog.getByRole('img', { name: '본문 고양이' })
    await expect(viewerImage).toHaveAttribute('src', gifUrl)
    await expect(dialog.getByRole('heading')).toHaveCount(0)
    await expect(dialog).not.toContainText('본문에만 표시하는 설명')
    const close = dialog.getByRole('button', { name: '본문 이미지 보기 닫기' })
    await expect(close).toBeFocused()
    await page.keyboard.press('Tab')
    await expect(close).toBeFocused()
    const viewerBox = (await viewerImage.boundingBox())!
    expect(viewerBox.height).toBeCloseTo(420, 0)
    expect(viewerBox.height / viewerBox.width).toBeCloseTo(199 / 165, 2)
    expect(viewerBox.x + viewerBox.width / 2).toBeCloseTo(720, 0)
    expect(viewerBox.y + viewerBox.height / 2).toBeCloseTo(450, 0)
    const overlayBox = await dialog.evaluate((element) => {
      const rect = element.parentElement!.getBoundingClientRect()
      return { x: rect.x, y: rect.y, width: rect.width, height: rect.height }
    })
    expect(overlayBox).toEqual({ x: 0, y: 0, width: 1440, height: 900 })
    await expect(page).toHaveURL('/community/1')
    expect(page.context().pages()).toHaveLength(initialPages)

    await page.keyboard.press('Escape')
    await expect(dialog).toBeHidden()
    await expect(preview).toBeFocused()
    expect((await bodyImage.boundingBox())!.width).toBeCloseTo(originalBox.width, 0)
    await expect(page.getByText('본문에만 표시하는 설명')).toBeVisible()
    await preview.click()
    await close.click()
    await expect(dialog).toBeHidden()
    await preview.press('Space')
    await expect(dialog).toBeVisible()
    await page.mouse.click(5, 5)
    await expect(dialog).toBeHidden()

    await page.setViewportSize({ width: 390, height: 320 })
    await preview.click()
    await expect(viewerImage).toBeVisible()
    const mobileBox = (await viewerImage.boundingBox())!
    expect(mobileBox.x).toBeGreaterThanOrEqual(20)
    expect(mobileBox.y).toBeGreaterThanOrEqual(40)
    expect(mobileBox.x + mobileBox.width).toBeLessThanOrEqual(370)
    expect(mobileBox.y + mobileBox.height).toBeLessThanOrEqual(280)
    expect(mobileBox.height / mobileBox.width).toBeCloseTo(199 / 165, 2)
    await expect(close).toBeInViewport()
  })
}

test('로드 실패한 본문 GIF는 클릭 뷰어를 열지 않는다', async ({ page, api }) => {
  api.posts.find((post) => post.postId === 1)!.postContent = serializeBlockNotePostContent([
    ...(['left', 'center'] as const).map((alignment) => ({
      id: `failed-${alignment}`,
      type: 'image' as const,
      props: {
        backgroundColor: 'default',
        textAlignment: alignment,
        name: `${alignment} 실패 이미지`,
        url: gifUrl,
        caption: '',
        showPreview: true,
        previewWidth: 200,
      },
      content: undefined,
      children: [],
    })),
  ])
  await page.route(gifUrl, (route) => route.fulfill({ status: 404, body: '' }))
  await page.goto('/community/1')
  await expect(page.getByText('이미지를 불러오지 못했습니다.')).toBeVisible()
  await expect(page.getByRole('button', { name: /실패 이미지 크게 보기/ })).toHaveCount(0)
  await expect(page.getByRole('img', { name: 'center 실패 이미지' })).toBeVisible()
  await page.getByRole('img', { name: 'center 실패 이미지' }).click()
  await expect(page.getByRole('dialog', { name: '본문 이미지 보기', exact: true })).toHaveCount(0)
})
