import { useState } from 'react'

import { HEARTED_COLOR } from '@/shared/constants/community'
import * as token from '@/shared/styles/values/token'
import {
  CaretDownIcon,
  CommentIcon,
  EyeIcon,
  HeartIcon,
  PaperClipIcon,
} from '@/shared/ui/icons'
import type { PostFile } from '@/entities/post'

import {
  FileDivider,
  FileLink,
  FileList,
  FilePill,
  FileSummary,
  FileToggleButton,
  HeartButton,
  IconBox,
  Pill,
  PillRow,
  StatItem,
  Wrap,
} from './PostStats.style'

type PostStatsProps = {
  likeCount: number
  commentCount: number
  viewers: number
  isHearted: boolean
  files: PostFile[]
  isHeartPending: boolean
  onHeartToggle: () => void
}

/**
 * 첨부 파일 요약 문구를 만든다. (Ex. 첨부 파일 "탈출법.pdf"외 4개)
 *
 * @param files 첨부 파일 목록
 */
const getFileSummary = (files: PostFile[]): string => {
  const [first, ...rest] = files

  return rest.length > 0
    ? `첨부 파일 “${first.fileName}”외 ${rest.length}개`
    : `첨부 파일 “${first.fileName}”`
}

export function PostStats({
  likeCount,
  commentCount,
  viewers,
  isHearted,
  files,
  isHeartPending,
  onHeartToggle,
}: PostStatsProps) {
  const [isFileListOpen, setIsFileListOpen] = useState(false)

  return (
    <Wrap>
      <PillRow>
        <Pill>
          <HeartButton
            type="button"
            $active={isHearted}
            disabled={isHeartPending}
            aria-pressed={isHearted}
            aria-label="좋아요"
            onClick={onHeartToggle}
          >
            <IconBox
              $color={isHearted ? HEARTED_COLOR : token.colors.gray.gray30}
            >
              <HeartIcon aria-hidden="true" />
            </IconBox>
            {likeCount}
          </HeartButton>
          <StatItem>
            <IconBox $color={token.colors.gray.gray30}>
              <CommentIcon aria-hidden="true" />
            </IconBox>
            {commentCount}
          </StatItem>
          <StatItem>
            <IconBox $color={token.colors.gray.gray30}>
              <EyeIcon width={20} height={20} aria-hidden="true" />
            </IconBox>
            {viewers}
          </StatItem>
        </Pill>
        {/* 첨부 파일이 있을 때만 파일 영역을 보여준다 */}
        {files.length > 0 && (
          <FilePill>
            <FileSummary>
              <IconBox $color={token.colors.gray.gray70}>
                <PaperClipIcon aria-hidden="true" />
              </IconBox>
              {getFileSummary(files)}
            </FileSummary>
            <FileDivider aria-hidden="true" />
            <FileToggleButton
              type="button"
              $open={isFileListOpen}
              aria-expanded={isFileListOpen}
              aria-label="첨부 파일 목록 열기"
              onClick={() => setIsFileListOpen((prev) => !prev)}
            >
              <CaretDownIcon aria-hidden="true" />
            </FileToggleButton>
          </FilePill>
        )}
      </PillRow>
      {/* 펼쳤을 때만 개별 첨부 파일을 나열한다 */}
      {isFileListOpen && files.length > 0 && (
        <FileList>
          {files.map((file) => (
            <li key={file.fileId}>
              <FileLink href={file.fileUrl} target="_blank" rel="noreferrer">
                <IconBox $color={token.colors.gray.gray70}>
                  <PaperClipIcon aria-hidden="true" />
                </IconBox>
                {file.fileName}
              </FileLink>
            </li>
          ))}
        </FileList>
      )}
    </Wrap>
  )
}
