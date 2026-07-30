import { useState } from 'react';
import { createStudy } from '../api/createStudy';
import * as S from './WriteModal.style.ts'

interface WriteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const handleSubmit = async (month: number, weekNumber: number, title: string, ownContent: string, clubContent: string) => {
  try {
    await createStudy({ month, weekNumber, title, ownContent, clubContent });
    console.log('Study created successfully');
  } catch (e) {
    console.error('Error creating study:', e);
  }
}

export function WriteModal({ isOpen, onClose }: WriteModalProps) {
  const month = new Date().getMonth() + 1;
  const weekNumber = Math.ceil(new Date().getDate() / 7);
  const [title, setTitle] = useState('');
  const [ownContent, setOwnContent] = useState('');
  const [clubContent, setClubContent] = useState('');

  if (!isOpen) return null

  return (
    <S.Backdrop>
      <S.Modal>
        <S.Title>6월 1주차 학습일지</S.Title>
        <S.Column>
          <S.Div>
            <S.Label>제목 <S.Required>*</S.Required></S.Label>
            <S.Input
              type="text"
              placeholder="제목을 입력해주세요."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </S.Div>
          <S.LetterCount>{title.length}/50</S.LetterCount>
        </S.Column>
        <S.Column>
          <S.Div>
            <S.Label>개인 학습 <S.Required>*</S.Required></S.Label>
            <S.LearningInput
              placeholder="내용을 입력해주세요."
              value={ownContent}
              onChange={(e) => setOwnContent(e.target.value)}
            />
          </S.Div>
          <S.LetterCount>{ownContent.length}/1000</S.LetterCount>
        </S.Column>
        <S.Column>
          <S.Div>
            <S.Label>동아리 학습 <S.Required>*</S.Required></S.Label>
            <S.LearningInput
              placeholder="내용을 입력해주세요."
              value={clubContent}
              onChange={(e) => setClubContent(e.target.value)}
            />
          </S.Div>
          <S.LetterCount>{clubContent.length}/1000</S.LetterCount>
        </S.Column>
        <S.ButtonContainer>
          <S.CancelButton type="button" onClick={onClose}>취소</S.CancelButton>
          <S.SubmitButton type="submit" onClick={() => handleSubmit(month, weekNumber, title, ownContent, clubContent)}>제출</S.SubmitButton>
        </S.ButtonContainer>
      </S.Modal>
    </S.Backdrop>
  )
}
