import type { PostCategory, PostTag } from '../model/types'

interface PostCategoryOption {
  value: PostCategory
  label: string
}

interface PostTagOption {
  value: PostTag
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

export const POST_TAG_OPTIONS_BY_CATEGORY: Record<
  PostCategory,
  readonly PostTagOption[]
> = {
  NOTICE: [],
  FREE: [],
  ASSIGNMENT: [],
  INFORMATION: [
    { value: 'INFO_BACKEND', label: '백엔드' },
    { value: 'INFO_FRONTEND', label: '프론트엔드' },
    { value: 'INFO_DESIGN', label: '디자인' },
    { value: 'INFO_AI', label: 'AI' },
    { value: 'INFO_ETC', label: '기타' },
    { value: 'INFO_SCHOOL', label: '학교' },
  ],
  ROADMAP: [
    { value: 'ROADMAP_BACKEND', label: '백엔드' },
    { value: 'ROADMAP_FRONTEND', label: '프론트엔드' },
    { value: 'ROADMAP_ETC', label: '기타' },
  ],
  CONTEST: [
    { value: 'HACKATHON', label: '해커톤' },
    { value: 'IDEA_CONTEST', label: '아이디어 공모전' },
    { value: 'ALGORITHM', label: '알고리즘' },
    { value: 'AI_DATA', label: 'AI·데이터' },
    { value: 'YOUTH_CONTEST', label: '청소년 대회' },
    { value: 'CONTEST_ETC', label: '기타' },
    { value: 'RECRUITMENT', label: '모집' },
  ],
  QNA: [
    { value: 'Q_BACKEND', label: '백엔드' },
    { value: 'Q_FRONTEND', label: '프론트엔드' },
    { value: 'Q_DESIGN', label: '디자인' },
    { value: 'Q_PLANNING', label: '기획' },
    { value: 'Q_ETC', label: '기타' },
  ],
}

const POST_CATEGORY_LABELS: Record<PostCategory, string> = Object.fromEntries(
  POST_CATEGORY_OPTIONS.map(({ value, label }) => [value, label]),
) as Record<PostCategory, string>

export function getPostCategoryLabel(category: PostCategory): string {
  return POST_CATEGORY_LABELS[category]
}

function getElapsedSeconds(dateValue: string, now: number): number | null {
  const timestamp = new Date(dateValue).getTime()

  if (Number.isNaN(timestamp)) return null

  return Math.max(0, Math.floor((now - timestamp) / 1000))
}

export function formatCommunityRelativeDate(
  dateValue: string,
  now: number = Date.now(),
): string {
  const seconds = getElapsedSeconds(dateValue, now)

  if (seconds === null) return dateValue

  if (seconds < 60) return `${seconds}초 전`
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}분 전`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}시간 전`
  const days = Math.floor(hours / 24)
  if (days < 11) return `${days}일 전`
  if (days < 30) return `${Math.floor(days / 7)}주 전`
  if (days < 365) return `${Math.floor(days / 30)}개월 전`
  return `${Math.floor(days / 365)}년 전`
}

/** 목록에서는 최근 10일만 상대 시간으로 표시해 날짜 열의 밀도를 유지한다. */
export function formatCommunityListRecentDate(
  dateValue: string,
  now: number = Date.now(),
): string {
  const seconds = getElapsedSeconds(dateValue, now)

  if (seconds === null) return dateValue

  if (seconds < 60) return `${seconds}초 전`
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}분 전`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}시간 전`
  const days = Math.floor(hours / 24)

  return days < 11 ? `${days}일 전` : formatCommunityListDate(dateValue)
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
    return normalizedPathname.replace(/^\/+/, '') || undefined
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
