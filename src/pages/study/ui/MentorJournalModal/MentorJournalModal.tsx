import { useEffect, useState } from 'react'

import { WriteModal } from '@/features/study'
import type { StudyJournal } from '@/features/study'
import { CLUB_MEMBER } from '@/shared/constants/clubMember'

import * as S from './MentorJournalModal.style'
import { Modal } from './SummaryModal/SummaryModal'

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
  const [selectedJournalIndex, setSelectedJournalIndex] = useState<
    number | null
  >(null)
  const journals: StudyJournal[] = CLUB_MEMBER.slice(0, -2).map((member) => ({
    title: '디자인 끝내줘',
    author: `2213 ${member}`,
    ownContent: '디자인 실력을 다시 알 수 있었다',
    clubContent: '오늘은 깃허브를 배웠다',
  }))
  const selectedJournal =
    selectedJournalIndex === null ? undefined : journals[selectedJournalIndex]

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelectedJournalIndex(null)
        onClose()
      }
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
    <>
      {selectedJournalIndex === null && (
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
              {CLUB_MEMBER.map((member, index) => {
                const summary =
                  index === 6 || index === 7 ? undefined : JOURNAL_SUMMARY

                return (
                  <Modal
                    key={member}
                    title="디자인 끝내줘"
                    author={`2213 ${member}`}
                    summary={summary}
                    onClick={() => setSelectedJournalIndex(index)}
                  />
                )
              })}
            </S.Grid>
          </S.Content>
        </S.Backdrop>
      )}
      <WriteModal
        isOpen={selectedJournalIndex !== null}
        onClose={() => {
          setSelectedJournalIndex(null)
          onClose()
        }}
        journal={selectedJournal}
        readOnly
        onPrevious={
          selectedJournalIndex !== null && selectedJournalIndex > 0
            ? () => setSelectedJournalIndex(selectedJournalIndex - 1)
            : undefined
        }
        onNext={
          selectedJournalIndex !== null &&
          selectedJournalIndex < journals.length - 1
            ? () => setSelectedJournalIndex(selectedJournalIndex + 1)
            : undefined
        }
      />
    </>
  )
}
