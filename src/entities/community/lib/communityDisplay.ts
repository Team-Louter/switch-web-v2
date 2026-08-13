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
