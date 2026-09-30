import { useEffect, useState } from 'react';

import {
  getKlipyGifPreview,
  isKlipyGifApiConfigured,
  type KlipyGifPreview as KlipyGifPreviewData,
} from '@/shared/api';

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
  const preview = loadedPreview?.slug === slug ? loadedPreview.preview : null;

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
    <S.PreviewLink href={href} target="_blank" rel="noopener noreferrer">
      <S.PreviewImage
        src={preview.url}
        alt={preview.contentDescription || preview.title || 'KLIPY GIF'}
        width={preview.width}
        height={preview.height}
        loading="lazy"
        decoding="async"
        referrerPolicy="no-referrer"
        onError={() => setLoadedPreview({ slug, preview: null })}
      />
      <S.Attribution>
        {preview.creatorName && <span>출처: {preview.creatorName}</span>}
        {preview.source && <span>· {preview.source}</span>}
        <span>· Powered by KLIPY</span>
      </S.Attribution>
    </S.PreviewLink>
  );
}
