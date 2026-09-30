import { useEffect, useState } from 'react';
import { MdClose } from 'react-icons/md';

import {
  getKlipyGifPreview,
  isKlipyGifApiConfigured,
  type KlipyGifPreview as KlipyGifPreviewData,
} from '@/shared/api';
import { Modal } from '@/shared/ui';

import * as S from './CommunityKlipyGifPreview.style';

interface CommunityKlipyGifPreviewProps {
  href: string;
  slug: string;
}

export function CommunityKlipyGifPreview({
  href,
  slug,
}: CommunityKlipyGifPreviewProps) {
  const [loadedPreview, setLoadedPreview] = useState<{
    slug: string;
    preview: KlipyGifPreviewData | null;
  } | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const preview = loadedPreview?.slug === slug ? loadedPreview.preview : null;
  const description = preview?.contentDescription || preview?.title || 'KLIPY GIF';

  const handleClose = () => setIsExpanded(false);

  useEffect(() => {
    if (!isKlipyGifApiConfigured()) return;

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 8000);
    getKlipyGifPreview(slug, controller.signal)
      .then((result) => {
        if (!controller.signal.aborted) {
          setLoadedPreview({ slug, preview: result });
        }
      })
      .catch(() => {
        // Keep the original link available when the API is unavailable or the GIF was removed.
        if (!controller.signal.aborted) setLoadedPreview({ slug, preview: null });
      })
      .finally(() => window.clearTimeout(timeoutId));

    return () => {
      controller.abort();
      window.clearTimeout(timeoutId);
    };
  }, [slug]);

  if (!preview) {
    return (
      <S.FallbackLink href={href} target="_blank" rel="noopener noreferrer">
        {href}
      </S.FallbackLink>
    );
  }

  return (
    <>
      <S.Preview>
        <S.PreviewButton
          type="button"
          aria-label={`${description} 크게 보기`}
          aria-haspopup="dialog"
          onClick={() => setIsExpanded(true)}
        >
          <S.PreviewImage
            src={preview.url}
            alt={description}
            width={preview.width}
            height={preview.height}
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
            onError={() => setLoadedPreview({ slug, preview: null })}
          />
        </S.PreviewButton>
        {(preview.creatorName || preview.source) && (
          <S.Attribution>
            {preview.creatorName && <span>출처: {preview.creatorName}</span>}
            {preview.source && (
              <span>{preview.creatorName ? '· ' : ''}{preview.source}</span>
            )}
          </S.Attribution>
        )}
      </S.Preview>
      {isExpanded && (
        <Modal label="GIF 크게 보기" width={720} onClose={handleClose}>
          <S.ExpandedView>
            <S.ExpandedHeader>
              <S.ExpandedTitle>GIF 크게 보기</S.ExpandedTitle>
              <S.CloseButton type="button" aria-label="GIF 크게 보기 닫기" onClick={handleClose}>
                <MdClose size={22} />
              </S.CloseButton>
            </S.ExpandedHeader>
            <S.ExpandedImage
              src={preview.url}
              alt={description}
              referrerPolicy="no-referrer"
              onError={() => setLoadedPreview({ slug, preview: null })}
            />
          </S.ExpandedView>
        </Modal>
      )}
    </>
  );
}
