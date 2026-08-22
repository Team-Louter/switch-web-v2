import '@blocknote/core/fonts/inter.css'
import '@blocknote/mantine/style.css'

import type { Block } from '@blocknote/core'
import { BlockNoteView } from '@blocknote/mantine'
import { useCreateBlockNote } from '@blocknote/react'
import type { MouseEvent } from 'react'

import { getCommunityFileDownloadUrl } from '@/entities/community'

interface CommunityPostBlockContentProps {
  blocks: readonly Block[]
}

export function CommunityPostBlockContent({
  blocks,
}: CommunityPostBlockContentProps) {
  const editor = useCreateBlockNote({
    initialContent: [...blocks],
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
    const fileUrl = typeof block?.props.url === 'string' ? block.props.url : undefined
    const downloadUrl = getCommunityFileDownloadUrl(fileUrl)

    if (block?.type !== 'file' || !downloadUrl) {
      return
    }

    window.open(downloadUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <div onClick={handleFileBlockClick}>
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
