import type { MentoringQuestion } from '@/entities/mentoring'

import {
  formatQuestionDate,
  QUESTION_STATUS_COLOR,
  QUESTION_STATUS_LABEL,
} from '../../lib/questionStatus'
import * as S from './QuestionCard.style'

interface QuestionCardProps {
  question: MentoringQuestion
  onSelect: (question: MentoringQuestion) => void
}

export function QuestionCard({ question, onSelect }: QuestionCardProps) {
  return (
    <S.Card type="button" onClick={() => onSelect(question)}>
      <S.Status $color={QUESTION_STATUS_COLOR[question.status]}>
        {QUESTION_STATUS_LABEL[question.status]}
      </S.Status>
      <S.Title>{question.title}</S.Title>
      <S.CreatedAt>{formatQuestionDate(question.createdAt)}</S.CreatedAt>
    </S.Card>
  )
}
