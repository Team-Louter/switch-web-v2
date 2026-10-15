import { Buffer } from 'node:buffer'

import { expect, test } from './fixtures'

for (const edge of ['top', 'bottom'] as const) {
  test(`본문 ${edge} 영역에 놓은 파일은 업로드 후 파일 주소를 가진 카드가 된다`, async ({ page, api }) => {
    void api
    let uploads = 0
    await page.route('**/api/files/upload?prefix=posts', async (route) => {
      uploads += 1
      await route.fulfill({ json: {
        key: 'posts/drop-test.txt',
        fileName: 'drop-test.txt',
        fileType: 'text/plain',
        fileSize: 12,
      } })
    })
    await page.goto('/community/write')
    const body = page.getByRole('textbox', { name: '게시글 내용', exact: true })
    await expect(body).toBeVisible()

    const targetIsEditor = await page.evaluate((position) => {
      const area = document.querySelector('.community-block-editor')!
      const bounds = area.getBoundingClientRect()
      const x = bounds.left + bounds.width / 2
      const y = position === 'top' ? bounds.top + 30 : bounds.bottom - 50
      const target = document.elementFromPoint(x, y)!
      const isEditor = Boolean(target.closest('.bn-editor'))
      const transfer = new DataTransfer()
      transfer.items.add(new File(['drop fixture'], 'drop-test.txt', { type: 'text/plain' }))
      for (const type of ['dragover', 'drop']) {
        target.dispatchEvent(new DragEvent(type, {
          bubbles: true, cancelable: true, clientX: x, clientY: y, dataTransfer: transfer,
        }))
      }
      return isEditor
    }, edge)

    expect(targetIsEditor).toBe(true)
    const file = body.locator('[data-content-type="file"]')
    await expect(file).toHaveCount(1)
    await expect(file).toHaveAttribute('data-url', /\/files\/download\/posts\/drop-test\.txt$/)
    await expect(file).toContainText('drop-test.txt')
    await expect(file).toContainText('12 B')
    expect(uploads).toBe(1)
    await expect(page.getByRole('alert')).toHaveCount(0)
  })
}

for (const text of ['', '기존 본문은 유지합니다']) {
  test(`파일 첨부 시 ${text ? '기존 문단 아래에 추가' : '현재 빈 문단을 교체'}하고 여러 파일의 순서를 유지한다`, async ({ page, api }) => {
    void api
    const fileNames = ['첫 파일.pdf', '둘째 파일.zip']
    let uploads = 0
    await page.route('**/api/files/upload?prefix=posts', async (route) => {
      const index = uploads++
      await route.fulfill({ json: {
        key: `posts/selected-${index}`,
        fileName: fileNames[index],
        fileType: index === 0 ? 'application/pdf' : 'application/zip',
        fileSize: 24,
      } })
    })
    await page.goto('/community/write')
    const body = page.getByRole('textbox', { name: '게시글 내용', exact: true })
    await expect(body).toBeVisible()
    await body.click()
    if (text) await body.fill(text)

    const fileChooser = page.waitForEvent('filechooser')
    await page.getByRole('button', { name: '파일 첨부', exact: true }).click()
    await (await fileChooser).setFiles(fileNames.map((name, index) => ({
      name, mimeType: index === 0 ? 'application/pdf' : 'application/zip', buffer: Buffer.from('file fixture'),
    })))

    const files = body.locator('[data-content-type="file"]')
    await expect(files).toHaveCount(2)
    await expect(files.nth(0)).toHaveAttribute('data-name', fileNames[0])
    await expect(files.nth(1)).toHaveAttribute('data-name', fileNames[1])
    const blocks = body.locator('.bn-block-outer')
    await expect(blocks.first().locator('[data-content-type]').first()).toHaveAttribute(
      'data-content-type', text ? 'paragraph' : 'file',
    )
    if (text) await expect(blocks.first()).toHaveText(text)
    expect(uploads).toBe(2)
  })
}
