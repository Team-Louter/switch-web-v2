import { useEffect, useState } from 'react'

import { CLUB_MEMBER } from '@/shared/constants/clubMember'

import type { StudyRecord } from '../../model/types'
import { WriteModal } from '../WriteModal'
import * as S from './MentorStudyModal.style'
import { Modal } from './SummaryModal/SummaryModal'

interface MentorStudyModalProps {
  isOpen: boolean
  onClose: () => void
}

const STUDY_SUMMARY =
  'AI요약AI요약AI요약AI요약AI요약AI요약AI요약AI요약AI요약AI요약AI요약AI요약AI요약AI요약AI요약AI요약AI요약AI요약AI요약AI요약AI요약AI요약AI요약AI요약AI요약AI요약AI요약AI요약AI요약AI요약AI요약AI요약AI요약AI요약AI요약AI요약AI요약AI요약AI요약AI요약'

export function MentorStudyModal({
  isOpen,
  onClose,
}: MentorStudyModalProps) {
  const [selectedStudyIndex, setSelectedStudyIndex] = useState<
    number | null
  >(null)
  const studies: StudyRecord[] = CLUB_MEMBER.slice(0, -2).map((member) => ({
    title: '디자인 끝내줘',
    author: `2213 ${member}`,
    ownContent: '디자인 실력을 다시 알 수 있었다',
    clubContent: '오늘은 깃허브를 배웠다',
  }))
  const selectedStudy =
    selectedStudyIndex === null ? undefined : studies[selectedStudyIndex]

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelectedStudyIndex(null)
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
      {selectedStudyIndex === null && (
        <S.Backdrop
          onMouseDown={(event) => {
            const target = event.target as HTMLElement

            if (!target.closest('[data-study-modal-card]')) onClose()
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="mentor-study-modal-title"
        >
          <S.Content>
            <S.Title id="mentor-study-modal-title">
              6월 1주차 학습일지
            </S.Title>
            <S.Grid>
              {CLUB_MEMBER.map((member, index) => {
                const summary =
                  index === 6 || index === 7 ? undefined : STUDY_SUMMARY

                return (
                  <Modal
                    key={member}
                    title="디자인 끝내줘"
                    author={`2213 ${member}`}
                    summary={summary}
                    onClick={() => setSelectedStudyIndex(index)}
                  />
                )
              })}
            </S.Grid>
          </S.Content>
        </S.Backdrop>
      )}
      <WriteModal
        isOpen={selectedStudyIndex !== null}
        onClose={() => {
          setSelectedStudyIndex(null)
          onClose()
        }}
        study={selectedStudy}
        readOnly
        onPrevious={
          selectedStudyIndex !== null && selectedStudyIndex > 0
            ? () => setSelectedStudyIndex(selectedStudyIndex - 1)
            : undefined
        }
        onNext={
          selectedStudyIndex !== null &&
          selectedStudyIndex < studies.length - 1
            ? () => setSelectedStudyIndex(selectedStudyIndex + 1)
            : undefined
        }
      />
    </>
  )
}
