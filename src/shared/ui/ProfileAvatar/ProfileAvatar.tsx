import { useCallback, useImperativeHandle, useRef, useState } from 'react'

import * as S from './ProfileAvatar.style'
import { useProfileAvatar } from './model/useProfileAvatar'

import type { ProfileAvatarProps } from './types'

export function ProfileAvatar({
  alt = '',
  className,
  decoding,
  equippedItems,
  imageScale = 1,
  imageUrl,
  imageRef,
  loading,
  onImageLoad,
  onImageError,
  size,
  showLoadingState = false,
}: ProfileAvatarProps) {
  const { decorations, layout, normalizedImageUrl } =
    useProfileAvatar(imageUrl, equippedItems, size)

  const imageElementRef = useRef<HTMLImageElement | null>(null)
  useImperativeHandle<HTMLImageElement | null, HTMLImageElement | null>(
    imageRef,
    () => normalizedImageUrl ? imageElementRef.current : null,
    [normalizedImageUrl],
  )
  const [settledImageUrl, setSettledImageUrl] = useState<string>()
  const isLoading = showLoadingState && Boolean(normalizedImageUrl) && settledImageUrl !== normalizedImageUrl
  const handleImageRef = useCallback((image: HTMLImageElement | null) => {
    if (showLoadingState && image?.complete && normalizedImageUrl) {
      setSettledImageUrl(normalizedImageUrl)
    }
    imageElementRef.current = image
  }, [normalizedImageUrl, showLoadingState])

  return (
    <S.AvatarRoot className={className} $size={size} aria-busy={showLoadingState ? isLoading : undefined}>
      <S.ImageClip
        $size={size}
        $maskUrl={layout.maskUrl}
        $maskSize={layout.displaySize}
        $offsetX={layout.offsetX}
        $offsetY={layout.offsetY}
      >
        {isLoading && <S.ImageSkeleton aria-hidden="true" />}
        {normalizedImageUrl && (
          <S.ProfileImage
            ref={handleImageRef}
            src={normalizedImageUrl}
            alt={alt}
            $imageScale={imageScale}
            $isLoading={isLoading}
            decoding={decoding}
            loading={loading}
            onLoad={(event) => {
              if (showLoadingState) setSettledImageUrl(normalizedImageUrl)
              onImageLoad?.(event)
            }}
            onError={(event) => {
              if (showLoadingState) setSettledImageUrl(normalizedImageUrl)
              onImageError?.(event)
            }}
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
