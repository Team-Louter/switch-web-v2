import defaultProfileImage from '@/shared/assets/sidebar/profile.png'

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
  return (
    <S.Avatar
      src={profileImageUrl || defaultProfileImage}
      alt={userName}
      $size={size}
      $borderWidth={borderWidth}
    />
  )
}
