import {
  BlockNoteSchema,
  createImageBlockConfig,
  createFileBlockConfig,
  fileParse,
  defaultBlockSpecs,
  imageParse,
  imageToExternalHTML,
} from '@blocknote/core';
import { createReactBlockSpec } from '@blocknote/react';

import { isKlipyMediaUrl } from '@/shared/api';

import { CommunityFileBlock } from '../ui/CommunityFileBlock';
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

const editorFileSpec = createReactBlockSpec(createFileBlockConfig, {
  meta: { fileBlockAccept: ['*/*'] },
  render: CommunityFileBlock,
  parse: fileParse(),
})();

// 편집 화면의 표시만 변경하고 복사·저장에 쓰는 기본 파일 HTML은 유지합니다.
export const communityWriteBlockNoteSchema = BlockNoteSchema.create({
  blockSpecs: {
    ...defaultBlockSpecs,
    image: protectedImageSpec,
    file: {
      ...editorFileSpec,
      implementation: {
        ...editorFileSpec.implementation,
        toExternalHTML: defaultBlockSpecs.file.implementation.toExternalHTML,
      },
    },
  },
});
