/**
 * 날짜 유틸
 *
 * 캘린더처럼 "일(day)" 단위로 날짜를 비교/계산할 때 사용합니다.
 * 시/분/초를 제거한 로컬 기준 Date를 다룹니다.
 */
import { DAYS_IN_WEEK } from '@/shared/constants/calendar'

const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24

export function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

export function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

export function addDays(date: Date, days: number) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days)
}

/** 이동한 달의 1일을 반환합니다. */
export function addMonths(date: Date, months: number) {
  return new Date(date.getFullYear(), date.getMonth() + months, 1)
}

export function isSameDay(a: Date, b: Date) {
  return startOfDay(a).getTime() === startOfDay(b).getTime()
}

export function isSameMonth(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth()
}

/** from에서 to까지의 일수 차이를 반환합니다. (to가 뒤면 양수) */
export function getDayDiff(from: Date, to: Date) {
  return Math.round(
    (startOfDay(to).getTime() - startOfDay(from).getTime()) /
      MILLISECONDS_PER_DAY,
  )
}

/**
 * 해당 월을 감싸는 주(일요일 시작) 목록을 반환합니다.
 *
 * 첫 주의 이전 달 날짜, 마지막 주의 다음 달 날짜까지 포함합니다.
 */
export function getMonthWeeks(date: Date) {
  const firstDayOfMonth = startOfMonth(date)
  const lastDayOfMonth = new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0,
  )
  const gridStartDate = addDays(firstDayOfMonth, -firstDayOfMonth.getDay())
  const gridEndDate = addDays(
    lastDayOfMonth,
    DAYS_IN_WEEK - 1 - lastDayOfMonth.getDay(),
  )
  const weekCount = (getDayDiff(gridStartDate, gridEndDate) + 1) / DAYS_IN_WEEK

  return Array.from({ length: weekCount }, (_, weekIndex) =>
    Array.from({ length: DAYS_IN_WEEK }, (_, dayIndex) =>
      addDays(gridStartDate, weekIndex * DAYS_IN_WEEK + dayIndex),
    ),
  )
}

export function formatYearMonth(date: Date) {
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월`
}

/** Date를 date input 값("2026-07-01")으로 변환합니다. */
export function formatDateInput(date: Date) {
  const month = `${date.getMonth() + 1}`.padStart(2, '0')
  const day = `${date.getDate()}`.padStart(2, '0')

  return `${date.getFullYear()}-${month}-${day}`
}

/** date input 값("2026-07-01")을 로컬 기준 Date로 변환합니다. */
export function parseDateInput(value: string) {
  const [year, month, day] = value.split('-').map(Number)

  return new Date(year, month - 1, day)
}
