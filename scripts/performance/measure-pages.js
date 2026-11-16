// Playwright CLI의 run-code --filename으로 실행하는 측정 전용 함수입니다.
// SCENARIO를 list, home, input, write, nav-detail, nav-write 중 하나로 바꿔 사용합니다.
// 외부 HTTPS 요청은 실험에서만 차단하며 제품의 분석 코드에는 영향을 주지 않습니다.
async (page) => {
    const scenario = 'SCENARIO';
    const results = [];
    for (let sample = 0; sample < 5; sample++) {
        const context = await page.context().browser().newContext({ viewport: { width: 1440, height: 900 }, serviceWorkers: 'block' });
        const p = await context.newPage();
        const errors = [];
        p.on('pageerror', e => errors.push(e.message));
        await p.addInitScript((scenario) => {
            localStorage.setItem('accessToken', 'e30.eyJleHAiOjIwMDAwMDAwMDB9.fixture');
            window.__perf = { lcp: 0, cls: 0, longTasks: [], events: [], commits: 0, renders: {}, marks: {}, readyAt: null };
            let readyScheduled = false;
            const isReady = () => {
                if (scenario === 'list')
                    return document.querySelector('[aria-label="게시글 목록"] [role="link"]');
                if (scenario === 'home')
                    return ['/api/schedules', '/api/members'].every(path => performance.getEntriesByType('resource').some(r => new URL(r.name).pathname === path)) && !document.querySelector('[aria-label="일정 불러오는 중"]');
                if (scenario.includes('write'))
                    return document.querySelector('.tiptap[contenteditable="true"]');
                return document.querySelector('#comment-50');
            };
            const checkReady = () => {
                if (window.__perf.readyAt !== null || readyScheduled || !isReady())
                    return;
                readyScheduled = true;
                requestAnimationFrame(() => requestAnimationFrame(() => {
                    if (isReady())
                        window.__perf.readyAt = performance.now();
                    readyScheduled = false;
                }));
            };
            new MutationObserver(checkReady).observe(document, { childList: true, subtree: true, attributes: true });
            new PerformanceObserver(checkReady).observe({ type: 'resource', buffered: true });
            window.__REACT_DEVTOOLS_GLOBAL_HOOK__ = { supportsFiber: true, inject: () => 1, onCommitFiberRoot: (id, root) => {
                    window.__perf.commits++;
                    function walk(f) { if (!f)
                        return; if (f.flags & 1 && typeof f.type === 'function') {
                        const n = f.type.name;
                        window.__perf.renders[n] = (window.__perf.renders[n] || 0) + 1;
                    } walk(f.child); walk(f.sibling); }
                    walk(root.current);
                }, onCommitFiberUnmount: () => { } };
            new PerformanceObserver(l => l.getEntries().forEach(e => window.__perf.lcp = e.startTime)).observe({ type: 'largest-contentful-paint', buffered: true });
            new PerformanceObserver(l => l.getEntries().forEach(e => { if (!e.hadRecentInput)
                window.__perf.cls += e.value; })).observe({ type: 'layout-shift', buffered: true });
            new PerformanceObserver(l => l.getEntries().forEach(e => window.__perf.longTasks.push({ start: e.startTime, duration: e.duration }))).observe({ type: 'longtask', buffered: true });
            new PerformanceObserver(l => l.getEntries().forEach(e => { if (e.interactionId)
                window.__perf.events.push({ name: e.name, start: e.startTime, duration: e.duration, id: e.interactionId }); })).observe({ type: 'event', buffered: true, durationThreshold: 16 });
        }, scenario);
        const cdp = await context.newCDPSession(p);
        await cdp.send('Network.enable');
        await cdp.send('Network.setBlockedURLs', { urls: ['https://*'] });
        await cdp.send('Network.clearBrowserCache');
        await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: 200000, uploadThroughput: 93750 });
        await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
        await cdp.send('Performance.enable');
        let start = 0;
        const route = scenario.startsWith('nav') ? '/community' : scenario === 'home' ? '/home' : scenario === 'list' ? '/community' : scenario === 'write' ? '/community/write' : '/community/101';
        await p.goto('http://127.0.0.1:4173' + route, { waitUntil: 'domcontentloaded' });
        if (scenario.startsWith('nav')) {
            await p.getByText('게시글 1', { exact: true }).waitFor();
            const link = scenario === 'nav-write' ? p.getByRole('button', { name: '글쓰기', exact: true }) : p.getByRole('link').filter({ hasText: '고정글 101' });
            await link.hover();
            await p.waitForTimeout(500);
            await p.evaluate(() => { window.__perf.marks.click = performance.now(); document.addEventListener('click', () => { window.__perf.marks.click = performance.now(); }, { once: true, capture: true }); });
            await link.click();
            start = await p.evaluate(() => window.__perf.marks.click);
        }
        if (scenario === 'list')
            await p.getByText('게시글 1', { exact: true }).waitFor();
        else if (scenario === 'home')
            await p.waitForFunction(() => ['/api/schedules', '/api/members'].every(path => performance.getEntriesByType('resource').some(r => new URL(r.name).pathname === path)));
        else if (scenario.includes('write'))
            await p.locator('.tiptap[contenteditable=true]').waitFor({ timeout: 30000 });
        else
            await p.getByText('측정 댓글 50', { exact: true }).waitFor({ timeout: 30000 });
        await p.waitForFunction(() => window.__perf.readyAt !== null);
        const ready = await p.evaluate(() => window.__perf.readyAt);
        await p.waitForTimeout(300);
        let input = null;
        if (scenario === 'input') {
            const textbox = p.getByRole('textbox', { name: '댓글 내용', exact: true });
            await textbox.scrollIntoViewIfNeeded();
            await textbox.click();
            await p.waitForTimeout(200);
            const before = await p.evaluate(() => ({ now: performance.now(), commits: window.__perf.commits, renders: { ...window.__perf.renders } }));
            const beforeMetrics = await cdp.send('Performance.getMetrics');
            await textbox.pressSequentially('abcdefghijklmnopqrst', { delay: 80 });
            await p.waitForTimeout(100);
            const after = await p.evaluate(() => ({ now: performance.now(), commits: window.__perf.commits, renders: { ...window.__perf.renders } }));
            const afterMetrics = await cdp.send('Performance.getMetrics');
            input = { start: before.now, end: after.now, commits: after.commits - before.commits, renders: Object.fromEntries(Object.entries(after.renders).map(([k, v]) => [k, v - (before.renders[k] || 0)]).filter(([, v]) => v)), metrics: Object.fromEntries(afterMetrics.metrics.map(m => [m.name, m.value - (beforeMetrics.metrics.find(b => b.name === m.name)?.value || 0)])) };
        }
        const data = await p.evaluate(() => ({ ...window.__perf, resources: performance.getEntriesByType('resource').map(r => ({ name: r.name, start: r.startTime, duration: r.duration, ttfb: r.responseStart - r.requestStart, transfer: r.transferSize, encoded: r.encodedBodySize })), navigation: performance.getEntriesByType('navigation').map(n => ({ ttfb: n.responseStart, dom: n.domContentLoadedEventEnd })) }));
        results.push({ sample, scenario, ready: ready - start, start, input, errors, ...data });
        await context.close();
    }
    return results;
}
