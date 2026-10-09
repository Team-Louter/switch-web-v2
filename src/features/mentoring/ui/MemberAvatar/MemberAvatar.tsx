import { useState } from 'react'

import type { ProfileAvatarEquippedItems } from '@/shared/ui'

import defaultProfileImage from '../../assets/default-profile.svg'

import * as S from './MemberAvatar.style'

interface MemberAvatarProps {
  userName?: string
  profileImageUrl?: string
  equippedItems?: ProfileAvatarEquippedItems
  size?: number
  borderWidth?: number
}

export function MemberAvatar({
  userName = '',
  profileImageUrl,
  equippedItems,
  size = 32,
  borderWidth = 1,
}: MemberAvatarProps) {
  const [failedImageUrl, setFailedImageUrl] = useState<string | null>(null)
  const normalizedImageUrl = profileImageUrl?.trim()
  const imageSource =
    normalizedImageUrl && normalizedImageUrl !== failedImageUrl
      ? normalizedImageUrl
      : new URL(defaultProfileImage, window.location.origin).href
  const border = equippedItems?.border
  const borderImageUrl =
    border?.valueImageUrl ??
    border?.imageUrl ??
    border?.itemImageUrl ??
    border?.originalImageUrl ??
    border?.previewImageUrl ??
    border?.thumbnailUrl

  return (
    <S.Avatar
      imageUrl={imageSource}
      alt={userName}
      equippedItems={equippedItems}
      size={size}
      $borderWidth={borderWidth}
      $hasCustomBorder={Boolean(borderImageUrl?.trim())}
      onImageError={() => {
        if (normalizedImageUrl && failedImageUrl !== normalizedImageUrl) {
          setFailedImageUrl(normalizedImageUrl)
        }
      }}
    />
  )
}
