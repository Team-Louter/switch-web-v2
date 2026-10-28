import { useEffect, useRef } from 'react'

import type { CommunityDownloadRisk } from '@/features/community'
import { Button, Modal } from '@/shared/ui'

import warningBear from '../assets/images/download-warning-bear.webp'
import type { CommunityAttachmentFile } from '../model/communityAttachment'
import * as S from './CommunityDownloadWarningModal.style'

interface CommunityDownloadWarningModalProps {
  file: CommunityAttachmentFile
  risk: Exclude<CommunityDownloadRisk, null>
  onCancel: () => void
  onConfirm: () => void
}

export function CommunityDownloadWarningModal({
  file, risk, onCancel, onConfirm,
}: CommunityDownloadWarningModalProps) {
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const previousFocus = document.activeElement
    contentRef.current?.querySelector('button')?.focus()
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onCancel()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) previousFocus.focus()
    }
  }, [onCancel])

  return (
    <Modal label="다운로드 전 확인해주세요" placement="bottom-right" width={360} allowOverflow onClose={onCancel}>
      <S.Character src={warningBear} alt="" aria-hidden="true" draggable={false} />
      <S.Content ref={contentRef}>
        <S.Badge>{risk === 'archive' ? '압축 파일 주의' : '실행 가능한 파일 주의'}</S.Badge>
        <S.Title>다운로드 전 확인해주세요</S.Title>
        <S.FileName title={file.fileName}>{file.fileName}</S.FileName>
        <S.Description>
          {risk === 'archive'
            ? '압축 파일 안에는 실행 파일이나 스크립트가 포함될 수 있어요.'
            : '파일을 실행하거나 설치하면 기기와 개인정보에 영향을 줄 수 있어요.'}
          {' '}출처를 확인하고 신뢰하는 파일만 열어주세요.
        </S.Description>
        <S.Actions>
          <Button size="md" variant="neutral" onClick={onCancel}>닫기</Button>
          <Button size="md" variant="neutral" onClick={onConfirm}>계속 다운로드</Button>
        </S.Actions>
      </S.Content>
    </Modal>
  )
}
