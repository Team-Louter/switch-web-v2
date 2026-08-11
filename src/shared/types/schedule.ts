/**
 * 일정(schedule) 타입
 *
 * 서버 문서(docs/server-docs.json)의 schedule-controller 스키마를 기준으로 정의합니다.
 * - ScheduleResponse : 서버 응답 원본(날짜가 ISO 문자열)
 * - Schedule         : 화면에서 사용하는 모델(날짜가 Date 객체)
 */

export const SCHEDULE_COLORS = [
  'LIGHTGREY',
  'PINK',
  'GOLD',
  'LIGHTGREEN',
  'LIGHTBLUE',
] as const

export type ScheduleColor = (typeof SCHEDULE_COLORS)[number]

export type ScheduleTarget = 'ALL' | 'GENERATION' | 'PERSONAL'

export type ScheduleUserResponse = {
  userId: number
  userEmail: string
  userName: string
}

export type ScheduleResponse = {
  scheduleId: number
  title: string
  content?: string
  startDate: string // ISO date-time
  endDate: string // ISO date-time
  color: ScheduleColor
  users?: ScheduleUserResponse[]
}

export type Schedule = {
  scheduleId: number
  title: string
  content: string
  startDate: Date
  endDate: Date
  color: ScheduleColor
  users: ScheduleUserResponse[]
}

export type CreateScheduleRequest = {
  title: string
  content?: string
  startDate: string // ISO date-time
  endDate: string // ISO date-time
  color: ScheduleColor
  scheduleTarget: ScheduleTarget
  generations?: number[]
  userIds?: number[]
}

export type UpdateScheduleRequest = CreateScheduleRequest
