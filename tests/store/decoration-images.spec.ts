import type { Page } from '@playwright/test'

import type { ShopItemListResponse, ShopItemResponse } from '../../src/entities/store/model/types'
import { accessToken, expect, test } from '../community/fixtures'

const decorations = [
  { name: '두쫀쿠', filename: '0aa8639a-c611-4a9f-b171-48494d7efcd4.png', asset: 'cookie-frame' },
  { name: '호박냥이', filename: '598b5cf0-38ef-446b-9d88-225704a7adde.png', asset: 'halloween-cat-frame' },
  { name: 'Happy Halloween', filename: '3cd2bfc3-2ea5-474e-85fc-cdeb85959a7d.png', asset: 'halloween-frame' },
  { name: 'Papaya', filename: '4169d6c8-bc96-4b93-b7bc-3f463c8626fc.png', asset: 'papaya-frame' },
]

function border(itemId: number, itemName: string, imageUrl: string): ShopItemResponse {
  return {
    itemId, itemName, imageUrl, itemType: 'BORDER', itemPrice: 100,
    equipped: false, owned: true, purchasable: true,
  }
}

async function openBorderOptions(page: Page, items: ShopItemResponse[]) {
  const response: ShopItemListResponse = { items }
  await page.route('**/api/shop/items**', (route) => route.fulfill({ json: response }))
  await page.route('**/api/shop/points', (route) => route.fulfill({ json: 1000 }))
  await page.goto('/store?customize=1')
  const dialog = page.getByRole('dialog')
  await expect(dialog).toHaveAttribute('aria-busy', 'false')
  await dialog.getByRole('button', { name: '테두리', exact: true }).click()
  return dialog
}

test('꾸미기 옵션은 로컬 축소 WebP를 표시하고 백엔드에 에셋이나 원본 이미지를 요청하지 않는다', async ({ page, api }) => {
  void api
  const unexpectedRequests: string[] = []
  await page.route('**/api/**', async (route) => {
    const path = new URL(route.request().url()).pathname
    if (/^\/api\/(?:src|assets)\//.test(path) || decorations.some(({ filename }) => path.endsWith(filename))) {
      unexpectedRequests.push(path)
      // 잘못된 API 경로가 200 JSON을 반환해도 유효한 이미지를 blob으로 덮지 않아야 한다.
      await route.fulfill({ json: { message: '이미지가 아닌 API 응답' } })
      return
    }
    await route.fallback()
  })

  const items = decorations.map(({ name, filename }, index) =>
    border(index + 1, name, `/profiles/${filename}?signature=fixture`),
  )
  const dialog = await openBorderOptions(page, items)
  await page.waitForLoadState('networkidle')

  expect(unexpectedRequests).toEqual([])
  for (const { name, asset } of decorations) {
    const image = dialog.getByRole('button', { name, exact: true }).locator('img')
    await expect(image).toHaveAttribute('src', new RegExp(`/${asset}-small\\.webp(?:\\?|$)`))
    expect(await image.evaluate((node: HTMLImageElement) => [node.naturalWidth, node.naturalHeight])).toEqual([128, 128])
  }
})

test('미등록 API 테두리는 인증 요청과 blob 이미지 표시를 유지한다', async ({ page, api }) => {
  void api
  const authorizationHeaders: (string | undefined)[] = []
  await page.route('**/api/profiles/unmapped-frame.svg', async (route) => {
    authorizationHeaders.push(route.request().headers().authorization)
    await route.fulfill({
      contentType: 'image/svg+xml',
      body: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"><circle cx="16" cy="16" r="14" fill="gold"/></svg>',
    })
  })

  const dialog = await openBorderOptions(page, [border(10, '미등록 테두리', '/profiles/unmapped-frame.svg')])
  const image = dialog.getByRole('button', { name: '미등록 테두리', exact: true }).locator('img')
  await expect(image).toHaveAttribute('src', /^blob:/)
  await expect.poll(() => image.evaluate((node: HTMLImageElement) => node.naturalWidth)).toBe(32)
  expect(authorizationHeaders).toContain(`Bearer ${accessToken}`)
})
