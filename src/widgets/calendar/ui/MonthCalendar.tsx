import chevronIcon from '@/shared/assets/calendar/chevron.svg'
import { WEEKDAY_LABELS } from '@/shared/constants/calendar'
import type { Schedule } from '@/shared/types/schedule'

import { getDayTone } from '../lib/dayTone'
import { useMonthCalendar } from '../model/useMonthCalendar'

import {
  CalendarBody,
  CalendarCard,
  CalendarHeader,
  MonthNav,
  MonthNavButton,
  MonthNavIcon,
  MonthTitle,
  WeekList,
  WeekdayLabel,
  WeekdayRow,
} from './MonthCalendar.style'
import { CalendarWeek } from './CalendarWeek'

type MonthCalendarProps = {
  schedules: Schedule[]
  onDateSelect: (date: Date) => void
  onScheduleSelect: (schedule: Schedule) => void
  initialDate?: Date
}

export function MonthCalendar({
  schedules,
  onDateSelect,
  onScheduleSelect,
  initialDate,
}: MonthCalendarProps) {
  const {
    currentMonth,
    monthLabel,
    weeks,
    handlePreviousMonthClick,
    handleNextMonthClick,
  } = useMonthCalendar(initialDate)

  return (
    <CalendarCard aria-label={`${monthLabel} 캘린더`}>
      <CalendarHeader>
        <MonthTitle>{monthLabel}</MonthTitle>
        <MonthNav>
          <MonthNavButton
            type="button"
            aria-label="이전 달 보기"
            onClick={handlePreviousMonthClick}
          >
            <MonthNavIcon src={chevronIcon} alt="" $flipped />
          </MonthNavButton>
          <MonthNavButton
            type="button"
            aria-label="다음 달 보기"
            onClick={handleNextMonthClick}
          >
            <MonthNavIcon src={chevronIcon} alt="" />
          </MonthNavButton>
        </MonthNav>
      </CalendarHeader>

      <CalendarBody>
        <WeekdayRow>
          {WEEKDAY_LABELS.map((label, dayIndex) => (
            <WeekdayLabel key={label} $tone={getDayTone(dayIndex)}>
              {label}
            </WeekdayLabel>
          ))}
        </WeekdayRow>

        <WeekList>
          {weeks.map((weekDates) => (
            <CalendarWeek
              key={weekDates[0].getTime()}
              weekDates={weekDates}
              currentMonth={currentMonth}
              schedules={schedules}
              onDateSelect={onDateSelect}
              onScheduleSelect={onScheduleSelect}
            />
          ))}
        </WeekList>
      </CalendarBody>
    </CalendarCard>
  )
}
