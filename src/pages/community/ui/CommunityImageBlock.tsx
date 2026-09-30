import { createImageBlockConfig } from '@blocknote/core';
import {
  ImageBlock,
  ResizableFileBlockWrapper,
  useResolveUrl,
  type ReactCustomBlockRenderProps,
} from '@blocknote/react';
import type { ComponentProps } from 'react';
import { RiImage2Fill } from 'react-icons/ri';

import { isKlipyMediaUrl } from '@/shared/api';

type CommunityImageBlockProps = ReactCustomBlockRenderProps<typeof createImageBlockConfig>;

export function CommunityImageBlock(props: CommunityImageBlockProps) {
  if (!isKlipyMediaUrl(props.block.props.url)) {
    return <ImageBlock {...props} />;
  }

  return <CommunityGifImageBlock {...props} />;
}

function CommunityGifImageBlock(props: CommunityImageBlockProps) {
  const resolved = useResolveUrl(props.block.props.url);
  const url = resolved.loadingState === 'loading' ? props.block.props.url : resolved.downloadUrl;
  // 라이브러리의 이미지 렌더러도 이 래퍼를 재사용하지만 공개 타입은 file로 한정되어 있습니다.
  const resizableProps = props as unknown as ComponentProps<typeof ResizableFileBlockWrapper>;

  return (
    <ResizableFileBlockWrapper {...resizableProps} buttonIcon={<RiImage2Fill size={24} />}>
      {/* React는 요청 정책을 src보다 먼저 적용하므로 첫 이미지 요청도 보호됩니다. */}
      <img
        className="bn-visual-media"
        referrerPolicy="no-referrer"
        crossOrigin="anonymous"
        src={url}
        alt={props.block.props.name || ''}
        width={props.block.props.previewWidth}
        contentEditable={false}
        draggable={false}
      />
    </ResizableFileBlockWrapper>
  );
}
