import { useEffect, useState } from 'react'

import type { StudyRecord } from '@/entities/study'

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
  const [navigationDirection, setNavigationDirection] = useState<
    'previous' | 'next' | undefined
  >()
  const selectedStudy =
    selectedStudyIndex === null ? undefined : studies[selectedStudyIndex]

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelectedStudyIndex(null)
        setNavigationDirection(undefined)
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

            if (!target.closest('[data-study-modal-card]')) {
              setNavigationDirection(undefined)
              onClose()
            }
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="mentor-study-modal-title"
        >
          <S.Content>
            <S.Title id="mentor-study-modal-title">
              {month}월 {weekNumber}주차 학습일지
            </S.Title>
            {isLoading && (
              <S.LoadingState
                role="status"
                aria-label="멘티 학습일지를 불러오는 중입니다."
              >
                <S.LoadingIndicator aria-hidden="true" />
                <S.LoadingText>
                  멘티 학습일지를 불러오는 중입니다.
                </S.LoadingText>
              </S.LoadingState>
            )}
            {!isLoading && (
              <S.Grid>
                {studies.map((study, index) => (
                  <Modal
                    key={study.studyId}
                    title={study.title}
                    author={study.authorName}
                    summary={study.summary}
                    onClick={() => {
                      setNavigationDirection(undefined)
                      setSelectedStudyIndex(index)
                    }}
                  />
                ))}
              </S.Grid>
            )}
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
          setNavigationDirection(undefined)
          onClose()
        }}
        study={selectedStudy}
        readOnly
        navigationDirection={navigationDirection}
        onPrevious={
          selectedStudyIndex !== null && selectedStudyIndex > 0
            ? () => {
                setNavigationDirection('previous')
                setSelectedStudyIndex(selectedStudyIndex - 1)
              }
            : undefined
        }
        onNext={
          selectedStudyIndex !== null &&
          selectedStudyIndex < studies.length - 1
            ? () => {
                setNavigationDirection('next')
                setSelectedStudyIndex(selectedStudyIndex + 1)
              }
            : undefined
        }
      />
    </>
  )
}
