import * as S from './WriteModal.style.ts'

interface WriteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WriteModal({ isOpen, onClose }: WriteModalProps) {
  if (!isOpen) return null

  return (
    <S.Backdrop>
      <S.Modal>
        <S.Title>6월 1주차 학습일지</S.Title>
        <S.Column>
          <S.Div>
            <S.Label>제목 <S.Required>*</S.Required></S.Label>
            <S.Input type="text" placeholder="제목을 입력해주세요." />
          </S.Div>
          <S.LetterCount>0/50</S.LetterCount>
        </S.Column>
        <S.Column>
          <S.Div>
            <S.Label>개인 학습 <S.Required>*</S.Required></S.Label>
            <S.LearningInput placeholder="내용을 입력해주세요." />
          </S.Div>
          <S.LetterCount>0/1000</S.LetterCount>
        </S.Column>
        <S.Column>
          <S.Div>
            <S.Label>동아리 학습 <S.Required>*</S.Required></S.Label>
            <S.LearningInput placeholder="내용을 입력해주세요." />
          </S.Div>
          <S.LetterCount>0/1000</S.LetterCount>
        </S.Column>
        <S.ButtonContainer>
          <S.CancelButton type="button" onClick={onClose}>취소</S.CancelButton>
          <S.SubmitButton type="submit">제출</S.SubmitButton>
        </S.ButtonContainer>
      </S.Modal>
    </S.Backdrop>
  )
}
