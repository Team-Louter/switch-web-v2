import * as token from '@/shared/styles/values/token'
import type { QuestionStatus } from '@/entities/mentoring'

/** 질문 상태별 화면 표기 */
export const QUESTION_STATUS_LABEL: Record<QuestionStatus, string> = {
  PAUSED: '답변 대기',
  ACTIVE: '답변 중',
  DONE: '답변 완료',
}

/** 질문 상태별 색상 */
export const QUESTION_STATUS_COLOR: Record<QuestionStatus, string> = {
  PAUSED: token.colors.warning.warning20,
  ACTIVE: token.colors.info.info20,
  DONE: token.colors.gray.gray50,
}

const parseQuestionDate = (isoDate: string): Date | null => {
  if (!isoDate) return null

  const date = new Date(isoDate)

  return Number.isNaN(date.getTime()) ? null : date
}

/**
 * v1 멘토링 화면과 같은 "07.16. 오후 12:02" 형식으로 날짜를 변환한다.
 *
 * @param isoDate ISO 형식 날짜 문자열
 */
export const formatQuestionDate = (isoDate: string): string => {
  const date = parseQuestionDate(isoDate)

  if (!date) return ''

  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = date.getHours()
  const period = hours >= 12 ? '오후' : '오전'
  const hour = hours % 12 || 12
  const minutes = String(date.getMinutes()).padStart(2, '0')

  return `${month}.${day}. ${period} ${hour}:${minutes}`
}

/**
 * 질문 상세의 작성일을 설명형 날짜로 변환한다.
 *
 * @param isoDate ISO 형식 날짜 문자열
 */
export const formatQuestionCreatedAt = (isoDate: string): string => {
  const date = parseQuestionDate(isoDate)

  if (!date) return ''

  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hours = date.getHours()
  const period = hours >= 12 ? '오후' : '오전'
  const hour = hours % 12 || 12
  const minutes = String(date.getMinutes()).padStart(2, '0')

  return `작성일: ${year}년 ${month}월 ${day}일 ${period} ${hour}:${minutes}`
}
