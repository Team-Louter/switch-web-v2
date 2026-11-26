import { type ReactNode, useEffect, useState } from 'react';

import { getLinkPreview, type LinkPreviewResponse } from '@/entities/community';

import * as S from './CommunityLinkPreview.style';

interface CommunityLinkSourceProps {
  href: string;
  children: ReactNode;
}

interface CommunityLinkPreviewProps {
  href: string;
  showSourceLink?: boolean;
}

export function CommunityLinkSource({ href, children }: CommunityLinkSourceProps) {
  return (
    <S.LinkSource href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </S.LinkSource>
  );
}

export function CommunityLinkPreview({
  href,
  showSourceLink = false,
}: CommunityLinkPreviewProps) {
  const [preview, setPreview] = useState<LinkPreviewResponse | null>(null);
  const [failedImage, setFailedImage] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    getLinkPreview({ url: href, signal: controller.signal })
      .then((data) => {
        if (!controller.signal.aborted) setPreview(data);
      })
      .catch(() => {
        // 조회에 실패해도 원본 링크는 열 수 있습니다.
      });

    return () => controller.abort();
  }, [href]);

  const source = showSourceLink
    ? <div><CommunityLinkSource href={href}>{href}</CommunityLinkSource></div>
    : null;

  if (!preview) return source;

  const hostname = new URL(href).hostname;
  const title = preview.title === hostname ? preview.siteName : preview.title;
  const siteName = preview.siteName.toLowerCase() !== title.toLowerCase() &&
    preview.siteName.toLowerCase() !== hostname ? preview.siteName : null;
  const imageUrl = preview.imageUrl !== failedImage ? preview.imageUrl : null;
  const hasMetadata = title.toLowerCase() !== hostname || preview.description || imageUrl;

  if (!hasMetadata) return source;

  return (
    <>
      {source}
      <S.LinkCard>
        <S.LinkDetails href={href} target="_blank" rel="noopener noreferrer" $layout={preview.layout}>
          <S.LinkText>
            {siteName && <S.LinkProvider>{siteName}</S.LinkProvider>}
            <S.LinkTitle>{title}</S.LinkTitle>
            {preview.description && <S.LinkDescription>{preview.description}</S.LinkDescription>}
          </S.LinkText>
          {imageUrl && (
            <S.LinkImage
              src={imageUrl}
              alt={preview.imageAlt || `${title} 미리보기`}
              $layout={preview.layout}
              loading="lazy"
              referrerPolicy="no-referrer"
              onError={() => setFailedImage(imageUrl)}
            />
          )}
        </S.LinkDetails>
      </S.LinkCard>
    </>
  );
}
