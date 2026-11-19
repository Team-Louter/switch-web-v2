import { Buffer } from 'node:buffer'
import { lookup } from 'node:dns/promises'
import { request as httpRequest } from 'node:http'
import { request as httpsRequest } from 'node:https'
import { isIP } from 'node:net'
import { Parser } from 'htmlparser2'
import ipaddr from 'ipaddr.js'

import type { LinkPreviewResponse } from '../src/entities/community/model/linkPreview.ts'

const MAX_HTML_BYTES = 1024 * 1024
const MAX_REDIRECTS = 3

export function isPublicAddress(address: string): boolean {
  return ipaddr.isValid(address) && ipaddr.process(address).range() === 'unicast'
}

export function validatePreviewUrl(value: string): URL {
  if (value.length > 2048) throw new Error('URL이 너무 깁니다.')
  const url = new URL(value)
  const hostname = url.hostname.replace(/^\[|\]$/g, '').replace(/\.$/, '')
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || url.port
    || !hostname.includes('.') && !isIP(hostname)
    || /(?:^|\.)(?:localhost|local|internal|home\.arpa)$/.test(hostname)
    || isIP(hostname) && !isPublicAddress(hostname)) {
    throw new Error('공개 웹사이트 URL만 조회할 수 있습니다.')
  }
  url.hash = ''
  return url
}

async function resolvePublicAddress(url: URL) {
  const hostname = url.hostname.replace(/^\[|\]$/g, '')
  let timer: ReturnType<typeof setTimeout> | undefined
  try {
    const addresses = await Promise.race([
      lookup(hostname, { all: true }),
      new Promise<never>((_, reject) => {
        timer = setTimeout(() => reject(new Error('DNS 조회 시간 초과')), 2000)
      }),
    ])
    if (!addresses.length || addresses.some(({ address }) => !isPublicAddress(address))) {
      throw new Error('내부 네트워크 주소는 조회할 수 없습니다.')
    }
    return addresses.find(({ family }) => family === 4) ?? addresses[0]
  } finally {
    clearTimeout(timer)
  }
}

interface PageResponse {
  html?: string
  redirect?: string
}

async function readPage(url: URL, signal: AbortSignal): Promise<PageResponse> {
  const address = await resolvePublicAddress(url)
  signal.throwIfAborted()
  return new Promise((resolve, reject) => {
    const request = (url.protocol === 'https:' ? httpsRequest : httpRequest)(url, {
      signal,
      agent: false,
      headers: {
        'User-Agent': 'SwitchLinkPreview/1.0 (+https://switch.louter.site)',
        Accept: 'text/html,application/xhtml+xml',
        'Accept-Encoding': 'identity',
      },
      // 검사한 IP로 직접 연결해 DNS 재조회에 의한 내부망 접근을 차단합니다.
      lookup: (_hostname, options, callback) => {
        if (options.all) callback(null, [address])
        else callback(null, address.address, address.family)
      },
    }, (response) => {
      response.on('error', reject)
      const status = response.statusCode ?? 0
      if ([301, 302, 303, 307, 308].includes(status) && response.headers.location) {
        resolve({ redirect: response.headers.location })
        response.destroy()
        return
      }
      const contentType = response.headers['content-type'] ?? ''
      if (status < 200 || status >= 300
        || !/^(text\/html|application\/xhtml\+xml)(?:;|$)/i.test(contentType)
        || response.headers['content-encoding'] && response.headers['content-encoding'] !== 'identity'
        || Number(response.headers['content-length']) > MAX_HTML_BYTES) {
        reject(new Error('미리보기를 지원하지 않는 응답입니다.'))
        response.destroy()
        return
      }
      const chunks: Buffer[] = []
      let size = 0
      response.on('data', (chunk: Buffer) => {
        size += chunk.length
        if (size > MAX_HTML_BYTES) {
          reject(new Error('사이트 응답이 너무 큽니다.'))
          response.destroy()
          return
        }
        chunks.push(chunk)
      })
      response.on('end', () => {
        const charset = contentType.match(/charset\s*=\s*["']?([^\s;"']+)/i)?.[1] ?? 'utf-8'
        try {
          resolve({ html: new TextDecoder(charset).decode(Buffer.concat(chunks)) })
        } catch {
          reject(new Error('지원하지 않는 문자 인코딩입니다.'))
        }
      })
    })
    request.on('error', reject)
    request.end()
  })
}

export function parseLinkPreview(html: string, url: URL): LinkPreviewResponse {
  const meta = new Map<string, string>()
  let title = ''
  let inTitle = false
  let inHead = true
  const parser = new Parser({
    onopentag(name, attributes) {
      if (name === 'body') inHead = false
      if (!inHead) return
      if (name === 'title') inTitle = true
      if (name !== 'meta') return
      const key = (attributes.property ?? attributes.name ?? '').toLowerCase()
      const value = attributes.content?.trim()
      if (value && (!meta.has(key) || key === 'twitter:card')) meta.set(key, value)
    },
    ontext(text) {
      if (inHead && inTitle) title += text
    },
    onclosetag(name) {
      if (name === 'title') inTitle = false
      if (name === 'head') inHead = false
    },
  }, { decodeEntities: true })
  parser.end(html)

  const image = meta.get('og:image:secure_url') ?? meta.get('og:image')
    ?? meta.get('og:image:url') ?? meta.get('twitter:image') ?? meta.get('twitter:image:src')
  let imageUrl: string | null = null
  try {
    if (image) {
      const candidate = validatePreviewUrl(new URL(image, url).href)
      // 배포 CSP와 일치시키고 HTTPS 페이지의 혼합 콘텐츠 오류를 방지합니다.
      if (candidate.protocol === 'https:') imageUrl = candidate.href
    }
  } catch { /* 유효하지 않은 이미지만 제외하고 텍스트와 원본 링크는 유지합니다. */ }

  return {
    title: (meta.get('og:title') ?? meta.get('twitter:title') ?? (title.trim() || url.hostname)).slice(0, 300),
    description: (meta.get('og:description') ?? meta.get('twitter:description') ?? meta.get('description') ?? '').slice(0, 1000),
    siteName: (meta.get('og:site_name') ?? url.hostname).slice(0, 200),
    imageUrl,
    imageAlt: (meta.get('og:image:alt') ?? meta.get('twitter:image:alt') ?? '').slice(0, 300),
    layout: ['summary_large_image', 'photo'].includes(meta.get('twitter:card') ?? '') ? 'large' : 'thumbnail',
  }
}

export async function fetchLinkPreview(value: string): Promise<LinkPreviewResponse> {
  let url = validatePreviewUrl(value)
  const signal = AbortSignal.timeout(8000)
  for (let redirects = 0; redirects <= MAX_REDIRECTS; redirects += 1) {
    const page = await readPage(url, signal)
    if (!page.redirect) return parseLinkPreview(page.html ?? '', url)
    // 각 리다이렉트 목적지에도 URL·DNS·IP 검사를 다시 적용합니다.
    url = validatePreviewUrl(new URL(page.redirect, url).href)
  }
  throw new Error('리다이렉트가 너무 많습니다.')
}
