import {
  getCurrentKoreaDate,
  getMonthWeekCount,
  getMonthWeekNumber,
} from '@/shared/lib/studyWeek'

const MONTHS_IN_YEAR = 12

export type WeekState = 'past' | 'current' | 'future'

export interface StudyWeek {
  id: string
  year: number
  month: number
  weekNumber: number
  state: WeekState
}

export function getWeeksForCurrentYear(): StudyWeek[] {
  const currentDate = getCurrentKoreaDate()
  const currentWeekNumber = getMonthWeekNumber(
    currentDate.year,
    currentDate.month,
    currentDate.day,
  )

  const weeks: StudyWeek[] = Array.from(
    { length: MONTHS_IN_YEAR },
    (_, index) => index + 1,
  ).flatMap((month) =>
    Array.from(
      { length: getMonthWeekCount(currentDate.year, month) },
      (_, index) => {
        const weekNumber = index + 1
        const isPast =
          month < currentDate.month ||
          (month === currentDate.month && weekNumber < currentWeekNumber)
        const isCurrent =
          month === currentDate.month && weekNumber === currentWeekNumber

        return {
          id: `${currentDate.year}-${month}-${weekNumber}`,
          year: currentDate.year,
          month,
          weekNumber,
          state: isPast ? 'past' : isCurrent ? 'current' : 'future',
        }
      },
    ),
  )
  const currentWeekIndex = weeks.findIndex(
    ({ month, weekNumber }) =>
      month === currentDate.month && weekNumber === currentWeekNumber,
  )

  return [
    ...weeks.slice(currentWeekIndex),
    ...weeks.slice(0, currentWeekIndex),
  ]
}
