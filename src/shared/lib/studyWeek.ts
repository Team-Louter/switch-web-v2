export const KOREA_TIME_ZONE = 'Asia/Seoul'
const SATURDAY = 6

export interface CalendarDate {
  year: number
  month: number
  day: number
}

function getMonthStartOffset(year: number, month: number) {
  const firstDay = new Date(Date.UTC(year, month - 1, 1)).getUTCDay()

  return (firstDay - SATURDAY + 7) % 7
}

export function getMonthWeekCount(year: number, month: number) {
  const startOffset = getMonthStartOffset(year, month)
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate()

  return Math.ceil((startOffset + daysInMonth) / 7)
}

export function getMonthWeekNumber(
  year: number,
  month: number,
  day: number,
) {
  return Math.ceil((getMonthStartOffset(year, month) + day) / 7)
}

export function getCurrentKoreaDate(): CalendarDate {
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
