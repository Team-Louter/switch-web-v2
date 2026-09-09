import type { PostCategory } from '../model/types'

interface PostCategoryOption {
  value: PostCategory
  label: string
}

export const POST_CATEGORY_OPTIONS: readonly PostCategoryOption[] = [
  { value: 'NOTICE', label: '공지사항' },
  { value: 'FREE', label: '자유게시판' },
  { value: 'INFORMATION', label: '정보 공유' },
  { value: 'ASSIGNMENT', label: '과제' },
  { value: 'ROADMAP', label: '로드맵' },
  { value: 'CONTEST', label: '대회' },
  { value: 'QNA', label: 'Q&A' },
]

const POST_CATEGORY_LABELS: Record<PostCategory, string> = Object.fromEntries(
  POST_CATEGORY_OPTIONS.map(({ value, label }) => [value, label]),
) as Record<PostCategory, string>

export function getPostCategoryLabel(category: PostCategory): string {
  return POST_CATEGORY_LABELS[category]
}

export function formatCommunityDate(dateValue: string): string {
  const date = new Date(dateValue)

  if (Number.isNaN(date.getTime())) {
    return dateValue
  }

  const pad = (value: number) => value.toString().padStart(2, '0')

  return `${date.getFullYear()}.${pad(date.getMonth() + 1)}.${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`
}

/** 목록에서는 연도를 생략해 행 밀도를 유지하되, 다른 연도는 구분한다. */
export function formatCommunityListDate(dateValue: string): string {
  const date = new Date(dateValue)

  if (Number.isNaN(date.getTime())) {
    return dateValue
  }

  const pad = (value: number) => value.toString().padStart(2, '0')
  const monthAndDay = `${pad(date.getMonth() + 1)}.${pad(date.getDate())}`

  if (date.getFullYear() === new Date().getFullYear()) {
    return monthAndDay
  }

  return `${date.getFullYear().toString().slice(-2)}.${monthAndDay}`
}

export function formatCommunityCount(value: number): string {
  const normalizedValue = Math.max(0, Math.trunc(value))

  if (normalizedValue < 1000) {
    return normalizedValue.toString()
  }

  const compactValue = (normalizedValue / 1000).toFixed(1)

  return `${compactValue.endsWith('.0') ? compactValue.slice(0, -2) : compactValue}K`
}

export function resolveCommunityAssetUrl(
  assetUrl: string | undefined,
): string | undefined {
  const trimmedAssetUrl = assetUrl?.trim()

  if (!trimmedAssetUrl) {
    return undefined
  }

  try {
    return new URL(trimmedAssetUrl, import.meta.env.VITE_API_BASE_URL).toString()
  } catch {
    return undefined
  }
}

function decodeFilePath(filePath: string): string {
  try {
    return decodeURIComponent(filePath)
  } catch {
    return filePath
  }
}

function getFileKeyFromDownloadPath(filePath: string): string | undefined {
  const normalizedFilePath = decodeFilePath(filePath)
  const downloadPathPrefix = '/files/download/'

  if (!normalizedFilePath.startsWith(downloadPathPrefix)) {
    return undefined
  }

  return normalizedFilePath.slice(downloadPathPrefix.length) || undefined
}

function getFileKeyFromPresignedUrl(fileUrl: URL): string | undefined {
  const isPresignedUrl = [
    'X-Amz-Algorithm',
    'X-Amz-Credential',
    'X-Amz-Signature',
  ].some((parameter) => fileUrl.searchParams.has(parameter))

  if (!isPresignedUrl) {
    return undefined
  }

  const normalizedPathname = decodeFilePath(fileUrl.pathname)
  const filesPathIndex = normalizedPathname.indexOf('/files/')
  const postsPathIndex = normalizedPathname.indexOf('/posts/')

  if (filesPathIndex >= 0) {
    return normalizedPathname.slice(filesPathIndex + 1) || undefined
  }

  if (postsPathIndex < 0) {
    return undefined
  }

  return normalizedPathname.slice(postsPathIndex + 1) || undefined
}

export function getCommunityFileKey(
  fileKeyOrUrl: string | undefined,
): string | undefined {
  const trimmedFileKeyOrUrl = fileKeyOrUrl?.trim()

  if (!trimmedFileKeyOrUrl) {
    return undefined
  }

  if (!/^https?:\/\//i.test(trimmedFileKeyOrUrl)) {
    return getFileKeyFromDownloadPath(trimmedFileKeyOrUrl) ?? trimmedFileKeyOrUrl
  }

  try {
    const fileUrl = new URL(trimmedFileKeyOrUrl)

    return (
      getFileKeyFromDownloadPath(fileUrl.pathname) ??
      getFileKeyFromPresignedUrl(fileUrl) ??
      trimmedFileKeyOrUrl
    )
  } catch {
    return trimmedFileKeyOrUrl
  }
}

export function getCommunityFileDownloadUrl(
  fileKeyOrUrl: string | undefined,
): string | undefined {
  const fileKey = getCommunityFileKey(fileKeyOrUrl)
  const baseUrl = import.meta.env.VITE_BASE_URL?.replace(/\/$/, '')

  if (!fileKey) {
    return undefined
  }

  if (/^https?:\/\//i.test(fileKey)) {
    return fileKey
  }

  if (!baseUrl) {
    return undefined
  }

  return `${baseUrl}/files/download/${fileKey}`
}
