import { createFileBlockConfig } from '@blocknote/core'
import { FileBlockWrapper, type ReactCustomBlockRenderProps } from '@blocknote/react'
import { useContext } from 'react'

import { getCommunityFileKey } from '@/entities/community'

import { CommunityEditorFilesContext } from '../model/communityEditorFilesContext'
import { CommunityAttachmentPreview } from './CommunityAttachmentCard'

type CommunityFileBlockProps = ReactCustomBlockRenderProps<typeof createFileBlockConfig>

export function CommunityFileBlock(props: CommunityFileBlockProps) {
  const files = useContext(CommunityEditorFilesContext)
  const { url, name } = props.block.props
  const fileKey = getCommunityFileKey(url)
  const metadata = files.find(file => file.fileKey === fileKey) ??
    files.find(file => file.fileName === name || file.fileName === url)

  return (
    <FileBlockWrapper {...props}>
      <CommunityAttachmentPreview file={{
        fileUrl: url,
        fileName: name || metadata?.fileName || '첨부파일',
        fileSize: metadata?.fileSize,
        fileType: metadata?.fileType,
      }} />
    </FileBlockWrapper>
  )
}
