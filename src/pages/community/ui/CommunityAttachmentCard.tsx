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

interface CommunityAttachmentCardProps {
  file: CommunityAttachmentFile
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
  const Icon = FILE_ICONS[kind]

  return (
    <S.Card
      type="button"
      $compact={compact}
      data-file-kind={kind}
      aria-label={`${file.fileName} 열기 (새 탭)`}
      tabIndex={tabIndex}
      onClick={() => onOpen(file)}
    >
      <S.Icon $kind={kind} $compact={compact} aria-hidden="true"><Icon /></S.Icon>
      <S.Details>
        <S.Name title={file.fileName}>{file.fileName}</S.Name>
        <S.Size>{formatCommunityFileSize(file.fileSize)}</S.Size>
      </S.Details>
    </S.Card>
  )
}
