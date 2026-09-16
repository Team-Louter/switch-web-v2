import { useNavigate } from 'react-router-dom'

import backIcon from '@/shared/assets/typing-back.svg'

import * as S from './TypingPracticeHeader.style'

interface TypingPracticeHeaderProps {
  category: string
  time: string
  typingSpeed: string
  accuracy: string
}

export function TypingPracticeHeader({ category, time, typingSpeed, accuracy }: TypingPracticeHeaderProps) {
  const navigate = useNavigate()

  return (
    <S.Header>
      <S.BackButton type="button" aria-label="타자 연습으로 돌아가기" onClick={() => navigate('/typing')}>
        <img src={backIcon} alt="" />
      </S.BackButton>
      <S.StatsBar>
        <S.Stat>
          <S.Label>카테고리</S.Label>
          <S.Value>{category}</S.Value>
        </S.Stat>
        <S.Stat>
          <S.Label>시간</S.Label>
          <S.Value>{time}</S.Value>
        </S.Stat>
        <S.Stat>
          <S.Label>타수</S.Label>
          <S.Value>{typingSpeed}</S.Value>
        </S.Stat>
        <S.Stat>
          <S.Label>정확도</S.Label>
          <S.Value>{accuracy}</S.Value>
        </S.Stat>
      </S.StatsBar>
    </S.Header>
  )
}
