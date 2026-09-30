import {
  BlockNoteSchema,
  createImageBlockConfig,
  defaultBlockSpecs,
  imageParse,
  imageToExternalHTML,
} from '@blocknote/core';
import { createReactBlockSpec } from '@blocknote/react';

import { isKlipyMediaUrl } from '@/shared/api';

import { CommunityImageBlock } from '../ui/CommunityImageBlock';

const imageSpec = createReactBlockSpec(createImageBlockConfig, (config) => ({
  meta: { fileBlockAccept: ['image/*'] },
  render: CommunityImageBlock,
  parse: imageParse(config),
  runsBefore: ['file'],
}))();
const renderExternalImage = imageToExternalHTML();

const protectedImageSpec: typeof imageSpec = {
  ...imageSpec,
  implementation: {
    ...imageSpec.implementation,
    toExternalHTML(block, editor) {
      if (!isKlipyMediaUrl(block.props.url) || !block.props.showPreview) {
        return renderExternalImage(block, editor);
      }

      // 내용 검사·복사에 쓰는 HTML도 이미지를 생성하므로 src 지정 전에 정책을 적용합니다.
      const image = document.createElement('img');
      image.referrerPolicy = 'no-referrer';
      image.crossOrigin = 'anonymous';
      image.src = block.props.url;
      image.alt = block.props.name || '';
      if (block.props.previewWidth) image.width = block.props.previewWidth;
      if (!block.props.caption) return { dom: image };

      const figure = document.createElement('figure');
      const caption = document.createElement('figcaption');
      caption.textContent = block.props.caption;
      figure.append(image, caption);
      return { dom: figure };
    },
  },
};

export const communityBlockNoteSchema = BlockNoteSchema.create({
  blockSpecs: { ...defaultBlockSpecs, image: protectedImageSpec },
});
