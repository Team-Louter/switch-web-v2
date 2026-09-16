import { useState } from 'react'

import defaultProfileImage from '../../assets/default-profile.svg'

import * as S from './MemberAvatar.style'

interface MemberAvatarProps {
  userName?: string
  profileImageUrl?: string
  size?: number
  borderWidth?: number
}

export function MemberAvatar({
  userName = '',
  profileImageUrl,
  size = 32,
  borderWidth = 1,
}: MemberAvatarProps) {
  const [failedImageUrl, setFailedImageUrl] = useState<string | null>(null)
  const imageSource =
    profileImageUrl && profileImageUrl !== failedImageUrl
      ? profileImageUrl
      : defaultProfileImage

  return (
    <S.Avatar
      src={imageSource}
      alt={userName}
      $size={size}
      $borderWidth={borderWidth}
      onError={() => {
        if (profileImageUrl && failedImageUrl !== profileImageUrl) {
          setFailedImageUrl(profileImageUrl)
        }
      }}
    />
  )
}
