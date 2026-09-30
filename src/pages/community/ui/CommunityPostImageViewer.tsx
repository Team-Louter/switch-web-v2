import { useState } from 'react';
import { MdClose } from 'react-icons/md';

import { Modal } from '@/shared/ui';
import { isKlipyMediaUrl } from '@/shared/api';

import * as S from './CommunityPostImageViewer.style';

export interface CommunityPostImagePreview {
  src: string;
  alt: string;
  width: number;
  height: number;
}

interface CommunityPostImageViewerProps {
  image: CommunityPostImagePreview;
  onClose: () => void;
}

export function CommunityPostImageViewer({
  image,
  onClose,
}: CommunityPostImageViewerProps) {
  const [hasError, setHasError] = useState(false);
  const aspectRatio = image.width / image.height;
  const isKlipyGif = isKlipyMediaUrl(image.src);

  return (
    <Modal label="본문 이미지 보기" variant="media" onClose={onClose}>
      <S.CloseButton
        type="button"
        aria-label="본문 이미지 보기 닫기"
        onClick={onClose}
      >
        <MdClose size={24} />
      </S.CloseButton>
      {hasError ? (
        <S.ErrorMessage role="status">이미지를 불러오지 못했습니다.</S.ErrorMessage>
      ) : (
        <S.Image
          src={image.src}
          referrerPolicy={isKlipyGif ? 'no-referrer' : undefined}
          crossOrigin={isKlipyGif ? 'anonymous' : undefined}
          alt={image.alt}
          $aspectRatio={aspectRatio}
          onError={() => setHasError(true)}
        />
      )}
    </Modal>
  );
}
