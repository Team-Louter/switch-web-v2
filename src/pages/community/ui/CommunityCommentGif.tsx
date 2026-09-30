import { useCallback, useState } from 'react';
import { MdClose } from 'react-icons/md';

import type { KlipyGif } from '@/shared/api';

import gifIcon from '../assets/svg/editor-gif.svg';
import { CommunityGifPicker } from './CommunityGifPicker';
import * as S from './CommunityCommentGif.style';

interface CommunityCommentGifButtonProps {
  label: string;
  disabled: boolean;
  onSelect: (gif: KlipyGif) => void;
}

interface CommunityCommentGifAttachmentProps {
  gif: KlipyGif;
  label: string;
  disabled: boolean;
  onRemove: () => void;
}

export function CommunityCommentGifButton({
  label,
  disabled,
  onSelect,
}: CommunityCommentGifButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = useCallback(() => setIsOpen(false), []);

  function handleSelect(gif: KlipyGif) {
    onSelect(gif);
    setIsOpen(false);
  }

  return (
    <>
      <S.GifButton
        type="button"
        aria-label={label}
        aria-haspopup="dialog"
        disabled={disabled}
        onClick={() => setIsOpen(true)}
      >
        <S.GifIcon src={gifIcon} alt="" />
      </S.GifButton>
      {isOpen && <CommunityGifPicker onSelect={handleSelect} onClose={handleClose} />}
    </>
  );
}

export function CommunityCommentGifAttachment({
  gif,
  label,
  disabled,
  onRemove,
}: CommunityCommentGifAttachmentProps) {
  const [hasError, setHasError] = useState(false);

  return (
    <S.Attachment role="group" aria-label={label}>
      {hasError ? (
        <S.ImageError role="status">GIF 미리보기를 불러오지 못했어요.</S.ImageError>
      ) : (
        <S.PreviewImage
          src={gif.url}
          alt={gif.contentDescription || gif.title || 'GIF'}
          referrerPolicy="no-referrer"
          crossOrigin="anonymous"
          onError={() => setHasError(true)}
        />
      )}
      <S.RemoveButton
        type="button"
        aria-label="첨부 GIF 제거"
        disabled={disabled}
        onClick={onRemove}
      >
        <MdClose size={16} />
      </S.RemoveButton>
      <S.GifBadge aria-hidden="true">GIF</S.GifBadge>
    </S.Attachment>
  );
}
