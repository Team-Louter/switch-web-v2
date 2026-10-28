import type { Page } from '@playwright/test'

import { test, expect } from '../community/fixtures'

const monacoAsset = /(?:editor\.api-|monacoSetup-|(?:editor|ts)\.worker-|CodeTypingPage-|SentenceCodeEditor-)/

function recordRequests(page: Page) {
  const requests: string[] = []
  page.on('request', (request) => requests.push(request.url()))
  return requests
}

for (const width of [390, 900, 901, 1440]) {
  test(`로그인 ${width}px에서 필요한 hero만 다운로드한다`, async ({ page, api }) => {
    void api
    await page.addInitScript(() => localStorage.clear())
    await page.setViewportSize({ width, height: 900 })
    const requests = recordRequests(page)
    await page.goto('/login')
    await expect(page.getByRole('heading', { name: 'Louter (라우터)' })).toBeVisible()
    const hero = page.locator('picture img')
    await expect.poll(() => hero.evaluate((image: HTMLImageElement) => image.complete)).toBe(true)
    expect(requests.filter((url) => url.includes('/assets/auth-hero-'))).toHaveLength(width <= 900 ? 0 : 1)
    if (width <= 900) {
      await page.setViewportSize({ width: 1440, height: 900 })
      await expect.poll(() => hero.evaluate((image: HTMLImageElement) => image.naturalWidth)).toBe(1272)
    }
  })
}

for (const path of ['/typing', '/typing/daily']) {
  test(`${path}는 Monaco를 요청하지 않고 프로필을 한 번만 조회한다`, async ({ page, api }) => {
    const requests = recordRequests(page)
    await page.goto(path)
    await expect(path.endsWith('/daily')
      ? page.getByText('Hello world.', { exact: true })
      : page.getByRole('heading', { name: '타자 연습' })).toBeVisible()
    await expect.poll(() => api.profileRequests).toBe(1)
    expect(requests.filter((url) => monacoAsset.test(url))).toEqual([])
  })
}

test('설정 목록과 일상 문장 편집은 Monaco 없이 표시한다', async ({ page, api }) => {
  void api
  await page.route('**/api/admin/typing/problems', (route) => route.fulfill({ json: [
    { problemId: 1, problemType: 'DAILY', content: 'Daily text.' },
  ] }))
  const requests = recordRequests(page)
  await page.goto('/typing')
  await page.getByRole('button', { name: '문장 설정', exact: true }).click()
  await page.getByRole('button', { name: '일상 문장 수정' }).click()
  await expect(page.locator('#sentence-content')).toHaveValue('Daily text.')
  expect(requests.filter((url) => monacoAsset.test(url))).toEqual([])
})

for (const language of ['java', 'javascript']) {
  test(`${language} 연습은 로컬 Worker로 실행한다`, async ({ page, api }) => {
    void api
    const errors: string[] = []
    const workers: string[] = []
    page.on('pageerror', (error) => errors.push(error.message))
    page.on('worker', (worker) => workers.push(worker.url()))
    await page.route('**/api/typing/rounds/*', (route) => route.fulfill({ json: {
      roundId: 8, userId: 42, resultId: 0, problemType: language.toUpperCase(),
      problems: [{ problemId: 1, problemType: language.toUpperCase(), content: language === 'java' ? 'int value = 1;' : 'const value = 1;' }],
    } }))
    await page.goto(`/typing/code/${language}`)
    const input = page.getByRole('textbox', { name: '내가 쓴 코드 에디터' })
    await expect(input).toBeVisible({ timeout: 20_000 })
    await expect.poll(() => workers.some((url) => /editor\.worker-/.test(url))).toBe(true)
    if (language === 'javascript') {
      await expect.poll(() => workers.some((url) => /ts\.worker-/.test(url))).toBe(true)
    }
    await expect(page.getByRole('status', { name: /^[123]$/ })).toHaveCount(0, { timeout: 10_000 })
    await input.pressSequentially(language === 'java' ? 'int ' : 'const ')
    await expect(page.locator('.monaco-editor').last()).toContainText(language === 'java' ? 'int' : 'const')
    expect(errors).toEqual([])
  })
}

test('기본 서식과 목록은 에디터 없이 보존하고 위험한 링크를 제거한다', async ({ page, api }) => {
  const props = { textColor: 'default', backgroundColor: 'default', textAlignment: 'left' }
  const text = (value: string, styles: Record<string, boolean> = {}) => ({ type: 'text', text: value, styles })
  api.posts[0].postContent = 'SWITCH_BLOCKNOTE:' + JSON.stringify({ version: 1, blocks: [
    { id: 'p', type: 'paragraph', props, content: [text('굵게', { bold: true }), text('기울임', { italic: true }), text('밑줄', { underline: true }), text('취소', { strike: true }), text('코드', { code: true }), { type: 'link', href: 'https://example.com', content: [text('안전 링크')] }, { type: 'link', href: 'javascript:alert(1)', content: [text('위험 링크')] }], children: [] },
    { id: 'n1', type: 'numberedListItem', props: { ...props, start: 3 }, content: [text('세 번째')], children: [] },
    { id: 'n2', type: 'numberedListItem', props: { ...props, start: 5 }, content: [text('다섯 번째')], children: [] },
    { id: 'u', type: 'bulletListItem', props, content: [text('글머리')], children: [] },
    { id: 'q', type: 'quote', props, content: [text('인용')], children: [] },
  ] })
  const requests = recordRequests(page)
  await page.goto('/community/101')
  const body = page.getByRole('region', { name: '게시글 본문' })
  await expect(body.locator('strong')).toHaveText('굵게')
  await expect(body.locator('em')).toHaveText('기울임')
  await expect(body.locator('u')).toHaveText('밑줄')
  await expect(body.locator('s')).toHaveText('취소')
  await expect(body.locator('code')).toHaveText('코드')
  await expect(body.locator('ol')).toHaveAttribute('start', '3')
  await expect(body.locator('ol li').nth(1)).toHaveAttribute('value', '5')
  await expect(body.locator('ul li')).toHaveText('글머리')
  await expect(body.locator('blockquote')).toHaveText('인용')
  await expect(body.getByRole('link', { name: '안전 링크' })).toHaveAttribute('href', 'https://example.com/')
  await expect(body.getByRole('link', { name: '위험 링크' })).toHaveCount(0)
  await expect(body).toContainText('위험 링크')
  expect(requests.filter((url) => /CommunityPostBlockFallback-|communityBlockNoteSchema-/.test(url))).toEqual([])
})

test('미지원 서식은 기존 fallback으로 표시한다', async ({ page, api }) => {
  api.posts[0].postContent = 'SWITCH_BLOCKNOTE:' + JSON.stringify({ version: 1, blocks: [{
    id: 'colored', type: 'paragraph', props: { textColor: 'red', backgroundColor: 'default', textAlignment: 'left' },
    content: [{ type: 'text', text: '빨간 본문', styles: {} }], children: [],
  }] })
  const requests = recordRequests(page)
  await page.goto('/community/101')
  await expect(page.getByRole('region', { name: '게시글 본문' })).toContainText('빨간 본문')
  expect(requests.some((url) => /CommunityPostBlockFallback-/.test(url))).toBe(true)
})

test('기본 아바타는 API 주소를 거치지 않는다', async ({ page, api }) => {
  void api
  const requests = recordRequests(page)
  await page.goto('/community')
  await expect(page.getByText('게시글 1', { exact: true })).toBeVisible()
  const image = page.getByRole('img', { name: '테스트 작성자 프로필' }).first()
  await expect.poll(() => image.evaluate((img: HTMLImageElement) => img.naturalWidth)).toBe(123)
  expect(requests.filter((url) => /\/api\/assets\//.test(url))).toEqual([])
})

test('프로필 응답 전에 로그아웃해도 이전 사용자를 복구하지 않는다', async ({ page, api }) => {
  void api
  let release = () => {}
  const gate = new Promise<void>((resolve) => { release = resolve })
  let started = false
  await page.route('**/api/me', async (route) => {
    started = true
    await gate
    await route.fulfill({ json: { userId: 42, userName: '이전 사용자', role: 'LEADER', grade: 2, classRoom: 1, number: 1 } })
  })
  await page.goto('/community')
  await expect.poll(() => started).toBe(true)
  await page.evaluate(() => {
    localStorage.removeItem('accessToken')
    window.dispatchEvent(new Event('auth:state-changed'))
  })
  release()
  await expect(page).toHaveURL(/\/login$/)
  await expect(page.getByText('이전 사용자', { exact: true })).toHaveCount(0)
})

test('프로필 401 재시도 중 토큰이 갱신되어도 정상 사용자 정보를 표시한다', async ({ page, api }) => {
  void api
  let requests = 0
  await page.route('**/api/me', async (route) => {
    requests += 1
    await route.fulfill(requests === 1 ? { status: 401, json: {} } : { json: {
      userId: 42, userName: '갱신된 사용자', role: 'LEADER', grade: 2, classRoom: 1, number: 1,
    } })
  })
  await page.route('**/api/auth/refresh', (route) => route.fulfill({ json: {
    access_token: 'e30.eyJleHAiOjIwMDAwMDAwMDB9.refreshed',
  } }))
  await page.goto('/community')
  await expect(page.getByRole('button', { name: '갱신된 사용자 2학년 1반 1번' })).toBeVisible()
  expect(requests).toBe(2)
})

test('다른 탭의 계정 변경 후 이전 프로필 응답이 새 계정을 덮지 않는다', async ({ page, api }) => {
  void api
  let release = () => {}
  const gate = new Promise<void>((resolve) => { release = resolve })
  let requests = 0
  await page.route('**/api/me', async (route) => {
    requests += 1
    const first = requests === 1
    if (first) await gate
    await route.fulfill({ json: {
      userId: first ? 42 : 84, userName: first ? '이전 계정' : '다음 계정', role: 'LEADER', grade: 2, classRoom: 1, number: 1,
    } })
  })
  await page.goto('/community')
  await expect.poll(() => requests).toBe(1)
  await page.evaluate(() => {
    localStorage.setItem('accessToken', 'e30.eyJleHAiOjIwMDAwMDAwMDB9.next')
    window.dispatchEvent(new StorageEvent('storage', { key: 'accessToken' }))
  })
  await expect(page.getByRole('button', { name: '다음 계정 2학년 1반 1번' })).toBeVisible()
  release()
  await expect(page.getByRole('button', { name: '다음 계정 2학년 1반 1번' })).toBeVisible()
  await expect(page.getByText('이전 계정', { exact: true })).toHaveCount(0)
})

test('멤버 이미지가 지연·실패해도 홈 목록과 다음 배치가 표시된다', async ({ page, api }) => {
  void api
  let release = () => {}
  const gate = new Promise<void>((resolve) => { release = resolve })
  await page.route('**/api/members', (route) => route.fulfill({ json: Array.from({ length: 6 }, (_, index) => ({
    userId: index + 1, userName: `멤버 ${index + 1}`, role: 'MENTEE', grade: 2, classRoom: 1, number: index + 1,
    profileImageUrl: 'http://127.0.0.1:4173/slow-avatar.svg', majors: [], generation: 3, githubUrl: '', linkedinUrl: '',
  })) }))
  await page.route('**/slow-avatar.svg', async (route) => { await gate; await route.fulfill({ status: 503, body: '' }) })
  await page.route('**/api/schedules', (route) => route.fulfill({ json: [] }))
  await page.route('**/api/posts/hot', (route) => route.fulfill({ json: [] }))
  await page.route('**/api/me/posts?*', (route) => route.fulfill({ json: { content: [] } }))
  await page.goto('/home')
  const section = page.getByRole('region', { name: 'Louter Member' })
  await section.scrollIntoViewIfNeeded()
  await expect(section.getByText('멤버 1', { exact: false })).toBeVisible()
  await expect(section.locator('[aria-busy="true"]').first()).toBeVisible()
  await section.locator('article').last().scrollIntoViewIfNeeded()
  await expect(section.getByText('멤버 6', { exact: false })).toBeVisible()
  release()
  await expect(section.locator('[aria-busy="true"]')).toHaveCount(0)
  await expect(section.getByLabel('멤버 1 프로필')).toBeVisible()
})


test('문장 코드 편집기도 로컬 Worker를 사용한다', async ({ page, api }) => {
  void api
  await page.route('**/api/admin/typing/problems', (route) => route.fulfill({ json: [] }))
  const errors: string[] = []
  const workers: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  page.on('worker', (worker) => workers.push(worker.url()))
  await page.goto('/typing')
  await page.getByRole('button', { name: '문장 설정', exact: true }).click()
  await page.getByRole('button', { name: '문장 추가', exact: true }).click()
  const input = page.getByRole('textbox', { name: '개발 언어 문장 에디터' })
  await expect(input).toBeVisible()
  await input.pressSequentially('const value = 1;')
  await expect.poll(() => workers.some((url) => /ts\.worker-/.test(url))).toBe(true)
  await page.locator('#sentence-language').selectOption('java')
  await expect(input).toBeVisible()
  await input.pressSequentially('int value = 1;')
  expect(errors).toEqual([])
})

test('혼합 서식과 중첩 번호 목록은 한 fallback에서 순서를 보존한다', async ({ page, api }) => {
  const props = { textColor: 'default', backgroundColor: 'default', textAlignment: 'left' }
  const paragraph = (id: string, text: string) => ({ id, type: 'paragraph', props, content: [{ type: 'text', text, styles: {} }], children: [] })
  api.posts[0].postContent = 'SWITCH_BLOCKNOTE:' + JSON.stringify({ version: 1, blocks: [
    { ...paragraph('colored', '색상 문단'), props: { ...props, textColor: 'red' } },
    { ...paragraph('nested', '중첩 번호'), type: 'numberedListItem', children: [paragraph('child', '하위 문단')] },
    { ...paragraph('next', '다음 번호'), type: 'numberedListItem' },
  ] })
  await page.goto('/community/101')
  const body = page.getByRole('region', { name: '게시글 본문' })
  await expect(body).toContainText('하위 문단')
  await expect(body).toContainText('다음 번호')
  await expect(body.locator('[data-content-type="numberedListItem"]')).toHaveCount(2)
  await expect(body.locator(':scope > ol')).toHaveCount(0)
})

test('코드 화면 청크 로드 실패 시 다시 시도할 안내를 표시한다', async ({ page, api }) => {
  void api
  const chunk = /\/assets\/CodeTypingPage-[^/]+\.js$/
  await page.route(chunk, (route) => route.abort('failed'))
  await page.goto('/typing/code/javascript')
  await expect(page.getByRole('alert')).toContainText('화면을 불러오지 못했습니다')
  const retry = page.getByRole('button', { name: '새로고침', exact: true })
  await expect(retry).toBeVisible()
  await page.unroute(chunk)
  await page.route('**/api/typing/rounds/JAVASCRIPT', (route) => route.fulfill({ json: {
    roundId: 8, userId: 42, resultId: 0, problemType: 'JAVASCRIPT',
    problems: [{ problemId: 1, problemType: 'JAVASCRIPT', content: 'const value = 1;' }],
  } }))
  await retry.click()
  await expect(page.getByRole('textbox', { name: '내가 쓴 코드 에디터' })).toBeVisible()
})

for (const width of [390, 901]) {
  test(`추가 회원가입 ${width}px에서도 화면 크기에 맞는 hero를 요청한다`, async ({ page, api }) => {
    void api
    await page.addInitScript(() => {
      localStorage.removeItem('accessToken')
      localStorage.setItem('pendingAccessToken', 'e30.eyJleHAiOjIwMDAwMDAwMDB9.fixture')
      localStorage.setItem('pendingAccessTokenFlow', 'google-extra-signup')
    })
    await page.setViewportSize({ width, height: 900 })
    const requests = recordRequests(page)
    await page.goto('/extra-signup')
    const hero = page.locator('picture img')
    await expect(hero).toHaveCount(1)
    await expect.poll(() => hero.evaluate((image: HTMLImageElement) => image.complete)).toBe(true)
    expect(requests.filter((url) => url.includes('/assets/auth-hero-'))).toHaveLength(width <= 900 ? 0 : 1)
  })
}

test('멘토링 아바타가 지연되어도 방 이름과 멤버를 먼저 표시한다', async ({ page, api }) => {
  void api
  let release = () => {}
  const gate = new Promise<void>((resolve) => { release = resolve })
  await page.route('**/api/members', (route) => route.fulfill({ json: [{
    userId: 42, userName: '느린 멤버', role: 'LEADER', grade: 2, classRoom: 1, number: 1,
    profileImageUrl: 'http://127.0.0.1:4173/slow-mentor.svg', majors: [], generation: 3, githubUrl: '', linkedinUrl: '',
  }] }))
  await page.route('**/api/mentoring', (route) => route.fulfill({ json: [{ mentoringId: 1, mentoringName: '느린 이미지 방', createdAt: '2026-10-28T00:00:00Z' }] }))
  await page.route('**/api/mentoring/questions', (route) => route.fulfill({ json: [] }))
  await page.route('**/api/mentoring/messages', (route) => route.fulfill({ json: [] }))
  await page.route('**/api/mentoring/1/members?*', (route) => route.fulfill({ json:
    new URL(route.request().url()).searchParams.get('role') === 'LEADER'
      ? [{ memberId: 1, mentoringId: 1, userId: 42, role: 'LEADER' }]
      : [],
  }))
  await page.route('**/slow-mentor.svg', async (route) => { await gate; await route.fulfill({ status: 503, body: '' }) })
  try {
    await page.goto('/mentoring')
    await expect(page.getByText('느린 이미지 방', { exact: true }).first()).toBeVisible()
    await expect(page.locator('[aria-busy="true"] img[alt="느린 멤버"]').first()).toBeAttached()
  } finally {
    release()
  }
  await expect(page.locator('[aria-busy="true"] img[alt="느린 멤버"]')).toHaveCount(0)
})

test('토큰 재발급 중 화면을 이동해도 진행 중인 프로필 조회를 공유한다', async ({ page, api }) => {
  void api
  let release = () => {}
  const gate = new Promise<void>((resolve) => { release = resolve })
  let requests = 0
  await page.route('**/api/me', async (route) => {
    requests += 1
    if (requests === 1) {
      await route.fulfill({ status: 401, json: {} })
      return
    }
    await gate
    await route.fulfill({ json: { userId: 42, userName: '재발급 사용자', role: 'LEADER', grade: 2, classRoom: 1, number: 1 } })
  })
  await page.route('**/api/auth/refresh', (route) => route.fulfill({ json: {
    access_token: 'e30.eyJleHAiOjIwMDAwMDAwMDB9.refreshed',
  } }))
  try {
    await page.goto('/community')
    await expect.poll(() => requests).toBe(2)
    await page.getByRole('button', { name: '타자연습', exact: true }).click()
    await expect(page.getByRole('heading', { name: '타자 연습' })).toBeVisible()
    // 추가 요청이 없는지 확인하는 관측 구간이다. 진행 중 응답은 계속 보류한다.
    await page.waitForTimeout(200)
    expect(requests).toBe(2)
  } finally {
    release()
  }
  await expect(page.getByRole('button', { name: '재발급 사용자 2학년 1반 1번' })).toBeVisible()
})
