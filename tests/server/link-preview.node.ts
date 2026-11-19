import assert from 'node:assert/strict'
import { Buffer } from 'node:buffer'
import dns from 'node:dns/promises'
import { EventEmitter } from 'node:events'
import { createServer, IncomingMessage, type RequestOptions } from 'node:http'
import https from 'node:https'
import { syncBuiltinESMExports } from 'node:module'
import { Socket } from 'node:net'
import { afterEach, mock, test } from 'node:test'

import handler from '../../api/link-preview.ts'
import { fetchLinkPreview, isPublicAddress, parseLinkPreview, validatePreviewUrl } from '../../server/linkPreview.ts'

afterEach(() => {
  mock.restoreAll()
  syncBuiltinESMExports()
})

test('내부·예약·우회 표기 IP 및 비 HTTP URL을 차단한다', () => {
  for (const url of [
    'http://127.0.0.1', 'http://2130706433', 'http://0x7f000001', 'http://127.1',
    'http://10.0.0.1', 'http://172.16.0.1', 'http://192.168.0.1', 'http://169.254.169.254',
    'http://100.64.0.1', 'http://0.0.0.0', 'http://224.0.0.1', 'http://192.0.2.1',
    'http://[::1]', 'http://[::ffff:127.0.0.1]', 'http://[fc00::1]', 'http://[fe80::1]',
    'http://[64:ff9b::7f00:1]', 'http://localhost.', 'http://test.local',
    'https://example.com:8443', 'https://user:pass@example.com', 'file:///etc/passwd',
    'data:text/html,test', 'javascript:alert(1)', 'https://example.com/' + 'a'.repeat(2048),
  ]) assert.throws(() => validatePreviewUrl(url), url)
  assert.equal(isPublicAddress('8.8.8.8'), true)
  assert.equal(isPublicAddress('2606:4700:4700::1111'), true)
  assert.equal(validatePreviewUrl('https://example.com/path#section').href, 'https://example.com/path')
})

test('OG 정보를 우선하고 엔티티·상대 이미지·큰 이미지 메타태그를 처리한다', () => {
  const preview = parseLinkPreview(`<head>
    <title>기본 제목</title><meta name="description" content="기본 설명">
    <meta property="og:title" content="문제 &amp; 풀이">
    <meta property="og:title" content="중복 제목">
    <meta property="og:description" content="SQL &lt;학습&gt;">
    <meta property="og:site_name" content="실기연구소">
    <meta property="og:image" content="/og-image.svg">
    <meta property="og:image:alt" content="문제은행 대표 이미지">
    <meta name="twitter:card" content="summary_large_image">
  </head><body><meta property="og:title" content="본문 태그"></body>`, new URL('https://example.com/path'))
  assert.deepEqual(preview, {
    title: '문제 & 풀이', description: 'SQL <학습>', siteName: '실기연구소',
    imageUrl: 'https://example.com/og-image.svg', imageAlt: '문제은행 대표 이미지', layout: 'large',
  })
})

test('Twitter·HTML·도메인 fallback과 기본 썸네일을 지원한다', () => {
  const url = new URL('https://example.com')
  assert.equal(parseLinkPreview('<meta name="twitter:title" content="트위터 제목">', url).title, '트위터 제목')
  const html = parseLinkPreview('<title>일반 제목</title><meta name="description" content="설명">', url)
  assert.equal(html.title, '일반 제목')
  assert.equal(html.description, '설명')
  assert.equal(html.layout, 'thumbnail')
  assert.equal(parseLinkPreview('', url).title, 'example.com')
})

test('위험한 이미지 주소를 제외하고 과도한 텍스트 길이를 제한한다', () => {
  for (const image of ['javascript:alert(1)', 'data:image/svg+xml,test', 'http://example.com/a.png', 'https://127.0.0.1/a.png']) {
    const preview = parseLinkPreview(`<meta property="og:image" content="${image}">`, new URL('https://example.com'))
    assert.equal(preview.imageUrl, null)
  }
  const preview = parseLinkPreview(`<meta property="og:title" content="${'a'.repeat(1000)}">`, new URL('https://example.com'))
  assert.equal(preview.title.length, 300)
})

function mockDns(address = '93.184.216.34') {
  const lookup = mock.method(dns, 'lookup', async () => [{ address, family: 4 }])
  syncBuiltinESMExports()
  return lookup
}

interface MockPage {
  status?: number
  location?: string
  contentType?: string
  body?: string
}

function mockPages(pages: MockPage[]) {
  const requests: { url: URL; options: RequestOptions }[] = []
  mock.method(https, 'request', (url: URL, options: RequestOptions, callback: (response: IncomingMessage) => void) => {
    requests.push({ url, options })
    const page = pages.shift() ?? {}
    const request = Object.assign(new EventEmitter(), {
      end() {
        const response = new IncomingMessage(new Socket())
        response.statusCode = page.status ?? 200
        response.headers = { 'content-type': page.contentType ?? 'text/html', location: page.location }
        callback(response)
        if (!response.destroyed) {
          response.push(Buffer.from(page.body ?? '<title>공개 사이트</title>'))
          response.push(null)
        }
      },
    })
    return request
  })
  syncBuiltinESMExports()
  return requests
}

test('DNS가 내부 IP를 반환하면 외부 요청을 보내지 않는다', async () => {
  mockDns('127.0.0.1')
  const requests = mockPages([])
  await assert.rejects(fetchLinkPreview('https://example.com'), /내부 네트워크/)
  assert.equal(requests.length, 0)
})

test('공개·내부 IP가 섞인 DNS 응답도 거부한다', async () => {
  mock.method(dns, 'lookup', async () => [{ address: '8.8.8.8', family: 4 }, { address: '10.0.0.1', family: 4 }])
  syncBuiltinESMExports()
  const requests = mockPages([])
  await assert.rejects(fetchLinkPreview('https://example.com'), /내부 네트워크/)
  assert.equal(requests.length, 0)
})

test('연결은 검사한 IP를 재사용하고 원래 호스트 및 인증정보 미전달을 유지한다', async () => {
  const dnsLookup = mockDns()
  const requests = mockPages([{}])
  assert.equal((await fetchLinkPreview('https://example.com')).title, '공개 사이트')
  assert.equal(dnsLookup.mock.callCount(), 1)
  assert.equal(requests[0].url.hostname, 'example.com')
  const options = requests[0].options
  assert.equal(options.agent, false)
  assert.equal(Object.keys(options.headers ?? {}).some((key) => /authorization|cookie/i.test(key)), false)
  await new Promise<void>((resolve) => {
    options.lookup!('example.com', { all: true }, (error, addresses) => {
      assert.equal(error, null)
      assert.deepEqual(addresses, [{ address: '93.184.216.34', family: 4 }])
      resolve()
    })
  })
})

test('리다이렉트마다 DNS를 검사하고 내부 목적지와 리다이렉트 루프를 차단한다', async () => {
  const dnsLookup = mockDns()
  const requests = mockPages([
    { status: 302, location: 'https://other.example/path' },
    { status: 302, location: 'http://127.0.0.1/private' },
  ])
  await assert.rejects(fetchLinkPreview('https://example.com'), /공개 웹사이트/)
  assert.equal(dnsLookup.mock.callCount(), 2)
  assert.equal(requests.length, 2)
  mockPages(Array.from({ length: 4 }, () => ({ status: 302, location: '/loop' })))
  await assert.rejects(fetchLinkPreview('https://example.com'), /리다이렉트가 너무/)
})

test('비 HTML·실패 응답과 1 MiB를 초과하는 본문을 거부한다', async () => {
  mockDns()
  mockPages([{ contentType: 'application/json' }, { status: 404 }, { body: 'x'.repeat(1024 * 1024 + 1) }])
  await assert.rejects(fetchLinkPreview('https://example.com'), /지원하지 않는 응답/)
  await assert.rejects(fetchLinkPreview('https://example.com'), /지원하지 않는 응답/)
  await assert.rejects(fetchLinkPreview('https://example.com'), /너무 큽니다/)
})

test('엔드포인트의 메서드·입력 검증과 성공 시에만 적용되는 CDN 캐시를 확인한다', async () => {
  mockDns()
  mockPages([{}])
  const server = createServer(handler)
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve))
  const address = server.address()
  assert.ok(address && typeof address !== 'string')
  const endpoint = `http://127.0.0.1:${address.port}/api/link-preview`
  try {
    const invalid = await fetch(endpoint)
    assert.equal(invalid.status, 400)
    assert.equal(invalid.headers.get('cache-control'), 'no-store')
    const post = await fetch(endpoint, { method: 'POST' })
    assert.equal(post.status, 405)
    assert.equal(post.headers.get('allow'), 'GET')
    const success = await fetch(`${endpoint}?url=https://example.com`)
    assert.equal(success.status, 200)
    assert.equal(success.headers.get('vercel-cdn-cache-control'), 'public, s-maxage=1800')
    assert.equal((await success.json()).title, '공개 사이트')
    mockDns('10.0.0.1')
    const failed = await fetch(`${endpoint}?url=https://example.com`)
    assert.equal(failed.status, 502)
    assert.equal(failed.headers.get('cache-control'), 'no-store')
  } finally {
    await new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve()))
  }
})
