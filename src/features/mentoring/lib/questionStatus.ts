import * as token from '@/shared/styles/values/token'
import type { QuestionStatus } from '@/entities/mentoring'

/** 질문 상태별 화면 표기 */
export const QUESTION_STATUS_LABEL: Record<QuestionStatus, string> = {
  PAUSED: '대기',
  ACTIVE: '진행',
  DONE: '종료',
}

/** 질문 상태별 색상 */
export const QUESTION_STATUS_COLOR: Record<QuestionStatus, string> = {
  PAUSED: token.colors.warning.warning20,
  ACTIVE: token.colors.info.info20,
  DONE: token.colors.gray.gray50,
}

/**
 * 멘토링 화면에서 쓰는 "2026. 7. 16. 12:02" 형식으로 날짜를 변환한다.
 *
 * @param isoDate ISO 형식 날짜 문자열
 */
export const formatQuestionDate = (isoDate: string): string => {
  if (!isoDate) return ''

  const date = new Date(isoDate)

  if (Number.isNaN(date.getTime())) return ''

  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date)
}
