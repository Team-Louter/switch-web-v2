import '@blocknote/core/fonts/inter.css'
import '@blocknote/mantine/style.css'

import type { Block } from '@blocknote/core'
import { BlockNoteView } from '@blocknote/mantine'
import { useCreateBlockNote } from '@blocknote/react'
import {
  type MouseEvent,
  type SyntheticEvent,
  useEffect,
  useRef,
} from 'react'

import {
  getCommunityFileDownloadUrl,
  type PostFileResponse,
} from '@/entities/community'

interface CommunityPostBlockContentProps {
  blocks: readonly Block[]
  files: readonly PostFileResponse[]
}

function resolveMediaUrl(
  mediaUrl: unknown,
  files: readonly PostFileResponse[],
): string | undefined {
  if (typeof mediaUrl !== 'string' || !mediaUrl.trim()) {
    return undefined
  }

  const matchingFile = files.find((file) => file.fileName === mediaUrl)

  return getCommunityFileDownloadUrl(matchingFile?.fileUrl ?? mediaUrl)
}

function normalizeMediaUrls(
  blocks: readonly Block[],
  files: readonly PostFileResponse[],
): Block[] {
  return blocks.map((block) => {
    const blockWithUrlProps = block as unknown as {
      props: Record<string, unknown>
      children: readonly Block[]
    }
    const children = normalizeMediaUrls(blockWithUrlProps.children, files)
    const isMediaBlock = ['audio', 'file', 'image', 'video'].includes(
      block.type,
    )
    const mediaUrl = isMediaBlock
      ? resolveMediaUrl(blockWithUrlProps.props.url, files)
      : undefined

    return {
      ...block,
      props: mediaUrl
        ? { ...blockWithUrlProps.props, url: mediaUrl }
        : blockWithUrlProps.props,
      children,
    } as unknown as Block
  })
}

export function CommunityPostBlockFallback({
  blocks,
  files,
}: CommunityPostBlockContentProps) {
  const contentRef = useRef<HTMLDivElement>(null)
  const normalizedBlocks = normalizeMediaUrls(blocks, files)
  const editor = useCreateBlockNote({
    initialContent: normalizedBlocks,
    domAttributes: {
      editor: { 'aria-label': '게시글 본문' },
    },
  })

  function handleFileBlockClick(event: MouseEvent<HTMLDivElement>) {
    if (!(event.target instanceof Element)) {
      return
    }

    const fileBlock = event.target.closest<HTMLElement>('[data-file-block]')
    const blockElement = fileBlock?.closest<HTMLElement>(
      '[data-node-type="blockContainer"][data-id]',
    )
    const blockId = blockElement?.dataset.id
    const block = blockId ? editor.getBlock(blockId) : undefined

    if (block?.type !== 'file') {
      return
    }

    const downloadUrl = getCommunityFileDownloadUrl(block.props.url)

    if (!downloadUrl) {
      return
    }

    window.open(downloadUrl, '_blank', 'noopener,noreferrer')
  }

  function handleMediaLoadState(event: SyntheticEvent<HTMLDivElement>) {
    if (!(event.target instanceof HTMLImageElement)) {
      return
    }

    const mediaWrapper = event.target.closest<HTMLElement>(
      '.bn-visual-media-wrapper',
    )

    if (mediaWrapper) {
      mediaWrapper.dataset.mediaLoading = 'false'
    }
  }

  useEffect(() => {
    const content = contentRef.current

    if (!content) {
      return
    }

    const syncMediaLoadingStates = () => {
      content.querySelectorAll<HTMLImageElement>('.bn-visual-media').forEach(
        (image) => {
          const mediaWrapper = image.closest<HTMLElement>(
            '.bn-visual-media-wrapper',
          )

          if (mediaWrapper) {
            mediaWrapper.dataset.mediaLoading = String(!image.complete)
          }
        },
      )
    }

    const observer = new MutationObserver(syncMediaLoadingStates)

    syncMediaLoadingStates()
    observer.observe(content, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ['src'],
    })

    return () => {
      observer.disconnect()
    }
  }, [editor])

  return (
    <div
      ref={contentRef}
      onClick={handleFileBlockClick}
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
  )
}
