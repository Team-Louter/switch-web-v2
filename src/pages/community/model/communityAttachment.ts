import { getCommunityFileKey, type PostFileResponse } from '@/entities/community'

export interface CommunityAttachmentFile {
  fileUrl: string
  fileName: string
  fileSize?: number
  fileType?: string
}

export type CommunityFileKind =
  | 'pdf' | 'document' | 'spreadsheet' | 'presentation'
  | 'archive' | 'code' | 'audio' | 'video' | 'file'

export function getCommunityFileKind(file: CommunityAttachmentFile): CommunityFileKind {
  const extension = file.fileName.split('.').at(-1)?.toLowerCase() ?? ''
  const mimeType = file.fileType?.toLowerCase() ?? ''
  if (extension === 'pdf' || mimeType.includes('pdf')) return 'pdf'
  if (/^(docx?|docm|odt|rtf|hwp|hwpx)$/.test(extension) || /word|opendocument.text/.test(mimeType)) return 'document'
  if (/^(xlsx?|xlsm|ods|csv)$/.test(extension) || /excel|spreadsheet|csv/.test(mimeType)) return 'spreadsheet'
  if (/^(pptx?|pptm|odp|key)$/.test(extension) || /powerpoint|presentation/.test(mimeType)) return 'presentation'
  if (/^(zip|rar|7z|tar|gz|tgz|bz2|xz|zst|iso)$/.test(extension) || /zip|compressed|archive|tar|gzip/.test(mimeType)) return 'archive'
  if (/^(js|mjs|ts|tsx|jsx|json|html|css|py|java|c|cpp|h|go|rs|swift|sh|sql|xml|yml|yaml)$/.test(extension)) return 'code'
  if (/^(mp3|wav|ogg|flac|m4a|aac)$/.test(extension) || mimeType.startsWith('audio/')) return 'audio'
  if (/^(mp4|mov|webm|avi|mkv)$/.test(extension) || mimeType.startsWith('video/')) return 'video'
  return 'file'
}

export function formatCommunityFileSize(bytes: number | undefined): string {
  if (bytes === undefined || !Number.isFinite(bytes) || bytes < 0) return '용량 정보 없음'
  if (bytes === 0) return '0 B'
  const unitIndex = Math.max(0, Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), 3))
  const size = bytes / 1024 ** unitIndex
  return `${Number(size.toFixed(unitIndex === 0 ? 0 : 2))} ${['B', 'KB', 'MB', 'GB'][unitIndex]}`
}

export function resolveCommunityAttachment(
  url: string,
  name: string,
  files: readonly PostFileResponse[],
): CommunityAttachmentFile {
  const fileKey = getCommunityFileKey(url)
  const matchingFile = (fileKey ? files.find((file) => getCommunityFileKey(file.fileUrl) === fileKey) : undefined) ??
    files.find((file) => file.fileName === url || file.fileName === name)
  if (matchingFile) return matchingFile

  let fallbackName = url.split(/[?#]/)[0].split('/').at(-1) || '첨부파일'
  try { fallbackName = decodeURIComponent(fallbackName) } catch { /* 원래 파일명을 유지한다. */ }
  return { fileUrl: url, fileName: name || fallbackName }
}
