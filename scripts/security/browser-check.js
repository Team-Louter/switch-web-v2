// Playwright CLI run-code --filename 으로 실행한다. API 응답은 모두 합성 데이터다.
async (page) => {
  await page.unrouteAll()
  await page.context().unrouteAll()
  page.removeAllListeners('pageerror')
  const errors = []
  const unexpectedRequests = []
  const origin = 'http://127.0.0.1:4179'
  const emptyPage = { content: [], last: true, totalElements: 0, totalPages: 0, number: 0, size: 20 }
  page.on('pageerror', (error) => errors.push(error.message))
  await page.addInitScript(() => {
    // 서명되지 않은 테스트 전용 값이며 외부 서버로 전송하지 않는다.
    localStorage.setItem('accessToken', 'e30.eyJleHAiOjIwMDAwMDAwMDB9.fixture')
    window.__auditViolations = []
    document.addEventListener('securitypolicyviolation', (event) => {
      window.__auditViolations.push({ directive: event.effectiveDirective, blocked: event.blockedURI })
    })
  })
  await page.context().route('**/*', async (route) => {
    const url = new URL(route.request().url())
    if (url.origin === origin || url.origin === 'http://127.0.0.1:4180') return route.continue()
    let json
    const path = url.pathname
    if (url.origin === 'https://api.dev.louter.site') {
      if (path === '/me') {
        json = {
          userId: 42, userName: '보안 회귀 검증', userEmail: 'audit@example.test',
          role: 'LEADER', grade: 2, classRoom: 1, number: 1, majors: [],
          postCount: 0, commentCount: 0, likedPostCount: 0, profileImageUrl: '',
        }
      } else if (['/schedules', '/members', '/posts/hot'].includes(path)) json = []
      else if (path === '/shop/items') json = { items: [] }
      else if (path === '/profile/customize') {
        json = { equippedItems: {}, ownedItems: [], purchasableItems: [] }
      } else if (['/shop/points', '/me/points', '/me/hearts/received'].includes(path)) json = 100
      else if (path === '/in-app-notifications/unread-count') json = { unreadCount: 0 }
      else if (path === '/posts' || path.startsWith('/posts/category/') || path.startsWith('/me/posts')) json = emptyPage
      else if (path.startsWith('/typing/results/rankings/')) json = { topRankings: [], myRanking: null }
      else if (path === '/typing/results/previous') {
        json = { resultId: 7, accuracy: 98, elapsedTime: 60, averageSpeed: 120, problemType: 'DAILY', rank: 1, totalPracticeCount: 5 }
      } else if (path === '/typing/rounds/JAVASCRIPT') {
        json = {
          roundId: 8, userId: 42, resultId: 0, problemType: 'JAVASCRIPT',
          problems: [{ problemId: 1, problemType: 'JAVASCRIPT', content: 'const message = "hello";' }],
        }
      }
    }
    if (json !== undefined) {
      return route.fulfill({
        headers: { 'Access-Control-Allow-Origin': origin, 'Access-Control-Allow-Credentials': 'true' }, json,
      })
    }
    unexpectedRequests.push(`${url.origin}${url.pathname}`)
    return route.abort()
  })

  const pages = []
  for (const path of ['/home', '/calendar', '/community', '/community/write', '/typing', '/typing/code/javascript', '/store', '/my']) {
    const initialErrors = errors.length
    const response = await page.goto(`${origin}${path}`)
    if (!path.startsWith('/typing/code/')) await page.getByRole('complementary', { name: '주요 메뉴' }).waitFor()
    if (path === '/community/write') await page.getByRole('textbox', { name: '게시글 내용', exact: true }).waitFor()
    if (path === '/typing/code/javascript') await page.locator('.monaco-editor').first().waitFor()
    if (path === '/calendar') await page.locator('.fc-daygrid-day').first().waitFor()
    await page.waitForTimeout(400)
    const state = await page.evaluate(() => ({
      violations: window.__auditViolations, bodyLength: document.body.innerText.length,
    }))
    pages.push({ path, status: response.status(), ...state, errors: errors.slice(initialErrors) })
  }
  if (pages.some((result) => result.status !== 200 || result.violations.length || result.errors.length || result.bodyLength < 20) || unexpectedRequests.length) {
    throw new Error(JSON.stringify({ pages, unexpectedRequests }))
  }

  const protection = await page.evaluate(async () => {
    window.__auditViolations = []
    const inline = document.createElement('script')
    inline.textContent = 'window.__auditInlineExecuted = true'
    document.body.append(inline)
    const remote = document.createElement('script')
    remote.src = 'https://untrusted.invalid/script.js'
    document.body.append(remote)
    const button = document.createElement('button')
    button.setAttribute('onclick', 'window.__auditHandlerExecuted = true')
    document.body.append(button)
    button.click()
    await new Promise((resolve) => setTimeout(resolve, 100))
    return {
      inlineExecuted: !!window.__auditInlineExecuted,
      handlerExecuted: !!window.__auditHandlerExecuted,
      violations: window.__auditViolations,
    }
  })
  if (protection.inlineExecuted || protection.handlerExecuted
    || !protection.violations.some((entry) => entry.blocked === 'https://untrusted.invalid/script.js')
    || !protection.violations.some((entry) => entry.directive === 'script-src-attr')
    || !protection.violations.some((entry) => entry.blocked === 'inline' && entry.directive === 'script-src-elem')) {
    throw new Error(`CSP 차단 실패: ${JSON.stringify(protection)}`)
  }

  // CSP가 없는 별도 출처의 문서에서 앱을 iframe으로 삽입한다.
  const denied = page.waitForEvent('requestfailed', {
    predicate: (request) => request.url() === `${origin}/login`, timeout: 10000,
  })
  await page.goto('http://127.0.0.1:4180/frame-check')
  const failure = (await denied).failure()?.errorText
  if (!failure?.includes('ERR_BLOCKED_BY_RESPONSE')) throw new Error(`iframe 차단 실패: ${failure}`)
  return { pages, unexpectedRequests, protection, iframe: { blocked: true, failure } }
}
