import '@blocknote/core/fonts/inter.css';
import '@blocknote/mantine/style.css';

import type { Block } from '@blocknote/core';
import { BlockNoteView } from '@blocknote/mantine';
import { useCreateBlockNote } from '@blocknote/react';
import {
  type KeyboardEvent,
  type MouseEvent,
  type SyntheticEvent,
  useEffect,
  useRef,
} from 'react';

import {
  getCommunityFileDownloadUrl,
  type PostFileResponse,
} from '@/entities/community';

import type { CommunityPostImagePreview } from './CommunityPostImageViewer';

interface CommunityPostBlockContentProps {
  blocks: readonly Block[];
  files: readonly PostFileResponse[];
  onImagePreview: (image: CommunityPostImagePreview) => void;
}

function syncImagePreviewAccessibility(image: HTMLImageElement) {
  const wrapper = image.closest<HTMLElement>(
    '[data-content-type="image"] .bn-visual-media-wrapper',
  );
  if (!wrapper) return;

  // BlockNote가 생성한 읽기 전용 이미지에도 키보드로 뷰어를 열 수 있도록 합니다.
  if (image.complete && image.naturalWidth > 0) {
    wrapper.setAttribute('role', 'button');
    wrapper.setAttribute('aria-label', `${image.alt || '본문 이미지'} 크게 보기`);
    wrapper.setAttribute('aria-haspopup', 'dialog');
    wrapper.tabIndex = 0;
  } else {
    wrapper.removeAttribute('role');
    wrapper.removeAttribute('aria-label');
    wrapper.removeAttribute('aria-haspopup');
    wrapper.removeAttribute('tabindex');
  }
}

function resolveMediaUrl(
  mediaUrl: unknown,
  files: readonly PostFileResponse[],
): string | undefined {
  if (typeof mediaUrl !== 'string' || !mediaUrl.trim()) {
    return undefined;
  }

  const matchingFile = files.find((file) => file.fileName === mediaUrl);

  return getCommunityFileDownloadUrl(matchingFile?.fileUrl ?? mediaUrl);
}

function normalizeMediaUrls(
  blocks: readonly Block[],
  files: readonly PostFileResponse[],
): Block[] {
  return blocks.map((block) => {
    const blockWithUrlProps = block as unknown as {
      props: Record<string, unknown>;
      children: readonly Block[];
    };
    const children = normalizeMediaUrls(blockWithUrlProps.children, files);
    const isMediaBlock = ['audio', 'file', 'image', 'video'].includes(
      block.type,
    );
    const mediaUrl = isMediaBlock
      ? resolveMediaUrl(blockWithUrlProps.props.url, files)
      : undefined;

    return {
      ...block,
      props: mediaUrl
        ? { ...blockWithUrlProps.props, url: mediaUrl }
        : blockWithUrlProps.props,
      children,
    } as unknown as Block;
  });
}

export function CommunityPostBlockFallback({
  blocks,
  files,
  onImagePreview,
}: CommunityPostBlockContentProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const normalizedBlocks = normalizeMediaUrls(blocks, files);
  const editor = useCreateBlockNote({
    initialContent: normalizedBlocks,
    domAttributes: {
      editor: { 'aria-label': '게시글 본문' },
    },
  });

  function openImagePreview(target: EventTarget) {
    if (!(target instanceof Element)) return false;
    const wrapper = target.closest(
      '[data-content-type="image"] .bn-visual-media-wrapper[role="button"]',
    );
    const image = wrapper?.querySelector('img');
    if (!image?.naturalWidth || !image.naturalHeight) return false;

    onImagePreview({
      src: image.currentSrc,
      alt: image.alt || '본문 이미지',
      width: image.naturalWidth,
      height: image.naturalHeight,
    });
    return true;
  }

  function handleMediaBlockClick(event: MouseEvent<HTMLDivElement>) {
    if (openImagePreview(event.target)) return;
    if (!(event.target instanceof Element)) {
      return;
    }

    const fileBlock = event.target.closest<HTMLElement>('[data-file-block]');
    const blockElement = fileBlock?.closest<HTMLElement>(
      '[data-node-type="blockContainer"][data-id]',
    );
    const blockId = blockElement?.dataset.id;
    const block = blockId ? editor.getBlock(blockId) : undefined;

    if (block?.type !== 'file') {
      return;
    }

    const downloadUrl = getCommunityFileDownloadUrl(block.props.url);

    if (!downloadUrl) {
      return;
    }

    window.open(downloadUrl, '_blank', 'noopener,noreferrer');
  }

  function handleImageKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (
      (event.key === 'Enter' || event.key === ' ') &&
      openImagePreview(event.target)
    ) {
      event.preventDefault();
    }
  }

  function handleMediaLoadState(event: SyntheticEvent<HTMLDivElement>) {
    if (!(event.target instanceof HTMLImageElement)) {
      return;
    }

    const mediaWrapper = event.target.closest<HTMLElement>(
      '.bn-visual-media-wrapper',
    );

    if (mediaWrapper) {
      mediaWrapper.dataset.mediaLoading = 'false';
    }
    syncImagePreviewAccessibility(event.target);
  }

  useEffect(() => {
    const content = contentRef.current;

    if (!content) {
      return;
    }

    const syncMediaLoadingStates = () => {
      content
        .querySelectorAll<HTMLImageElement>('.bn-visual-media')
        .forEach((image) => {
          const mediaWrapper = image.closest<HTMLElement>(
            '.bn-visual-media-wrapper',
          );

          if (mediaWrapper) {
            mediaWrapper.dataset.mediaLoading = String(!image.complete);
          }
          syncImagePreviewAccessibility(image);
        });
    };

    const observer = new MutationObserver(syncMediaLoadingStates);

    syncMediaLoadingStates();
    observer.observe(content, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ['src'],
    });

    return () => {
      observer.disconnect();
    };
  }, [editor]);

  return (
    <div
      ref={contentRef}
      onClick={handleMediaBlockClick}
      onKeyDown={handleImageKeyDown}
      onLoadCapture={handleMediaLoadState}
      onErrorCapture={handleMediaLoadState}
    >
      <BlockNoteView
        className="community-post-blocks"
        editor={editor}
        theme="light"
        editable={false}
        formattingToolbar={false}
        linkToolbar={false}
        slashMenu={false}
        sideMenu={false}
        filePanel={false}
        tableHandles={false}
        emojiPicker={false}
        comments={false}
      />
    </div>
  );
}
