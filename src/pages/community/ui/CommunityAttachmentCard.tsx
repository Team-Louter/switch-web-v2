import {
  FaDownload, FaFile, FaFileAudio, FaFileCode, FaFileExcel,
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
  isDownloading: boolean
  compact?: boolean
  tabIndex?: number
  onDownload: (file: CommunityAttachmentFile) => void
}

const FILE_ICONS = {
  pdf: FaFilePdf, document: FaFileWord, spreadsheet: FaFileExcel,
  presentation: FaFilePowerpoint, archive: FaFileZipper, code: FaFileCode,
  audio: FaFileAudio, video: FaFileVideo, file: FaFile,
}

export function CommunityAttachmentCard({
  file, isDownloading, compact = false, tabIndex, onDownload,
}: CommunityAttachmentCardProps) {
  const kind = getCommunityFileKind(file)
  const Icon = FILE_ICONS[kind]

  return (
    <S.Card
      type="button"
      $compact={compact}
      data-file-kind={kind}
      aria-label={`${file.fileName} 다운로드`}
      aria-busy={isDownloading}
      disabled={isDownloading}
      tabIndex={tabIndex}
      onClick={() => onDownload(file)}
    >
      <S.Icon $kind={kind} $compact={compact} aria-hidden="true"><Icon /></S.Icon>
      <S.Details>
        <S.Name title={file.fileName}>{file.fileName}</S.Name>
        <S.Size>{isDownloading ? '다운로드 중…' : formatCommunityFileSize(file.fileSize)}</S.Size>
      </S.Details>
      <S.DownloadIcon aria-hidden="true"><FaDownload /></S.DownloadIcon>
    </S.Card>
  )
}
