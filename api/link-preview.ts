import type { IncomingMessage, ServerResponse } from 'node:http'

import { fetchLinkPreview, validatePreviewUrl } from '../server/linkPreview.ts'

export default async function handler(request: IncomingMessage, response: ServerResponse) {
  response.setHeader('Content-Type', 'application/json; charset=utf-8')
  response.setHeader('Cache-Control', 'no-store')
  if (request.method !== 'GET') {
    response.setHeader('Allow', 'GET')
    response.writeHead(405).end(JSON.stringify({ message: 'GET 요청만 지원합니다.' }))
    return
  }
  const value = new URL(request.url ?? '/', 'https://switch.louter.site').searchParams.get('url') ?? ''
  try {
    validatePreviewUrl(value)
  } catch {
    response.writeHead(400).end(JSON.stringify({ message: '유효한 공개 사이트 URL이 필요합니다.' }))
    return
  }
  try {
    const preview = await fetchLinkPreview(value)
    response.setHeader('Cache-Control', 'public, max-age=0, must-revalidate')
    response.setHeader('Vercel-CDN-Cache-Control', 'public, s-maxage=1800')
    response.writeHead(200).end(JSON.stringify(preview))
  } catch {
    response.writeHead(502).end(JSON.stringify({ message: '사이트 미리보기를 불러올 수 없습니다.' }))
  }
}
