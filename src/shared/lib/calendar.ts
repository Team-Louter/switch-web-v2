const DAYS_IN_WEEK = 7
const DAY_IN_MS = 24 * 60 * 60 * 1000

export interface CalendarCell {
  dateKey: string // YYYY-MM-DD
  day: number // 일(1~31)
  isCurrentMonth: boolean // 달력에 표시된 달에 속하는 날짜인지 여부
}

/**
 * 연 / 월 / 일 값을 YYYY-MM-DD 형식 문자열로 만든다.
 */
export function toDateKey(year: number, month: number, day: number) {
  const paddedMonth = String(month).padStart(2, '0')
  const paddedDay = String(day).padStart(2, '0')

  return `${year}-${paddedMonth}-${paddedDay}`
}

/**
 * 서버 날짜 문자열(2026-07-01T09:00:00)을 YYYY-MM-DD로 자른다.
 *
 * 문자열을 그대로 자르기 때문에 Date 변환으로 생기는 시간대 밀림이 없다.
 */
export function toDateKeyFromServer(value: string) {
  const matched = /^(\d{4})-(\d{2})-(\d{2})/.exec(value)

  if (matched) {
    return `${matched[1]}-${matched[2]}-${matched[3]}`
  }

  const date = new Date(value)

  return toDateKey(date.getFullYear(), date.getMonth() + 1, date.getDate())
}

/**
 * 날짜 키(YYYY-MM-DD)를 UTC 기준 Date로 만든다.
 */
function fromDateKey(dateKey: string) {
  const [year, month, day] = dateKey.split('-').map(Number)

  return new Date(Date.UTC(year, month - 1, day))
}

/**
 * 시작일부터 종료일까지의 날짜 키를 모두 반환한다.
 *
 * 여러 날에 걸친 일정을 날짜별로 나눠 표시할 때 사용한다.
 */
export function getDateKeysInRange(startDate: string, endDate: string) {
  const startKey = toDateKeyFromServer(startDate)
  const endKey = toDateKeyFromServer(endDate)
  const start = fromDateKey(startKey)
  const end = fromDateKey(endKey)

  if (end.getTime() < start.getTime()) {
    return [startKey]
  }

  const dateKeys: string[] = []

  for (
    let time = start.getTime();
    time <= end.getTime();
    time += DAY_IN_MS
  ) {
    const date = new Date(time)

    dateKeys.push(
      toDateKey(
        date.getUTCFullYear(),
        date.getUTCMonth() + 1,
        date.getUTCDate(),
      ),
    )
  }

  return dateKeys
}

/**
 * 해당 월의 달력 그리드를 주 단위 배열로 만든다.
 *
 * 첫 주와 마지막 주는 이전 / 다음 달 날짜로 채워 항상 7칸을 유지한다.
 */
export function getMonthCalendarWeeks(year: number, month: number) {
  const firstDate = new Date(Date.UTC(year, month - 1, 1))
  const startOffset = firstDate.getUTCDay()
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate()
  const weekCount = Math.ceil((startOffset + daysInMonth) / DAYS_IN_WEEK)
  const weeks: CalendarCell[][] = []

  for (let weekIndex = 0; weekIndex < weekCount; weekIndex += 1) {
    const week: CalendarCell[] = []

    for (let dayIndex = 0; dayIndex < DAYS_IN_WEEK; dayIndex += 1) {
      const dayOffset = weekIndex * DAYS_IN_WEEK + dayIndex - startOffset
      const date = new Date(Date.UTC(year, month - 1, 1 + dayOffset))
      const cellYear = date.getUTCFullYear()
      const cellMonth = date.getUTCMonth() + 1
      const cellDay = date.getUTCDate()

      week.push({
        dateKey: toDateKey(cellYear, cellMonth, cellDay),
        day: cellDay,
        isCurrentMonth: cellYear === year && cellMonth === month,
      })
    }

    weeks.push(week)
  }

  return weeks
}

/**
 * 이전 달 / 다음 달의 연, 월을 계산한다.
 */
export function getShiftedMonth(year: number, month: number, amount: number) {
  const shifted = new Date(Date.UTC(year, month - 1 + amount, 1))

  return {
    year: shifted.getUTCFullYear(),
    month: shifted.getUTCMonth() + 1,
  }
}

/**
 * 서버 날짜 문자열을 MM.DD 형식으로 포맷한다.
 */
export function formatMonthDay(value: string) {
  const [, month, day] = toDateKeyFromServer(value).split('-')

  return `${month}.${day}`
}
