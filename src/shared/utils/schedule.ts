/**
 * 일정 변환 유틸
 *
 * 서버 응답(ScheduleResponse)과 화면 모델(Schedule), 요청 본문 사이의 변환을 담당합니다.
 */
import type { Schedule, ScheduleResponse } from '@/shared/types/schedule'
import { toDateKeyFromServer } from '@/shared/lib/calendar'
import { formatDateInput } from '@/shared/utils/date'

const scheduleDateFormatter = new Intl.DateTimeFormat('en-US', {
  timeZone: 'Asia/Seoul',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
})

export function toScheduleDateKey(value: string) {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value
  }

  // 일정 API는 시간대 표기 없이 UTC 시각을 반환한다.
  const timestamp = /(?:Z|[+-]\d{2}:?\d{2})$/i.test(value) ? value : `${value}Z`
  const date = new Date(timestamp)

  if (Number.isNaN(date.getTime())) {
    return toDateKeyFromServer(value)
  }

  const parts = scheduleDateFormatter.formatToParts(date)
  const { year, month, day } = Object.fromEntries(parts.map(({ type, value }) => [type, value]))

  return `${year}-${month}-${day}`
}

export function toSchedule(response: ScheduleResponse): Schedule {
  return {
    scheduleId: response.scheduleId,
    title: response.title,
    content: response.content ?? '',
    startDate: new Date(response.startDate),
    endDate: new Date(response.endDate),
    color: response.color,
    users: response.users ?? [],
  }
}

export function toSchedules(responses: ScheduleResponse[]): Schedule[] {
  return responses.map(toSchedule)
}

export function toStartDateTime(value: string) {
  return `${value}T00:00:00`
}

export function toEndDateTime(value: string) {
  return `${value}T23:59:59`
}

/** 일정 기간을 "2026-07-01부터 2026-07-03까지" 형태로 표시합니다. */
export function formatSchedulePeriod(schedule: Schedule) {
  return `${formatDateInput(schedule.startDate)}부터 ${formatDateInput(schedule.endDate)}까지`
}
