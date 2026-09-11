import { getDecorationLayout } from './decorationLayout'

import type {
  ProfileAvatarDecorationItem,
  ProfileAvatarEquippedItems,
} from '../types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

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
  const layout = getDecorationLayout(borderImageUrl, profileSize)

  const decorations = borderImageUrl
    ? [
        {
          ...layout,
          src: borderImageUrl,
        },
      ]
    : []

  return {
    decorations,
    layout,
    normalizedImageUrl: normalizeProfileAssetUrl(imageUrl),
  }
}
