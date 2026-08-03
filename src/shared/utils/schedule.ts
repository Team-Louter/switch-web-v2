/**
 * 일정 변환 유틸
 *
 * 서버 응답(ScheduleResponse)과 화면 모델(Schedule), 요청 본문 사이의 변환을 담당합니다.
 */
import type {
  CreateScheduleRequest,
  Schedule,
  ScheduleResponse,
} from '@/shared/types/schedule'
import { formatDateInput, parseDateInput } from '@/shared/utils/date'

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

/**
 * 요청 본문을 화면용 일정 모델로 변환합니다.
 *
 * 서버 연동 전까지 로컬 상태를 갱신하기 위해 사용합니다.
 */
export function toScheduleFromRequest(
  scheduleId: number,
  request: CreateScheduleRequest,
  users: Schedule['users'] = [],
): Schedule {
  return {
    scheduleId,
    title: request.title,
    content: request.content ?? '',
    startDate: parseDateInput(request.startDate.slice(0, 10)),
    endDate: parseDateInput(request.endDate.slice(0, 10)),
    color: request.color,
    users,
  }
}

/** 일정 기간을 "2026-07-01부터 2026-07-03까지" 형태로 표시합니다. */
export function formatSchedulePeriod(schedule: Schedule) {
  return `${formatDateInput(schedule.startDate)}부터 ${formatDateInput(schedule.endDate)}까지`
}
