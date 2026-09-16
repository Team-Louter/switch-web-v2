import type { Schedule } from '@/entities/schedule'
import { getDateKeysInRange, toDateKeyFromServer } from '@/shared/lib/calendar'

import type { CalendarEvent } from '../ui/MonthlyCalendar'
import { getScheduleColor } from './scheduleColor'

/**
 * 일정 목록을 달력 칸에 그릴 수 있도록 날짜 키별로 나눈다.
 *
 * 여러 날에 걸친 일정은 기간에 포함된 날짜마다 하나씩 들어간다.
 */
export function groupSchedulesByDate(schedules: Schedule[]) {
  const eventsByDate: Record<string, CalendarEvent[]> = {}

  schedules.forEach(({ scheduleId, title, startDate, endDate, color }) => {
    getDateKeysInRange(startDate, endDate).forEach((dateKey) => {
      const event: CalendarEvent = {
        id: `${scheduleId}-${dateKey}`,
        title,
        color: getScheduleColor(color),
      }

      eventsByDate[dateKey] = [...(eventsByDate[dateKey] ?? []), event]
    })
  })

  return eventsByDate
}

/**
 * 아직 끝나지 않은 일정을 시작일이 빠른 순으로 정렬해 limit개 반환한다.
 */
export function getUpcomingSchedules(
  schedules: Schedule[],
  todayDateKey: string,
  limit: number,
) {
  return schedules
    .filter(({ endDate }) => toDateKeyFromServer(endDate) >= todayDateKey)
    .sort((a, b) => a.startDate.localeCompare(b.startDate))
    .slice(0, limit)
}
