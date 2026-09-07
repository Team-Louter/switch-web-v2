import type {
  ProfileAvatarDecorationItem,
  ProfileAvatarEquippedItems,
} from '../types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

/**
 * 아바타 장식 아이템 공통 디자인 규격
 *
 * - 아이템 PNG 전체 캔버스: 512 × 512
 * - 아이템 내부 프로필 기준 원: 중앙 400 × 400 (중심 256,256)
 *
 * 화면에서 실제 프로필 원이 profileSize일 때,
 * 아이템 PNG는 profileSize × (512 / 400) 크기로 렌더링한다.
 */
const DECORATION_CANVAS_SIZE = 512
const PROFILE_REFERENCE_SIZE = 400

const DECORATION_DISPLAY_RATIO =
  DECORATION_CANVAS_SIZE / PROFILE_REFERENCE_SIZE

const getDecorationImageUrl = (item?: ProfileAvatarDecorationItem) =>
  item?.valueImageUrl ??
  item?.imageUrl ??
  item?.itemImageUrl ??
  item?.originalImageUrl ??
  item?.previewImageUrl ??
  item?.thumbnailUrl

const normalizeProfileAssetUrl = (assetUrl?: string) => {
  const trimmedUrl = assetUrl?.trim()

  if (!trimmedUrl) {
    return undefined
  }

  if (/^(blob:|data:|https?:\/\/)/.test(trimmedUrl)) {
    return trimmedUrl
  }

  const baseUrl = API_BASE_URL.replace(/\/$/, '')
  const pathname = trimmedUrl.startsWith('/') ? trimmedUrl : `/${trimmedUrl}`

  return baseUrl ? `${baseUrl}${pathname}` : pathname
}

export function useProfileAvatar(
  imageUrl: string | undefined,
  equippedItems: ProfileAvatarEquippedItems | undefined,
  profileSize: number,
) {
  const borderItem = equippedItems?.border
  const borderImageUrl = normalizeProfileAssetUrl(getDecorationImageUrl(borderItem))

  /**
   * profileSize = 200px 일 때
   * displaySize = 200 × (512/400) = 256px
   * → PNG 안의 중앙 400px 기준 원이 실제 200px 프로필 원과 정확히 겹침
   */
  const displaySize = profileSize * DECORATION_DISPLAY_RATIO

  const decorations = borderImageUrl
    ? [{ displaySize, src: borderImageUrl }]
    : []

  return {
    decorations,
    normalizedImageUrl: normalizeProfileAssetUrl(imageUrl),
  }
}