import { useMemo, useState } from 'react'

import { addMonths, formatYearMonth, getMonthWeeks, startOfMonth } from '@/shared/utils/date'

export function useMonthCalendar(initialDate: Date = new Date()) {
  const [currentMonth, setCurrentMonth] = useState(() => startOfMonth(initialDate)) // 현재 조회 중인 월의 1일

  const weeks = useMemo(() => getMonthWeeks(currentMonth), [currentMonth])
  const monthLabel = useMemo(() => formatYearMonth(currentMonth), [currentMonth])

  const handlePreviousMonthClick = () => {
    setCurrentMonth((previousMonth) => addMonths(previousMonth, -1))
  }

  const handleNextMonthClick = () => {
    setCurrentMonth((previousMonth) => addMonths(previousMonth, 1))
  }

  return {
    currentMonth,
    monthLabel,
    weeks,
    handlePreviousMonthClick,
    handleNextMonthClick,
  }
}
