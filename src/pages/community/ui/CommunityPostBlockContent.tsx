import '@blocknote/core/fonts/inter.css'
import '@blocknote/mantine/style.css'

import type { Block } from '@blocknote/core'
import { BlockNoteView } from '@blocknote/mantine'
import { useCreateBlockNote } from '@blocknote/react'

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

  return (
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
  )
}
