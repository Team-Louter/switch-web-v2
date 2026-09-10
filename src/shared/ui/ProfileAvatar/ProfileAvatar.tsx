import * as S from './ProfileAvatar.style'
import { useProfileAvatar } from './model/useProfileAvatar'

import type { ProfileAvatarProps } from './types'

export function ProfileAvatar({
  alt = '',
  className,
  equippedItems,
  imageScale = 1,
  imageUrl,
  size,
}: ProfileAvatarProps) {
  const { decorations, layout, normalizedImageUrl } =
    useProfileAvatar(imageUrl, equippedItems, size)

  return (
    <S.AvatarRoot className={className} $size={size}>
      <S.ImageClip
        $size={size}
        $maskUrl={layout.maskUrl}
        $maskSize={layout.displaySize}
        $offsetX={layout.offsetX}
        $offsetY={layout.offsetY}
      >
        {normalizedImageUrl && (
          <S.ProfileImage
            src={normalizedImageUrl}
            alt={alt}
            $imageScale={imageScale}
          />
        )}
      </S.ImageClip>

      {decorations.map((decoration) => (
        <S.DecorationImage
          key={decoration.src}
          src={decoration.src}
          alt=""
          aria-hidden="true"
          $displaySize={decoration.displaySize}
          $offsetX={decoration.offsetX}
          $offsetY={decoration.offsetY}
        />
      ))}
    </S.AvatarRoot>
  )
}
