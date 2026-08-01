import { useState } from 'react'
import { PiCaretLeft, PiCaretRight } from 'react-icons/pi'

import { createStudy } from '../../api/createStudy'
import type { StudyRecord } from '../../model/types'
import * as S from './WriteModal.style'

interface WriteModalProps {
  isOpen: boolean
  onClose: () => void
  study?: StudyRecord
  readOnly?: boolean
  onPrevious?: () => void
  onNext?: () => void
}

const handleSubmit = async (month: number, weekNumber: number, title: string, ownContent: string, clubContent: string) => {
  try {
    await createStudy({ month, weekNumber, title, ownContent, clubContent });
    console.log('Study created successfully');
  } catch (e) {
    console.error('Error creating study:', e);
  }
};

export function WriteModal({
  isOpen,
  onClose,
  study,
  readOnly = false,
  onPrevious,
  onNext,
}: WriteModalProps) {
  const month = new Date().getMonth() + 1;
  const weekNumber = Math.ceil(new Date().getDate() / 7);
  const [title, setTitle] = useState('');
  const [ownContent, setOwnContent] = useState('');
  const [clubContent, setClubContent] = useState('');

  if (!isOpen) return null

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
          <S.Title>6월 1주차 학습일지</S.Title>
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
          <S.CancelButton type="button" onClick={onClose}>
            {readOnly ? '닫기' : '취소'}
          </S.CancelButton>
          {!readOnly && (
            <S.SubmitButton
              type="submit"
              onClick={() =>
                handleSubmit(month, weekNumber, title, ownContent, clubContent)
              }
            >
              제출
            </S.SubmitButton>
          )}
        </S.ButtonContainer>
      </S.Modal>
    </S.Backdrop>
  )
}
