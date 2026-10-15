import { getCommunityFileKey } from '@/entities/community'
import { apiClient } from '@/shared/api'

export async function downloadCommunityFile(fileKeyOrUrl: string, fileName: string): Promise<void> {
  const fileKey = getCommunityFileKey(fileKeyOrUrl)
  const baseUrl = import.meta.env.VITE_BASE_URL || apiClient.defaults.baseURL
  if (!fileKey || !baseUrl || /^https?:\/\//i.test(fileKey)) {
    throw new Error('다운로드할 첨부파일 주소를 확인할 수 없습니다.')
  }

  const downloadBase = new URL(`${baseUrl.replace(/\/$/, '')}/files/download/`, window.location.origin)
  const encodedKey = fileKey.replace(/^\/+/, '').split('/').map(encodeURIComponent).join('/')
  const downloadUrl = new URL(encodedKey, downloadBase)
  // 서버가 관리하는 파일 경로만 사용해 외부 주소로 인증 정보가 전송되지 않게 한다.
  if (!['http:', 'https:'].includes(downloadUrl.protocol) ||
      !downloadUrl.pathname.startsWith(downloadBase.pathname)) {
    throw new Error('지원하지 않는 첨부파일 주소입니다.')
  }

  const response = await apiClient.get<Blob>(downloadUrl.href, {
    responseType: 'blob',
    timeout: 60_000,
  })
  const objectUrl = URL.createObjectURL(response.data)
  const link = document.createElement('a')
  link.href = objectUrl
  link.download = fileName
  document.body.append(link)
  link.click()
  link.remove()
  window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000)
}
