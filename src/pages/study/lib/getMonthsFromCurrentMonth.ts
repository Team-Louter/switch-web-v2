const KOREA_TIME_ZONE = 'Asia/Seoul'

export type MonthState = 'past' | 'current' | 'future'

export function getCurrentMonth(): number {
  return Number(
    new Intl.DateTimeFormat('en-US', {
      timeZone: KOREA_TIME_ZONE,
      month: 'numeric',
    }).format(new Date()),
  )
}

export function getMonthsFromCurrentMonth(): number[] {
  const currentMonth = getCurrentMonth()

  return Array.from(
    { length: 12 },
    (_, index) => ((currentMonth - 1 + index) % 12) + 1,
  )
}

export function getMonthState(
  month: number,
  currentMonth = getCurrentMonth(),
): MonthState {
  if (month === currentMonth) return 'current'

  return month < currentMonth ? 'past' : 'future'
}
