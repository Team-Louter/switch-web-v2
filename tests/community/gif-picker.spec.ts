import { Buffer } from 'node:buffer'
import type { Page } from '@playwright/test'

import { expect, test } from './fixtures'

const gifApiPattern = /^https:\/\/api\.klipy\.com\/api\/v1\/[^/]+\/gifs\/(trending|search)/
const gifUrl = 'https://static.klipy.com/test/cat.gif'

function gifItem(slug: string, title: string, url = gifUrl) {
  return {
    slug,
    title,
    type: 'gif',
    file: { sm: { gif: { url, width: 100, height: 100 } } },
  }
}

test.beforeEach(async ({ page }) => {
  await page.route('https://static.klipy.com/**', (route) => route.fulfill({
    contentType: 'image/gif',
    body: Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64'),
  }))
})

async function searchGifs(page: Page, query: string) {
  await page.getByRole('searchbox', { name: 'GIF 검색어' }).fill(query)
  await page.getByRole('button', { name: 'GIF 검색', exact: true }).click()
}

test('추가 목록의 GIF를 선택하고 저장·수정 화면에서도 유지한다', async ({ page, api }) => {
  await page.route(gifApiPattern, (route) => {
    const url = new URL(route.request().url())
    const pageNumber = Number(url.searchParams.get('page'))
    return route.fulfill({ json: {
      result: true,
      data: {
        data: pageNumber === 1
          ? [gifItem('first-cat', '첫 고양이')]
          : [gifItem('first-cat', '첫 고양이'), gifItem('second-cat', '두 번째 고양이')],
        has_next: pageNumber === 1,
      },
    } })
  })

  await page.goto('/community/write')
  await page.getByRole('button', { name: 'GIF 선택', exact: true }).click()
  const dialog = page.getByRole('dialog', { name: 'GIF 선택' })
  await expect(dialog.getByRole('button', { name: '첫 고양이 삽입' })).toBeVisible()
  await dialog.getByRole('button', { name: '더 보기' }).click()
  await expect(dialog.getByRole('button', { name: '첫 고양이 삽입' })).toHaveCount(1)
  await dialog.getByRole('button', { name: '두 번째 고양이 삽입' }).click()
  await expect(dialog).toBeHidden()
  const editor = page.getByRole('region', { name: '게시글 내용 편집기' })
  // section은 accessible name이 지정되면 region으로 노출됩니다.
  await expect(editor.getByRole('img', { name: '두 번째 고양이' })).toHaveAttribute('src', gifUrl)

  await page.getByRole('textbox', { name: '게시글 제목' }).fill('GIF만 있는 게시글')
  await page.getByRole('combobox', { name: '카테고리' }).click()
  await page.getByRole('option', { name: '자유게시판' }).click()
  await page.getByRole('button', { name: '게시하기', exact: true }).click()
  await page.waitForURL('**/community/200')
  const savedPost = api.posts.find((post) => post.postId === 200)
  expect(savedPost?.postContent).toContain('SWITCH_BLOCKNOTE:')
  expect(savedPost?.postContent).toContain(gifUrl)
  await expect(page.getByRole('img', { name: '두 번째 고양이' })).toBeVisible()

  await page.goto('/community/200/edit')
  await expect(page.getByRole('img', { name: '두 번째 고양이' })).toHaveAttribute('src', gifUrl)
})

test('검색어를 전달하고 외부 미디어·광고를 제외하며 빈 결과를 안내한다', async ({ page, api }) => {
  void api
  const queries: string[] = []
  await page.route(gifApiPattern, (route) => {
    const url = new URL(route.request().url())
    const query = url.searchParams.get('q') ?? ''
    queries.push(query)
    const items = query === '고양이'
      ? [
        gifItem('safe-cat', '검색 고양이'),
        gifItem('unsafe-cat', '허용하지 않은 이미지', 'https://example.com/cat.gif'),
        { ...gifItem('ad-cat', '광고'), type: 'ad' },
      ]
      : query ? [] : [gifItem('popular-cat', '인기 고양이')]
    return route.fulfill({ json: { result: true, data: { data: items, has_next: false } } })
  })

  await page.goto('/community/write')
  await page.getByRole('button', { name: 'GIF 선택', exact: true }).click()
  await expect(page.getByRole('button', { name: '인기 고양이 삽입' })).toBeVisible()
  await searchGifs(page, ' 고양이 ')
  await expect(page.getByRole('button', { name: '검색 고양이 삽입' })).toBeVisible()
  expect(queries).toContain('고양이')
  await expect(page.getByRole('button', { name: '허용하지 않은 이미지 삽입' })).toHaveCount(0)
  await expect(page.getByRole('button', { name: '광고 삽입' })).toHaveCount(0)
  await searchGifs(page, '없는 검색어')
  await expect(page.getByRole('status')).toContainText('검색 결과가 없어요.')
  await page.getByRole('searchbox', { name: 'GIF 검색어' }).press('Escape')
  await expect(page.getByRole('dialog', { name: 'GIF 선택' })).toBeHidden()
})

test('조회 실패 후 재시도하면 GIF 목록을 복구한다', async ({ page, api }) => {
  void api
  let shouldFail = true
  await page.route(gifApiPattern, (route) => route.fulfill(shouldFail
    ? { status: 503, json: { message: '일시적인 조회 실패' } }
    : { json: { result: true, data: { data: [gifItem('recovered-cat', '복구 고양이')], has_next: false } } },
  ))

  await page.goto('/community/write')
  await page.getByRole('button', { name: 'GIF 선택', exact: true }).click()
  await expect(page.getByRole('alert')).toContainText('GIF를 불러오지 못했어요.')
  shouldFail = false
  await page.getByRole('button', { name: '다시 시도', exact: true }).click()
  await expect(page.getByRole('button', { name: '복구 고양이 삽입' })).toBeVisible()
  await expect(page.getByRole('alert')).toHaveCount(0)
})
