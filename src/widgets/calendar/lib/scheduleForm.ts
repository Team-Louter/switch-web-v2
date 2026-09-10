import type { Schedule } from '@/shared/types/schedule'
import { formatDateInput } from '@/shared/utils/date'

import type { ScheduleFormValues } from '../model/types'

/** 누른 날짜를 시작일/종료일에 채운 초기값을 만듭니다. */
export function getCreateFormValues(
  startDate: Date,
  endDate: Date = startDate,
): ScheduleFormValues {

  return {
    title: '',
    content: '',
    startDate: formatDateInput(startDate),
    endDate: formatDateInput(endDate),
    color: 'PINK',
    userIds: [],
  }
}

export function getEditFormValues(schedule: Schedule): ScheduleFormValues {
  return {
    title: schedule.title,
    content: schedule.content,
    startDate: formatDateInput(schedule.startDate),
    endDate: formatDateInput(schedule.endDate),
    color: schedule.color,
    userIds: schedule.users.map(({ userId }) => userId),
  }
}
