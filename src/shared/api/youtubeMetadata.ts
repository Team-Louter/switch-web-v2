interface YouTubeMetadataRequest {
  videoId: string
  signal: AbortSignal
}

interface YouTubeMetadataResponse {
  title: string
}

export async function getYouTubeTitle({ videoId, signal }: YouTubeMetadataRequest): Promise<string> {
  if (!/^[A-Za-z0-9_-]{11}$/.test(videoId)) throw new Error('유효하지 않은 영상 ID입니다.')

  const params = new URLSearchParams({
    url: `https://www.youtube.com/watch?v=${videoId}`,
    format: 'json',
  })
  // 인증 토큰을 자동으로 첨부하는 내부 API 클라이언트는 외부 공개 요청에 사용하지 않습니다.
  const response = await fetch(`https://www.youtube.com/oembed?${params}`, {
    credentials: 'omit',
    signal,
    referrerPolicy: 'no-referrer',
  })
  if (!response.ok) throw new Error('영상 정보를 불러오지 못했습니다.')

  const data: unknown = await response.json()
  if (typeof data !== 'object' || data === null || !('title' in data)
    || typeof data.title !== 'string' || !data.title.trim()) {
    throw new Error('영상 제목이 없습니다.')
  }
  const metadata: YouTubeMetadataResponse = { title: data.title.trim() }
  return metadata.title
}
