import { useMemo } from 'react'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'

import { getMonthCalendarWeeks } from '@/shared/lib/calendar'

import * as S from './MonthlyCalendar.style'

const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MAX_VISIBLE_EVENTS = 3 // 한 칸에 보여주는 일정 최대 개수

export interface CalendarEvent {
  id: number | string
  title: string
  color: string
}

interface MonthlyCalendarProps {
  year: number
  month: number
  todayDateKey: string
  eventsByDate: Record<string, CalendarEvent[]> // 날짜 키(YYYY-MM-DD)별 일정
  onPrevMonthClick: () => void
  onNextMonthClick: () => void
  onMoreEventsClick: (dateKey: string) => void
}

export function MonthlyCalendar({
  year,
  month,
  todayDateKey,
  eventsByDate,
  onPrevMonthClick,
  onNextMonthClick,
  onMoreEventsClick,
}: MonthlyCalendarProps) {
  const weeks = useMemo(
    () => getMonthCalendarWeeks(year, month),
    [year, month],
  )

  return (
    <S.Card>
      <S.Header>
        <S.MonthTitle>
          <S.Month>{month}월</S.Month>
          <S.Year>{year}</S.Year>
        </S.MonthTitle>
        <S.Nav>
          <S.NavButton
            type="button"
            aria-label="이전 달"
            onClick={onPrevMonthClick}
          >
            <FaChevronLeft aria-hidden="true" />
          </S.NavButton>
          <S.NavButton
            type="button"
            aria-label="다음 달"
            onClick={onNextMonthClick}
          >
            <FaChevronRight aria-hidden="true" />
          </S.NavButton>
        </S.Nav>
      </S.Header>
      <S.Grid>
        <S.WeekdayRow>
          {WEEKDAY_LABELS.map((label) => (
            <S.Weekday key={label}>{label}</S.Weekday>
          ))}
        </S.WeekdayRow>
        {weeks.map((week) => (
          <S.Week key={week[0].dateKey}>
            {week.map(({ dateKey, day, isCurrentMonth }) => {
              const events = eventsByDate[dateKey] ?? []
              const visibleEvents = events.slice(0, MAX_VISIBLE_EVENTS)

              return (
                <S.DayCell key={dateKey}>
                  <S.DateBadge
                    $isCurrentMonth={isCurrentMonth}
                    $isToday={dateKey === todayDateKey}
                  >
                    {day}
                  </S.DateBadge>
                  {visibleEvents.map(({ id, title, color }) => (
                    <S.EventChip key={id} $color={color} title={title}>
                      {title}
                    </S.EventChip>
                  ))}
                  {/* 최대 개수를 넘는 일정이 있으면 더보기를 노출한다. */}
                  {events.length > MAX_VISIBLE_EVENTS && (
                    <S.MoreEventsButton
                      type="button"
                      onClick={() => onMoreEventsClick(dateKey)}
                    >
                      view more
                    </S.MoreEventsButton>
                  )}
                </S.DayCell>
              )
            })}
          </S.Week>
        ))}
      </S.Grid>
    </S.Card>
  )
}
