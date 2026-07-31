import { useEffect } from 'react'

import { CLUB_MEMBER } from '@/shared/constants/clubMember'

import * as S from './MentorJournalModal.style'
import { Modal } from './Modal/Modal'

interface MentorJournalModalProps {
  isOpen: boolean
  onClose: () => void
}

const JOURNAL_SUMMARY =
  'AI요약AI요약AI요약AI요약AI요약AI요약AI요약AI요약AI요약AI요약AI요약AI요약AI요약AI요약AI요약AI요약AI요약AI요약AI요약AI요약AI요약AI요약AI요약AI요약AI요약AI요약AI요약AI요약AI요약AI요약AI요약AI요약AI요약AI요약AI요약AI요약AI요약AI요약AI요약AI요약'

export function MentorJournalModal({
  isOpen,
  onClose,
}: MentorJournalModalProps) {
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <S.Backdrop
      onMouseDown={(event) => {
        const target = event.target as HTMLElement

        if (!target.closest('[data-journal-modal-card]')) onClose()
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="mentor-journal-modal-title"
    >
      <S.Content>
        <S.Title id="mentor-journal-modal-title">
          6월 1주차 학습일지
        </S.Title>
        <S.Grid>
          {CLUB_MEMBER.map((member, index) => (
            <Modal
              key={member}
              title="디자인 끝내줘"
              author={`2213 ${member}`}
              summary={index === 6 || index === 7 ? undefined : JOURNAL_SUMMARY}
            />
          ))}
        </S.Grid>
      </S.Content>
    </S.Backdrop>
  )
}
