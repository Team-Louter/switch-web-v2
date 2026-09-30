import { Buffer } from 'node:buffer'
import type { Page } from '@playwright/test'

import { serializeBlockNotePostContent } from '../../src/shared/lib/blockNotePostContent'

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

test('드래그로 GIF의 실제 크기를 늘리고 저장·상세·수정 화면에서 유지한다', async ({ page, api }) => {
  void api
  // 세로 GIF를 520px 이상으로 확대해 기존 높이 제한으로 비율이 깨지는 회귀를 검증합니다.
  const gif = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64')
  gif.writeUInt16LE(100, 6)
  gif.writeUInt16LE(150, 8)
  const verticalGif = gifItem('resizable-cat', '크기 조절 고양이')
  verticalGif.file.sm.gif.height = 150
  await page.route(gifUrl, (route) => route.fulfill({ contentType: 'image/gif', body: gif }))
  await page.route(gifApiPattern, (route) => route.fulfill({ json: {
    result: true,
    data: { data: [verticalGif], has_next: false },
  } }))

  await page.goto('/community/write')
  await page.getByRole('button', { name: 'GIF 선택', exact: true }).click()
  await page.getByRole('button', { name: '크기 조절 고양이 삽입' }).click()
  const editor = page.getByRole('region', { name: '게시글 내용 편집기' })
  const image = editor.getByRole('img', { name: '크기 조절 고양이' })
  await expect(image).toBeVisible()
  const initialBox = await image.boundingBox()
  expect(initialBox).not.toBeNull()
  const naturalWidth = await image.evaluate((element) => (element as HTMLImageElement).naturalWidth)
  expect(naturalWidth).toBe(100)
  const renderScale = initialBox!.width / naturalWidth
  await image.hover()
  const wrapper = editor.locator('[data-content-type="image"] .bn-file-block-content-wrapper')
  const resizeHandle = wrapper.locator('.bn-resize-handle').last()
  await expect(resizeHandle).toBeVisible()
  const handleBox = await resizeHandle.boundingBox()
  expect(handleBox).not.toBeNull()
  const handleX = handleBox!.x + handleBox!.width / 2
  const handleY = handleBox!.y + handleBox!.height / 2
  await page.mouse.move(handleX, handleY)
  await page.mouse.down()
  await page.mouse.move(handleX + 260, handleY, { steps: 12 })
  await page.mouse.up()
  await expect.poll(async () => Number(await image.getAttribute('width'))).toBeGreaterThan(350)
  const resizedBox = await image.boundingBox()
  const wrapperBox = await wrapper.boundingBox()
  expect(resizedBox).not.toBeNull()
  expect(wrapperBox).not.toBeNull()
  expect(resizedBox!.width).toBeGreaterThan(initialBox!.width + 200)
  expect(resizedBox!.width).toBeCloseTo(wrapperBox!.width, 0)
  expect(resizedBox!.height / resizedBox!.width).toBeCloseTo(1.5, 2)
  expect(resizedBox!.height).toBeGreaterThan(520 * renderScale)
  const resizedWidth = await image.getAttribute('width')

  await page.getByRole('textbox', { name: '게시글 제목' }).fill('GIF 크기 조절')
  await page.getByRole('combobox', { name: '카테고리' }).click()
  await page.getByRole('option', { name: '자유게시판' }).click()
  await page.getByRole('button', { name: '게시하기', exact: true }).click()
  await page.waitForURL('**/community/200')
  const savedImage = page.getByRole('img', { name: '크기 조절 고양이' })
  await expect(savedImage).toHaveAttribute('width', resizedWidth!)
  const savedBox = await savedImage.boundingBox()
  expect(savedBox?.width).toBeCloseTo(resizedBox!.width, 0)

  await page.goto('/community/200/edit')
  const restoredImage = page.getByRole('img', { name: '크기 조절 고양이' })
  await expect(restoredImage).toHaveAttribute('width', resizedWidth!)
  await expect.poll(async () => (await restoredImage.boundingBox())?.width).toBeCloseTo(resizedBox!.width, 0)
})

for (const alignment of ['center', 'right'] as const) {
  test(`${alignment} 정렬한 GIF의 저장된 폭과 비율을 상세 화면에서 유지한다`, async ({ page, api }) => {
    const post = api.posts.find((item) => item.postId === 1)!
    post.postContent = serializeBlockNotePostContent([{
      id: 'aligned-gif',
      type: 'image',
      props: {
        backgroundColor: 'default',
        textAlignment: alignment,
        name: '정렬한 고양이',
        url: gifUrl,
        caption: 'GIF 설명',
        showPreview: true,
        previewWidth: 745,
      },
      content: undefined,
      children: [],
    }])
    const gif = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64')
    gif.writeUInt16LE(100, 6)
    gif.writeUInt16LE(150, 8)
    await page.route(gifUrl, (route) => route.fulfill({ contentType: 'image/gif', body: gif }))

    await page.goto('/community/1')
    const body = page.getByRole('textbox', { name: '게시글 본문' })
    const image = body.getByRole('img', { name: '정렬한 고양이' })
    await expect(image).toHaveAttribute('width', '745')
    await expect.poll(() => image.evaluate((element) => (element as HTMLImageElement).naturalWidth)).toBe(100)
    const wrapper = body.locator('[data-content-type="image"] .bn-file-block-content-wrapper')
    const imageBox = (await image.boundingBox())!
    const wrapperBox = (await wrapper.boundingBox())!
    expect(imageBox.width).toBeCloseTo(wrapperBox.width, 0)
    expect(imageBox.width).toBeGreaterThan(640)
    expect(imageBox.height / imageBox.width).toBeCloseTo(1.5, 2)
    await expect(body.locator('[data-content-type="image"]')).toHaveAttribute('data-text-alignment', alignment)
    await expect(body.getByText('GIF 설명')).toBeVisible()

    await page.setViewportSize({ width: 390, height: 700 })
    const mobileImage = (await image.boundingBox())!
    const mobileBody = (await body.boundingBox())!
    expect(mobileImage.width).toBeLessThanOrEqual(mobileBody.width)
    expect(mobileImage.height / mobileImage.width).toBeCloseTo(1.5, 2)
  })
}

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

test('입력 즉시 검색하고 이전 요청을 취소하며 검색어를 지우면 인기 GIF로 돌아간다', async ({ page, api }) => {
  void api
  const queries: string[] = []
  let releaseOldSearch = () => {}
  let finishOldResponse = () => {}
  const oldSearchGate = new Promise<void>((resolve) => { releaseOldSearch = resolve })
  const oldResponseFinished = new Promise<void>((resolve) => { finishOldResponse = resolve })

  await page.route(gifApiPattern, async (route) => {
    const query = new URL(route.request().url()).searchParams.get('q') ?? ''
    queries.push(query)
    if (query === '고') await oldSearchGate
    await route.fulfill({ json: {
      result: true,
      data: {
        data: [gifItem(query ? `cat-${query === '고' ? 'old' : 'new'}` : 'popular-cat',
          query === '고' ? '이전 검색 고양이' : query ? '최신 검색 고양이' : '인기 고양이')],
        has_next: false,
      },
    } })
    if (query === '고') finishOldResponse()
  })

  await page.goto('/community/write')
  await page.getByRole('button', { name: 'GIF 선택', exact: true }).click()
  const dialog = page.getByRole('dialog', { name: 'GIF 선택' })
  const input = dialog.getByRole('searchbox', { name: 'GIF 검색어' })
  await expect(dialog.getByRole('button', { name: '인기 고양이 삽입' })).toBeVisible()
  await expect(dialog.getByRole('button', { name: 'GIF 검색', exact: true })).toHaveCount(0)

  await input.fill('고')
  await expect.poll(() => queries).toContain('고')
  const canceledRequest = page.waitForEvent('requestfailed', (request) =>
    new URL(request.url()).searchParams.get('q') === '고')
  await input.fill('고양이')
  await canceledRequest
  await expect(dialog.getByRole('button', { name: '최신 검색 고양이 삽입' })).toBeVisible()
  expect(queries).toContain('고양이')
  releaseOldSearch()
  await oldResponseFinished
  await expect(dialog.getByRole('button', { name: '이전 검색 고양이 삽입' })).toHaveCount(0)
  await expect(dialog.getByRole('button', { name: '최신 검색 고양이 삽입' })).toBeVisible()

  await input.fill('')
  await expect(dialog.getByText('인기 GIF', { exact: true })).toBeVisible()
  await expect(dialog.getByRole('button', { name: '인기 고양이 삽입' })).toBeVisible()
  await expect(dialog.getByRole('button', { name: '최신 검색 고양이 삽입' })).toHaveCount(0)
})

test('조회·이미지·추가 목록 로딩을 표시하고 작은 화면 안에 모달을 유지한다', async ({ page, api }) => {
  void api
  let releaseList = () => {}
  let releaseImage = () => {}
  let releaseNextPage = () => {}
  const listGate = new Promise<void>((resolve) => { releaseList = resolve })
  const imageGate = new Promise<void>((resolve) => { releaseImage = resolve })
  const nextPageGate = new Promise<void>((resolve) => { releaseNextPage = resolve })

  await page.route(gifApiPattern, async (route) => {
    const pageNumber = Number(new URL(route.request().url()).searchParams.get('page'))
    await (pageNumber === 1 ? listGate : nextPageGate)
    await route.fulfill({ json: {
      result: true,
      data: {
        data: [gifItem(`loading-cat-${pageNumber}`, `로딩 고양이 ${pageNumber}`)],
        has_next: pageNumber === 1,
      },
    } })
  })
  await page.route(gifUrl, async (route) => {
    await imageGate
    await route.fallback()
  })

  await page.goto('/community/write')
  await page.getByRole('button', { name: 'GIF 선택', exact: true }).click()
  const dialog = page.getByRole('dialog', { name: 'GIF 선택' })
  const loading = dialog.getByRole('status', { name: 'GIF를 불러오는 중입니다.' })
  await expect(loading).toBeVisible()
  await expect(loading.locator('[aria-hidden="true"]')).toHaveCount(6)
  const desktopBox = await dialog.boundingBox()
  expect(desktopBox?.width).toBeLessThan(560)
  expect(desktopBox?.height).toBeLessThan(700)

  await page.setViewportSize({ width: 390, height: 480 })
  const mobileBox = await dialog.boundingBox()
  expect(mobileBox).not.toBeNull()
  expect(mobileBox!.x).toBeGreaterThanOrEqual(20)
  expect(mobileBox!.y).toBeGreaterThanOrEqual(20)
  expect(mobileBox!.x + mobileBox!.width).toBeLessThanOrEqual(370)
  expect(mobileBox!.y + mobileBox!.height).toBeLessThanOrEqual(460)

  releaseList()
  const firstGif = dialog.getByRole('button', { name: '로딩 고양이 1 삽입' })
  await expect(loading).toHaveCount(0)
  await expect(firstGif).toHaveAttribute('aria-busy', 'true')
  await expect(firstGif).toBeDisabled()
  releaseImage()
  await expect(firstGif).toBeEnabled()
  await expect(firstGif).toHaveAttribute('aria-busy', 'false')
  await expect(firstGif.getByRole('img')).toHaveCSS('opacity', '1')

  await dialog.getByRole('button', { name: '더 보기' }).click()
  await expect(loading.locator('[aria-hidden="true"]')).toHaveCount(3)
  await expect(firstGif).toBeEnabled()
  releaseNextPage()
  await expect(dialog.getByRole('button', { name: '로딩 고양이 2 삽입' })).toBeEnabled()
  await expect(loading).toHaveCount(0)
})

test('GIF 이미지 조회에 실패하면 로딩을 끝내고 해당 GIF 선택을 차단한다', async ({ page, api }) => {
  void api
  await page.route(gifApiPattern, (route) => route.fulfill({ json: {
    result: true,
    data: { data: [gifItem('broken-cat', '실패 고양이')], has_next: false },
  } }))
  await page.route(gifUrl, (route) => route.fulfill({ status: 404, body: '' }))

  await page.goto('/community/write')
  await page.getByRole('button', { name: 'GIF 선택', exact: true }).click()
  const gif = page.getByRole('button', { name: '실패 고양이 삽입' })
  await expect(gif.getByText('미리보기 없음')).toBeVisible()
  await expect(gif).toBeDisabled()
  await expect(gif).toHaveAttribute('aria-busy', 'false')
})
