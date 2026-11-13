import { apiClient } from '@/shared/api'

import type { LinkPreviewResponse } from '../model/linkPreview'

interface LinkPreviewRequest {
  url: string
  signal: AbortSignal
}

export async function getLinkPreview({ url, signal }: LinkPreviewRequest): Promise<LinkPreviewResponse> {
  // 메타데이터 조회는 Java API 대신 웹과 함께 배포되는 동일 출처 함수를 사용합니다.
  const response = await apiClient.get<LinkPreviewResponse>('/api/link-preview', {
    baseURL: window.location.origin,
    params: { url },
    signal,
    timeout: 10000,
  })
  return response.data
}
