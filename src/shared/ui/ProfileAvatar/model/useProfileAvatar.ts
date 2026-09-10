import type {
  ProfileAvatarDecorationItem,
  ProfileAvatarEquippedItems,
} from '../types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

/**
 * 아바타 장식 아이템 공통 디자인 규격
 *
 * - PNG 전체 캔버스: 512 × 512
 * - 프로필 기준 원: 400 × 400
 * - 기준 원 중심: (256, 256)
 *
 * 따라서 실제 프로필 크기가 profileSize일 경우
 *
 * decorationSize = profileSize × (512 / 400)
 *
 * 모든 장식 아이템은 동일한 좌표계를 사용한다.
 */
const DECORATION_CANVAS_SIZE = 512
const PROFILE_REFERENCE_SIZE = 400

const DECORATION_DISPLAY_RATIO =
  DECORATION_CANVAS_SIZE / PROFILE_REFERENCE_SIZE

const getDecorationImageUrl = (
  item?: ProfileAvatarDecorationItem,
) =>
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
  const pathname = trimmedUrl.startsWith('/')
    ? trimmedUrl
    : `/${trimmedUrl}`

  return baseUrl
    ? `${baseUrl}${pathname}`
    : pathname
}

export function useProfileAvatar(
  imageUrl: string | undefined,
  equippedItems: ProfileAvatarEquippedItems | undefined,
  profileSize: number,
) {
  const borderItem = equippedItems?.border

  const borderImageUrl = normalizeProfileAssetUrl(
    getDecorationImageUrl(borderItem),
  )

  /**
   * ex)
   *
   * profileSize = 200px
   * displaySize = 200 × (512 / 400)
   *             = 256px
   */
  const displaySize =
    profileSize * DECORATION_DISPLAY_RATIO

  const decorations = borderImageUrl
    ? [
        {
          displaySize,
          src: borderImageUrl,
        },
      ]
    : []

  return {
    decorations,
    normalizedImageUrl: normalizeProfileAssetUrl(imageUrl),
  }
}