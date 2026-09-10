import type { ScheduleColor } from '@/shared/types/schedule'

export type ScheduleFormValues = {
  title: string
  content: string
  startDate: string // date input 값 ("2026-07-01")
  endDate: string // date input 값 ("2026-07-03")
  color: ScheduleColor
  userIds: number[]
}
