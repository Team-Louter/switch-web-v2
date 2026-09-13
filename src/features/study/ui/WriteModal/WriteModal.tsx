import { useEffect, useRef, useState } from 'react'
import { PiCaretLeft, PiCaretRight } from 'react-icons/pi'
import { toast } from 'react-toastify'

import {
  getCurrentKoreaDate,
  getMonthWeekNumber,
} from '@/shared/lib/studyWeek'
import type { StudyRecord } from '@/entities/study'

import { createStudy, modifyStudy } from '../../api/createStudy'
import { deleteStudy } from '../../api/deleteStudy'
import deleteIcon from '../../assets/delete-2-line.svg'
import aiSummaryOffIcon from '../../assets/Group2.svg'
import aiSummaryOnIcon from '../../assets/Group.svg'
import * as S from './WriteModal.style'

const SUBMIT_SUCCESS_DURATION = 900
const SUCCESS_PARTICLES = [
  { color: 'primary', x: -148, y: -102, rotation: -35, delay: 0 },
  { color: 'danger', x: -102, y: -140, rotation: 35, delay: 30 },
  { color: 'success', x: -42, y: -154, rotation: -5, delay: 70 },
  { color: 'info', x: 24, y: -152, rotation: 28, delay: 45 },
  { color: 'primary', x: 88, y: -130, rotation: -42, delay: 15 },
  { color: 'danger', x: 142, y: -88, rotation: 30, delay: 55 },
  { color: 'success', x: -164, y: -30, rotation: 42, delay: 85 },
  { color: 'info', x: -118, y: -12, rotation: -30, delay: 110 },
  { color: 'primary', x: 116, y: -8, rotation: 40, delay: 35 },
  { color: 'danger', x: 160, y: -36, rotation: -35, delay: 95 },
  { color: 'success', x: -145, y: 58, rotation: -28, delay: 20 },
  { color: 'info', x: -82, y: 94, rotation: 35, delay: 75 },
  { color: 'primary', x: -18, y: 110, rotation: -40, delay: 40 },
  { color: 'danger', x: 48, y: 96, rotation: 25, delay: 100 },
  { color: 'success', x: 112, y: 64, rotation: -30, delay: 60 },
  { color: 'info', x: 170, y: 30, rotation: 42, delay: 10 },
] as const

interface WriteModalProps {
  isOpen: boolean
  isLoading?: boolean
  onClose: () => void
  onCreateSuccess?: () => void | Promise<void>
  onDeleteSuccess?: () => void | Promise<void>
  month?: number
  weekNumber?: number
  study?: StudyRecord
  authorName?: string
  readOnly?: boolean
  onPrevious?: () => void
  onNext?: () => void
  navigationDirection?: 'previous' | 'next'
}

function WriteModalContent({
  isLoading = false,
  onClose,
  onCreateSuccess,
  onDeleteSuccess,
  month: providedMonth,
  weekNumber: providedWeekNumber,
  study,
  authorName,
  readOnly = false,
  onPrevious,
  onNext,
  navigationDirection,
}: WriteModalProps) {
  const currentDate = getCurrentKoreaDate()
  const month = providedMonth ?? currentDate.month
  const weekNumber =
    providedWeekNumber ??
    getMonthWeekNumber(currentDate.year, currentDate.month, currentDate.day)
  const [title, setTitle] = useState(study?.title ?? '')
  const [ownContent, setOwnContent] = useState(study?.ownContent ?? '')
  const [clubContent, setClubContent] = useState(study?.clubContent ?? '')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitSuccessVisible, setIsSubmitSuccessVisible] = useState(false)
  const [isAiSummaryEnabled, setIsAiSummaryEnabled] = useState(true)
  const submitSuccessTimeoutRef = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (submitSuccessTimeoutRef.current !== null) {
        window.clearTimeout(submitSuccessTimeoutRef.current)
      }
    }
  }, [])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose])

  const showSubmitSuccess = (onSuccess?: () => void | Promise<void>) => {
    if (submitSuccessTimeoutRef.current !== null) {
      window.clearTimeout(submitSuccessTimeoutRef.current)
    }

    setIsSubmitSuccessVisible(true)
    submitSuccessTimeoutRef.current = window.setTimeout(() => {
      onClose()
      void onSuccess?.()
      submitSuccessTimeoutRef.current = null
    }, SUBMIT_SUCCESS_DURATION)
  }

  const handleSubmit = async () => {
    const data = {
      year: currentDate.year,
      month,
      weekNumber,
      title,
      ownContent,
      clubContent,
    }

    try {
      setIsSubmitting(true)

      if (study) {
        await modifyStudy(study.studyId, data)
        showSubmitSuccess()
        return
      }

      await createStudy(data)
      showSubmitSuccess(onCreateSuccess)
    } catch {
      // 실패 시 모달을 유지해 사용자가 다시 시도할 수 있게 한다.
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!study) return

    try {
      setIsSubmitting(true)
      await deleteStudy(study.studyId)
      toast.success('학습일지가 삭제되었습니다.')
      onClose()
      void onDeleteSuccess?.()
    } catch {
      // 실패 시 모달을 유지해 사용자가 다시 시도할 수 있게 한다.
    } finally {
      setIsSubmitting(false)
    }
  }

  const emptyStudyMessage = '아직 학습일지를 작성하지 않았습니다'
  const displayedTitle = readOnly
    ? (study?.title ?? emptyStudyMessage)
    : title
  const displayedOwnContent = readOnly
    ? isAiSummaryEnabled
      ? (study?.summary || emptyStudyMessage)
      : (study?.ownContent ?? emptyStudyMessage)
    : ownContent
  const displayedClubContent = readOnly
    ? (study?.clubContent ?? emptyStudyMessage)
    : clubContent
  const displayedAuthorName = authorName ?? study?.authorName
  const isEmptyReadOnlyStudy = readOnly && !study && !isLoading
  const showClubContent = !readOnly || !isAiSummaryEnabled
  const contentKey = `${month}-${weekNumber}-${displayedAuthorName ?? 'unknown'}`

  return (
    <S.Backdrop
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <S.Modal>
        {readOnly && onPrevious && (
          <S.NavigationButton
            type="button"
            $direction="previous"
            onClick={onPrevious}
            aria-label="이전 멘티 학습일지 보기"
          >
            <PiCaretLeft aria-hidden="true" />
          </S.NavigationButton>
        )}
        {readOnly && onNext && (
          <S.NavigationButton
            type="button"
            $direction="next"
            onClick={onNext}
            aria-label="다음 멘티 학습일지 보기"
          >
            <PiCaretRight aria-hidden="true" />
          </S.NavigationButton>
        )}
        <S.ModalContent
          key={contentKey}
          $direction={navigationDirection}
          aria-live="polite"
        >
          <S.Header>
            <S.HeaderContent>
              <S.Title>{month}월 {weekNumber}주차 학습일지</S.Title>
              {readOnly && displayedAuthorName && (
                <S.Author>{displayedAuthorName}</S.Author>
              )}
            </S.HeaderContent>
            {readOnly && !isEmptyReadOnlyStudy && (
              <S.AiSummaryToggle
                type="button"
                $enabled={isAiSummaryEnabled}
                aria-label="AI 요약글 표시"
                aria-pressed={isAiSummaryEnabled}
                onClick={() => setIsAiSummaryEnabled((enabled) => !enabled)}
              >
                <img
                  src={
                    isAiSummaryEnabled ? aiSummaryOnIcon : aiSummaryOffIcon
                  }
                  alt=""
                />
                AI 요약
              </S.AiSummaryToggle>
            )}
          </S.Header>
          {isLoading ? (
            <S.LoadingState
              $readOnly={readOnly}
              role="status"
              aria-label="학습일지를 불러오는 중입니다."
            >
              <S.LoadingSkeleton aria-hidden="true">
                <S.LoadingSkeletonColumn>
                  <S.LoadingSkeletonField>
                    <S.LoadingSkeletonLabel />
                    <S.LoadingSkeletonBox $readOnly={readOnly} />
                  </S.LoadingSkeletonField>
                  {!readOnly && <S.LoadingSkeletonCount />}
                </S.LoadingSkeletonColumn>
                <S.LoadingSkeletonDivider />
                <S.LoadingSkeletonColumn>
                  <S.LoadingSkeletonField>
                    <S.LoadingSkeletonLabel />
                    <S.LoadingSkeletonBox
                      $multiline
                      $readOnly={readOnly}
                      $aiSummary={readOnly && isAiSummaryEnabled}
                    />
                  </S.LoadingSkeletonField>
                  {!readOnly && <S.LoadingSkeletonCount />}
                </S.LoadingSkeletonColumn>
                {(!readOnly || !isAiSummaryEnabled) && (
                  <S.LoadingSkeletonColumn>
                    <S.LoadingSkeletonField>
                      <S.LoadingSkeletonLabel />
                      <S.LoadingSkeletonBox
                        $multiline
                        $readOnly={readOnly}
                        $aiSummary={false}
                      />
                    </S.LoadingSkeletonField>
                    {!readOnly && <S.LoadingSkeletonCount />}
                  </S.LoadingSkeletonColumn>
                )}
              </S.LoadingSkeleton>
            </S.LoadingState>
          ) : isEmptyReadOnlyStudy ? (
            <S.EmptyState role="status">
              <S.EmptyStateTitle>
                아직 학습일지를 작성하지 않았습니다
              </S.EmptyStateTitle>
              <S.EmptyStateDescription>
                작성된 학습일지가 등록되면 이곳에서 확인할 수 있어요.
              </S.EmptyStateDescription>
            </S.EmptyState>
          ) : (
            <S.Form $readOnly={readOnly}>
              <S.Column>
                <S.Div>
                  <S.Label htmlFor="study-title">
                    제목 {!readOnly && <S.Required>*</S.Required>}
                  </S.Label>
                  <S.Input
                    id="study-title"
                    type="text"
                    placeholder="제목을 입력해주세요."
                    value={displayedTitle}
                    onChange={(e) => setTitle(e.target.value)}
                    readOnly={readOnly}
                    maxLength={50}
                  />
                </S.Div>
                {!readOnly && (
                  <S.LetterCount>{displayedTitle.length}/50</S.LetterCount>
                )}
              </S.Column>
              <S.FormDivider />
              <S.Column>
                <S.Div>
                  <S.Label htmlFor="study-own-content">
                    개인 학습 {!readOnly && <S.Required>*</S.Required>}
                  </S.Label>
                  <S.LearningInput
                    id="study-own-content"
                    placeholder="내용을 입력해주세요."
                    value={displayedOwnContent}
                    onChange={(e) => setOwnContent(e.target.value)}
                    readOnly={readOnly}
                    maxLength={1000}
                    $readOnly={readOnly}
                    $aiSummary={readOnly && isAiSummaryEnabled}
                  />
                </S.Div>
                {!readOnly && (
                  <S.LetterCount>
                    {displayedOwnContent.length}/1000
                  </S.LetterCount>
                )}
              </S.Column>
              <S.ClubContent
                $visible={showClubContent}
                aria-hidden={!showClubContent}
              >
                <S.ClubColumn>
                  <S.Div>
                    <S.Label htmlFor="study-club-content">
                      동아리 학습 {!readOnly && <S.Required>*</S.Required>}
                    </S.Label>
                    <S.LearningInput
                      id="study-club-content"
                      placeholder="내용을 입력해주세요."
                      value={displayedClubContent}
                      onChange={(e) => setClubContent(e.target.value)}
                      readOnly={readOnly}
                      tabIndex={showClubContent ? 0 : -1}
                      maxLength={1000}
                      $readOnly={readOnly}
                      $aiSummary={false}
                    />
                  </S.Div>
                  {!readOnly && (
                    <S.LetterCount>
                      {displayedClubContent.length}/1000
                    </S.LetterCount>
                  )}
                </S.ClubColumn>
              </S.ClubContent>
            </S.Form>
          )}
          <S.ButtonContainer $readOnly={readOnly}>
            <S.CancelButton type="button" onClick={onClose}>
              {readOnly ? '닫기' : '취소'}
            </S.CancelButton>
            {!readOnly && (
              <S.SubmitButton
                type="button"
                disabled={isSubmitting || isSubmitSuccessVisible || isLoading}
                aria-busy={isSubmitting || isLoading}
                onClick={handleSubmit}
              >
                <S.SubmitButtonContent>
                  {(isSubmitting || isLoading) && (
                    <S.SubmitLoadingSpinner aria-hidden="true" />
                  )}
                  <span>
                    {isLoading
                      ? '불러오는 중...'
                      : isSubmitting
                      ? study
                        ? '저장 중...'
                        : '제출 중...'
                      : study
                        ? '저장'
                        : '제출'}
                  </span>
                </S.SubmitButtonContent>
              </S.SubmitButton>
            )}
          </S.ButtonContainer>
          {isSubmitSuccessVisible && (
            <S.SuccessEffect role="status" aria-live="polite">
              <S.SuccessParticles aria-hidden="true">
                {SUCCESS_PARTICLES.map((particle, index) => (
                  <S.SuccessParticle
                    key={`${particle.color}-${index}`}
                    $color={particle.color}
                    $x={particle.x}
                    $y={particle.y}
                    $rotation={particle.rotation}
                    $delay={particle.delay}
                  />
                ))}
              </S.SuccessParticles>
              <S.SuccessContent>
                <S.SuccessMark aria-hidden="true">✓</S.SuccessMark>
                <S.SuccessMessage>
                  학습일지 {study ? '저장' : '제출'} 완료!
                </S.SuccessMessage>
              </S.SuccessContent>
            </S.SuccessEffect>
          )}
        </S.ModalContent>
      </S.Modal>
      {!readOnly && study && (
        <S.DeleteAction
          type="button"
          aria-label="학습일지 삭제"
          disabled={isSubmitting || isSubmitSuccessVisible}
          onClick={handleDelete}
        >
          <img src={deleteIcon} alt="" />
          학습일지 삭제하기
        </S.DeleteAction>
      )}
    </S.Backdrop>
  )
}

export function WriteModal(props: WriteModalProps) {
  if (!props.isOpen) return null

  return <WriteModalContent {...props} />
}
