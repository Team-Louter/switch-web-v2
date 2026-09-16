import completionImage from '../../assets/typing-completion.png'

import * as S from './TypingCompletionModal.style'

interface TypingCompletionModalProps {
  accuracy: number
  category: string
  errorCount: number
  time: string
  typingSpeed: number
  onClose: () => void
}

const RESULT_ITEMS = [
  { key: 'category', label: '카테고리' },
  { key: 'time', label: '시간' },
  { key: 'typingSpeed', label: '타수' },
  { key: 'accuracy', label: '정확도' },
  { key: 'errorCount', label: '오타수' },
] as const

export function TypingCompletionModal({ accuracy, category, errorCount, time, typingSpeed, onClose }: TypingCompletionModalProps) {
  const result = {
    category,
    time,
    typingSpeed: `${typingSpeed}타`,
    accuracy: `${accuracy}%`,
    errorCount: `${errorCount}개`,
  }

  return (
    <S.Overlay>
      <S.Dialog role="dialog" aria-modal="true" aria-labelledby="typing-completion-title">
        <S.CompletionImage src={completionImage} alt="" />
        <S.Title id="typing-completion-title">타자 연습을 완료했어요!</S.Title>
        <S.Description>내일도, 모레도 한 번 꾸준히 연습해봐요!</S.Description>

        <S.ResultList>
          {RESULT_ITEMS.map(item => (
            <S.ResultItem key={item.key}>
              <S.ResultLabel>{item.label}</S.ResultLabel>
              <S.ResultValue>{result[item.key]}</S.ResultValue>
            </S.ResultItem>
          ))}
        </S.ResultList>

        <S.CloseButton onClick={onClose}>돌아가기</S.CloseButton>
      </S.Dialog>
    </S.Overlay>
  )
}
