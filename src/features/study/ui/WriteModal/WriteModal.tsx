import { useState } from 'react'
import { PiCaretLeft, PiCaretRight, PiTrash } from 'react-icons/pi'

import {
  getCurrentKoreaDate,
  getMonthWeekNumber,
} from '@/shared/lib/studyWeek'

import { createStudy, modifyStudy } from '../../api/createStudy'
import { deleteStudy } from '../../api/deleteStudy'
import type { StudyRecord } from '../../model/types'
import * as S from './WriteModal.style'

interface WriteModalProps {
  isOpen: boolean
  onClose: () => void
  onCreateSuccess?: () => void | Promise<void>
  onDeleteSuccess?: () => void | Promise<void>
  month?: number
  weekNumber?: number
  study?: StudyRecord
  readOnly?: boolean
  onPrevious?: () => void
  onNext?: () => void
}

function WriteModalContent({
  onClose,
  onCreateSuccess,
  onDeleteSuccess,
  month: providedMonth,
  weekNumber: providedWeekNumber,
  study,
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
    } catch (error) {
      console.error(
        study ? '학습일지를 수정하지 못했습니다.' : '학습일지를 작성하지 못했습니다.',
        error,
      )
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
    } catch (error) {
      console.error('학습일지를 삭제하지 못했습니다.', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const displayedTitle = readOnly ? (study?.title ?? '') : title
  const displayedOwnContent = readOnly ? (study?.ownContent ?? '') : ownContent
  const displayedClubContent = readOnly
    ? (study?.clubContent ?? '')
    : clubContent

  return (
    <S.Backdrop>
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
        <S.Header>
          <S.Title>{month}월 {weekNumber}주차 학습일지</S.Title>
          {readOnly && study?.authorName && (
            <S.Author>{study.authorName}</S.Author>
          )}
        </S.Header>
        <S.Column>
          <S.Div>
            <S.Label>
              제목 {!readOnly && <S.Required>*</S.Required>}
            </S.Label>
            <S.Input
              type="text"
              placeholder="제목을 입력해주세요."
              value={displayedTitle}
              onChange={(e) => setTitle(e.target.value)}
              readOnly={readOnly}
            />
          </S.Div>
          <S.LetterCount>{displayedTitle.length}/50</S.LetterCount>
        </S.Column>
        <S.Column>
          <S.Div>
            <S.Label>
              개인 학습 {!readOnly && <S.Required>*</S.Required>}
            </S.Label>
            <S.LearningInput
              placeholder="내용을 입력해주세요."
              value={displayedOwnContent}
              onChange={(e) => setOwnContent(e.target.value)}
              readOnly={readOnly}
            />
          </S.Div>
          <S.LetterCount>{displayedOwnContent.length}/1000</S.LetterCount>
        </S.Column>
        <S.Column>
          <S.Div>
            <S.Label>
              동아리 학습 {!readOnly && <S.Required>*</S.Required>}
            </S.Label>
            <S.LearningInput
              placeholder="내용을 입력해주세요."
              value={displayedClubContent}
              onChange={(e) => setClubContent(e.target.value)}
              readOnly={readOnly}
            />
          </S.Div>
          <S.LetterCount>{displayedClubContent.length}/1000</S.LetterCount>
        </S.Column>
        <S.ButtonContainer>
          {!readOnly && study && (
            <S.DeleteButton
              type="button"
              aria-label="학습일지 삭제"
              title="삭제"
              disabled={isSubmitting}
              onClick={handleDelete}
            >
              <PiTrash aria-hidden="true" />
            </S.DeleteButton>
          )}
          <S.CancelButton type="button" onClick={onClose}>
            {readOnly ? '닫기' : '취소'}
          </S.CancelButton>
          {!readOnly && (
            <S.SubmitButton
              type="button"
              disabled={isSubmitting}
              onClick={handleSubmit}
            >
              제출
            </S.SubmitButton>
          )}
        </S.ButtonContainer>
      </S.Modal>
    </S.Backdrop>
  )
}

export function WriteModal(props: WriteModalProps) {
  if (!props.isOpen) return null

  return <WriteModalContent {...props} />
}
