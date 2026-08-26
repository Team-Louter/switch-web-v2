import { SATURDAY_INDEX, SUNDAY_INDEX } from '@/shared/constants/calendar'

export type DayTone = 'sunday' | 'saturday' | 'weekday'

export function getDayTone(dayIndex: number): DayTone {
  if (dayIndex === SUNDAY_INDEX) {
    return 'sunday'
  }

  if (dayIndex === SATURDAY_INDEX) {
    return 'saturday'
  }

  return 'weekday'
}
