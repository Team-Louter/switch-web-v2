import {
  FaFile, FaFileAudio, FaFileCode, FaFileExcel,
  FaFilePdf, FaFilePowerpoint, FaFileVideo, FaFileWord, FaFileZipper,
} from 'react-icons/fa6'

import {
  formatCommunityFileSize,
  getCommunityFileKind,
  type CommunityAttachmentFile,
} from '../model/communityAttachment'
import * as S from './CommunityAttachmentCard.style'

interface CommunityAttachmentPreviewProps {
  file: CommunityAttachmentFile
}

interface CommunityAttachmentCardProps extends CommunityAttachmentPreviewProps {
  compact?: boolean
  tabIndex?: number
  onOpen: (file: CommunityAttachmentFile) => void
}

const FILE_ICONS = {
  pdf: FaFilePdf, document: FaFileWord, spreadsheet: FaFileExcel,
  presentation: FaFilePowerpoint, archive: FaFileZipper, code: FaFileCode,
  audio: FaFileAudio, video: FaFileVideo, file: FaFile,
}

export function CommunityAttachmentCard({
  file, compact = false, tabIndex, onOpen,
}: CommunityAttachmentCardProps) {
  const kind = getCommunityFileKind(file)

  return (
    <S.Card
      type="button"
      $compact={compact}
      data-file-kind={kind}
      aria-label={`${file.fileName} 열기 (새 탭)`}
      tabIndex={tabIndex}
      onClick={() => onOpen(file)}
    >
      <CommunityAttachmentDetails file={file} compact={compact} />
    </S.Card>
  )
}

export function CommunityAttachmentPreview({ file }: CommunityAttachmentPreviewProps) {
  const kind = getCommunityFileKind(file)

  return (
    <S.Card as="div" $compact={false} data-file-kind={kind} contentEditable={false}>
      <CommunityAttachmentDetails file={file} compact={false} />
    </S.Card>
  )
}

interface CommunityAttachmentDetailsProps extends CommunityAttachmentPreviewProps {
  compact: boolean
}

function CommunityAttachmentDetails({
  file, compact,
}: CommunityAttachmentDetailsProps) {
  const kind = getCommunityFileKind(file)
  const Icon = FILE_ICONS[kind]

  return (
    <>
      <S.Icon $kind={kind} $compact={compact} aria-hidden="true"><Icon /></S.Icon>
      <S.Details>
        <S.Name title={file.fileName}>{file.fileName}</S.Name>
        <S.Size>{formatCommunityFileSize(file.fileSize)}</S.Size>
      </S.Details>
    </>
  )
}
