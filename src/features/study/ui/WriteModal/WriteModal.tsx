import { useState } from 'react'
import { PiCaretLeft, PiCaretRight } from 'react-icons/pi'

import {
  getCurrentKoreaDate,
  getMonthWeekNumber,
} from '@/shared/lib/studyWeek'
import type { StudyRecord } from '@/entities/study'

import { createStudy, modifyStudy } from '../../api/createStudy'
import { deleteStudy } from '../../api/deleteStudy'
import deleteIcon from '../../assets/delete-2-line.svg'
import * as S from './WriteModal.style'

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
        onClose()
        return
      }

      await createStudy(data)
      onClose()
      void onCreateSuccess?.()
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
    ? (study?.ownContent ?? emptyStudyMessage)
    : ownContent
  const displayedClubContent = readOnly
    ? (study?.clubContent ?? emptyStudyMessage)
    : clubContent

  return (
    <S.Backdrop>
      <S.Modal $readOnly={readOnly}>
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
        <S.Header>
          <S.Title>{month}월 {weekNumber}주차 학습일지</S.Title>
          {readOnly && (study?.authorName || authorName) && (
            <S.Author>{study?.authorName ?? authorName}</S.Author>
          )}
        </S.Header>
        {isLoading ? (
          <S.LoadingState
            role="status"
            aria-label="학습일지를 불러오는 중입니다."
          >
            <S.LoadingIndicator aria-hidden="true" />
            <S.LoadingText>학습일지를 불러오는 중입니다.</S.LoadingText>
          </S.LoadingState>
        ) : (
          <S.Form>
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
                  $readOnly={readOnly}
                />
              </S.Div>
              <S.LetterCount>{displayedTitle.length}/50</S.LetterCount>
            </S.Column>
            {!readOnly && <S.FormDivider />}
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
                />
              </S.Div>
              <S.LetterCount>{displayedOwnContent.length}/1000</S.LetterCount>
            </S.Column>
            <S.Column>
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
                  maxLength={1000}
                  $readOnly={readOnly}
                />
              </S.Div>
              <S.LetterCount>{displayedClubContent.length}/1000</S.LetterCount>
            </S.Column>
          </S.Form>
        )}
        <S.ButtonContainer $readOnly={readOnly}>
          <S.CancelButton type="button" onClick={onClose}>
            {readOnly ? '닫기' : '취소'}
          </S.CancelButton>
          {!readOnly && (
            <S.SubmitButton
              type="button"
              disabled={isSubmitting}
              onClick={handleSubmit}
            >
              {study ? '저장' : '제출'}
            </S.SubmitButton>
          )}
        </S.ButtonContainer>
      </S.Modal>
      {!readOnly && study && (
        <S.DeleteAction
          type="button"
          aria-label="학습일지 삭제"
          disabled={isSubmitting}
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
