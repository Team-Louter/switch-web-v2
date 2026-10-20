import { useCallback, useState } from 'react';

import type { ProfileAvatarEquippedItems } from '@/shared/ui';

import * as S from './CommunityCommentBranch.style';

interface CommunityCommentAvatarProps {
  alt?: string;
  imageUrl?: string;
  isPending?: boolean;
  equippedItems?: ProfileAvatarEquippedItems;
  hasCustomBorder?: boolean;
}

interface ImageResult {
  url: string;
  loaded: boolean;
}

export function CommunityCommentAvatar({
  alt = '',
  imageUrl,
  isPending = false,
  equippedItems,
  hasCustomBorder = false,
}: CommunityCommentAvatarProps) {
  const [imageResult, setImageResult] = useState<ImageResult | null>(null);
  const hasResult = imageResult?.url === imageUrl;
  const isImageReady = hasResult && imageResult?.loaded === true;
  // URL이 없는 확정 댓글과 로딩 실패는 대기 상태가 아니므로 skeleton을 종료한다.
  const isLoading = imageUrl ? !hasResult : isPending;

  const handleImageRef = useCallback((image: HTMLImageElement | null) => {
    // 캐시에서 이미 로드된 이미지도 이벤트 발생 시점과 무관하게 반영한다.
    if (image?.complete && imageUrl) {
      setImageResult({ url: imageUrl, loaded: image.naturalWidth > 0 });
    }
  }, [imageUrl]);

  const handleImageLoad = () => {
    if (imageUrl) setImageResult({ url: imageUrl, loaded: true });
  };

  const handleImageError = () => {
    if (imageUrl) setImageResult({ url: imageUrl, loaded: false });
  };

  return (
    <S.CommentAvatarSlot aria-busy={isLoading}>
      <S.CommentAuthorImage
        alt={alt}
        $hasBorder={hasCustomBorder}
        $isImageReady={isImageReady}
        equippedItems={equippedItems}
        imageUrl={imageUrl}
        imageRef={handleImageRef}
        onImageLoad={handleImageLoad}
        onImageError={handleImageError}
        size={32}
      />
      {isLoading && <S.ReplyLoadSkeletonAvatar aria-hidden="true" />}
    </S.CommentAvatarSlot>
  );
}
