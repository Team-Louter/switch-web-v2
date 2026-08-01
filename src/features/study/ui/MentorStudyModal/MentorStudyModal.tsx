import { useEffect, useState } from 'react'

import type { StudyRecord } from '../../model/types'
import { WriteModal } from '../WriteModal'
import * as S from './MentorStudyModal.style'
import { Modal } from './SummaryModal/SummaryModal'

interface MentorStudyModalProps {
  isOpen: boolean
  onClose: () => void
  month?: number
  weekNumber?: number
  studies: StudyRecord[]
  isLoading: boolean
}

export function MentorStudyModal({
  isOpen,
  onClose,
  month,
  weekNumber,
  studies,
  isLoading,
}: MentorStudyModalProps) {
  const [selectedStudyIndex, setSelectedStudyIndex] = useState<
    number | null
  >(null)
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
              {month}월 {weekNumber}주차 학습일지
            </S.Title>
            <S.Grid>
              {studies.map((study, index) => (
                <Modal
                  key={study.studyId}
                  title={study.title}
                  author={study.authorName}
                  summary={study.summary}
                  onClick={() => setSelectedStudyIndex(index)}
                />
              ))}
            </S.Grid>
            {!isLoading && studies.length === 0 && (
              <S.EmptyMessage>
                아직 아무도 학습일지를 작성하지 않았습니다
              </S.EmptyMessage>
            )}
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
