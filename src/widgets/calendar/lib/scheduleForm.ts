import type { Schedule } from '@/shared/types/schedule'
import { formatDateInput } from '@/shared/utils/date'

import type { ScheduleFormValues } from '../model/types'

/** 누른 날짜를 시작일/종료일에 채운 초기값을 만듭니다. */
export function getCreateFormValues(date: Date): ScheduleFormValues {
  const dateValue = formatDateInput(date)

  return {
    title: '',
    content: '',
    startDate: dateValue,
    endDate: dateValue,
    color: 'PINK',
    userId: null,
  }
}

export function getEditFormValues(schedule: Schedule): ScheduleFormValues {
  return {
    title: schedule.title,
    content: schedule.content,
    startDate: formatDateInput(schedule.startDate),
    endDate: formatDateInput(schedule.endDate),
    color: schedule.color,
    userId: schedule.users[0]?.userId ?? null,
  }
}
