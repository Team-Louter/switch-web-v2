import type { LinkPreviewResponse } from '../model/linkPreview'

interface LinkPreviewRequest {
  url: string
  signal: AbortSignal
}

export async function getLinkPreview({ url, signal }: LinkPreviewRequest): Promise<LinkPreviewResponse> {
  const params = new URLSearchParams({ url })
  // 공개 미리보기의 CDN 캐시를 위해 인증 인터셉터와 쿠키를 사용하지 않습니다.
  const response = await fetch(`/api/link-preview?${params}`, {
    credentials: 'omit',
    headers: { Accept: 'application/json' },
    signal: AbortSignal.any([signal, AbortSignal.timeout(10000)]),
  })
  if (!response.ok) throw new Error('사이트 미리보기를 불러올 수 없습니다.')
  return response.json()
}
