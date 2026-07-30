const KOREA_TIME_ZONE = 'Asia/Seoul'
const MONTHS_IN_YEAR = 12
const WEEKS_IN_MONTH = 5

export type WeekState = 'past' | 'current' | 'future'

export interface StudyWeek {
  id: string
  year: number
  month: number
  weekNumber: number
  state: WeekState
}

interface CalendarDate {
  year: number
  month: number
  day: number
}

function getCurrentKoreaDate(): CalendarDate {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: KOREA_TIME_ZONE,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  }).formatToParts(new Date())

  const getPart = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((part) => part.type === type)?.value)

  return {
    year: getPart('year'),
    month: getPart('month'),
    day: getPart('day'),
  }
}

export function getWeeksForCurrentYear(): StudyWeek[] {
  const currentDate = getCurrentKoreaDate()
  const currentWeekNumber = Math.ceil(currentDate.day / 7)
  const currentWeekIndex =
    (currentDate.month - 1) * WEEKS_IN_MONTH + currentWeekNumber - 1

  const weeks: StudyWeek[] = Array.from(
    { length: MONTHS_IN_YEAR * WEEKS_IN_MONTH },
    (_, index) => {
      const month = Math.floor(index / WEEKS_IN_MONTH) + 1
      const weekNumber = (index % WEEKS_IN_MONTH) + 1
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
  )

  return [
    ...weeks.slice(currentWeekIndex),
    ...weeks.slice(0, currentWeekIndex),
  ]
}
