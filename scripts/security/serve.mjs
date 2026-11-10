// 진단 전용: dist와 Vercel의 전역 응답 헤더를 로컬에서 재현한다.
// 실제 CDN의 TLS, 캐시, 리다이렉트 동작을 검증하는 서버는 아니다.
import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { extname, resolve, sep } from 'node:path'
import process from 'node:process'

const root = resolve(process.cwd(), 'dist')
const config = JSON.parse(await readFile('vercel.json', 'utf8'))
const headers = (config.headers ?? []).flatMap((rule) => {
  if (rule.source !== '/(.*)') {
    throw new Error('진단 서버는 전역 헤더 규칙만 지원합니다.')
  }
  return rule.headers
})
const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.json': 'application/json',
}

// 잘못된 작업 디렉터리나 미빌드 상태를 성공한 진단으로 기록하지 않는다.
await stat(resolve(root, 'index.html'))

createServer(async (request, response) => {
  try {
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      response.writeHead(405)
      response.end()
      return
    }
    const pathname = new URL(request.url, 'http://127.0.0.1').pathname
    let file = resolve(root, `.${decodeURIComponent(pathname)}`)
    if (file !== root && !file.startsWith(`${root}${sep}`)) {
      response.writeHead(403)
      response.end()
      return
    }
    try {
      if (!(await stat(file)).isFile()) file = resolve(root, 'index.html')
    } catch {
      file = resolve(root, 'index.html')
    }
    const content = await readFile(file)
    for (const { key, value } of headers) response.setHeader(key, value)
    response.setHeader('Content-Type', mimeTypes[extname(file)] ?? 'application/octet-stream')
    response.end(request.method === 'HEAD' ? undefined : content)
  } catch {
    response.writeHead(500)
    response.end('Audit server error')
  }
}).listen(4179, '127.0.0.1', () => {
  process.stdout.write('진단용 production 모사 서버: http://127.0.0.1:4179\n')
})

// CSP가 없는 별도 로컬 출처에서 iframe 삽입을 시도해 클릭재킹 방어를 확인한다.
createServer((_request, response) => {
  response.setHeader('Content-Type', 'text/html; charset=utf-8')
  response.end('<!doctype html><title>Frame probe</title><iframe src="http://127.0.0.1:4179/login"></iframe>')
}).listen(4180, '127.0.0.1')
