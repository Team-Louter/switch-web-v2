import type { Schedule } from '@/shared/types/schedule'
import { formatDateInput, isSameMonth } from '@/shared/utils/date'

import { getDayTone } from '../lib/dayTone'
import { getWeekScheduleSegments } from '../lib/scheduleLayout'

import { DayCell, DayNumber, WeekRow } from './MonthCalendar.style'
import { ScheduleChip } from './ScheduleChip'

type CalendarWeekProps = {
  weekDates: Date[]
  currentMonth: Date
  schedules: Schedule[]
  onDateSelect: (date: Date) => void
  onScheduleSelect: (schedule: Schedule) => void
}

export function CalendarWeek({
  weekDates,
  currentMonth,
  schedules,
  onDateSelect,
  onScheduleSelect,
}: CalendarWeekProps) {
  const segments = getWeekScheduleSegments(weekDates, schedules)

  return (
    <WeekRow>
      {weekDates.map((date) => (
        <DayCell
          key={date.getTime()}
          type="button"
          aria-label={`${formatDateInput(date)} 일정 추가`}
          onClick={() => onDateSelect(date)}
        >
          <DayNumber
            $tone={getDayTone(date.getDay())}
            $outsideMonth={!isSameMonth(date, currentMonth)}
          >
            {date.getDate()}
          </DayNumber>
        </DayCell>
      ))}

      {segments.map((segment) => (
        <ScheduleChip
          key={segment.key}
          segment={segment}
          onSelect={onScheduleSelect}
        />
      ))}
    </WeekRow>
  )
}
