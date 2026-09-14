import { useCallback, useEffect, useRef, useState } from 'react'
import type { DatesSetArg, EventMountArg } from '@fullcalendar/core'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import koLocale from '@fullcalendar/core/locales/ko'
import { FaFlag } from 'react-icons/fa6'

import type { Schedule, ScheduleColor } from '@/entities/schedule'
import { toDateKey, toDateKeyFromServer } from '@/shared/lib/calendar'

import * as S from './HomeCalendar.style'
import { ScheduleDetailPopover } from './ScheduleDetailPopover'

interface HomeCalendarProps {
  schedules: Schedule[]
  loading: boolean
  selectedScheduleId?: number | null
  onScheduleDetailClose?: () => void
}

interface SelectedSchedule {
  schedule: Schedule
  x: number
  y: number
}

const COLORS: Record<ScheduleColor, string> = {
  GOLD: 'gold', LIGHTGREY: 'lightgrey', PINK: 'pink',
  LIGHTGREEN: 'lightgreen', LIGHTBLUE: 'lightblue',
}

export function HomeCalendar({
  schedules,
  loading,
  selectedScheduleId = null,
  onScheduleDetailClose,
}: HomeCalendarProps) {
  const calendarContainerRef = useRef<HTMLDivElement>(null)
  const eventElementsRef = useRef<Map<string, HTMLElement>>(new Map())
  const autoOpenedScheduleIdRef = useRef<number | null>(null)
  const [selected, setSelected] = useState<SelectedSchedule | null>(null)
  const [visibleDate, setVisibleDate] = useState(() => new Date())
  const events = loading
    ? getLoadingEvents(visibleDate)
    : schedules.map((schedule) => {
      // FullCalendar의 종료일은 exclusive이며 API 종료일은 inclusive이다.
      const end = new Date(`${toDateKeyFromServer(schedule.endDate)}T00:00:00Z`)
      end.setUTCDate(end.getUTCDate() + 1)
      return {
        id: String(schedule.scheduleId), title: schedule.title,
        start: toDateKeyFromServer(schedule.startDate),
        end: toDateKey(end.getUTCFullYear(), end.getUTCMonth() + 1, end.getUTCDate()),
        allDay: true, color: COLORS[schedule.color] ?? 'gold',
      }
    })

  useEffect(() => {
    const close = () => setSelected(null)
    window.addEventListener('resize', close)
    return () => window.removeEventListener('resize', close)
  }, [])

  const handleSelectedClose = useCallback(() => {
    setSelected(null)
    onScheduleDetailClose?.()
  }, [onScheduleDetailClose])

  const selectSchedule = useCallback((schedule: Schedule, element: HTMLElement) => {
    const rect = element.getBoundingClientRect()

    setSelected({ schedule, x: rect.right + 10, y: rect.top })
  }, [])

  const openRequestedSchedule = useCallback(
    (scheduleId: number, element: HTMLElement) => {
      if (autoOpenedScheduleIdRef.current === scheduleId) {
        return
      }

      const schedule = schedules.find((item) => item.scheduleId === scheduleId)

      if (!schedule) {
        return
      }

      autoOpenedScheduleIdRef.current = scheduleId
      selectSchedule(schedule, element)
    },
    [schedules, selectSchedule],
  )

  const getFallbackPopoverPosition = useCallback(() => {
    const rect = calendarContainerRef.current?.getBoundingClientRect()

    if (!rect) {
      return { x: window.innerWidth - 416, y: 8 }
    }

    return { x: rect.right - 410, y: rect.top + 20 }
  }, [])

  const handleEventDidMount = useCallback(
    ({ event, el }: EventMountArg) => {
      eventElementsRef.current.set(event.id, el)

      if (
        !loading &&
        selectedScheduleId !== null &&
        event.id === String(selectedScheduleId)
      ) {
        openRequestedSchedule(selectedScheduleId, el)
      }
    },
    [loading, openRequestedSchedule, selectedScheduleId],
  )

  const handleEventWillUnmount = useCallback(({ event }: EventMountArg) => {
    eventElementsRef.current.delete(event.id)
  }, [])

  useEffect(() => {
    if (loading || selectedScheduleId === null) {
      if (selectedScheduleId === null) {
        autoOpenedScheduleIdRef.current = null
      }

      return
    }

    const schedule = schedules.find((item) => item.scheduleId === selectedScheduleId)

    if (!schedule || autoOpenedScheduleIdRef.current === selectedScheduleId) {
      return
    }

    const frame = window.requestAnimationFrame(() => {
      const eventElement = eventElementsRef.current.get(String(selectedScheduleId))

      if (eventElement) {
        openRequestedSchedule(selectedScheduleId, eventElement)
        return
      }

      // 현재 월에 없거나 더보기 영역에 숨겨진 일정도 알림에서 바로 확인할 수 있도록
      // 홈 캘린더를 기준으로 상세 팝오버를 엽니다.
      autoOpenedScheduleIdRef.current = selectedScheduleId
      const position = getFallbackPopoverPosition()

      setSelected({ schedule, ...position })
    })

    return () => window.cancelAnimationFrame(frame)
  }, [
    getFallbackPopoverPosition,
    loading,
    openRequestedSchedule,
    schedules,
    selectedScheduleId,
  ])

  function handleDatesSet({ view }: DatesSetArg) {
    setSelected(null)
    setVisibleDate(view.currentStart)
  }

  return (
    <S.CalendarWrapper
      ref={calendarContainerRef}
      $loading={loading}
      aria-label="월간 일정"
      aria-busy={loading}
    >
      <FullCalendar
        plugins={[dayGridPlugin]}
        locale={koLocale}
        initialView="dayGridMonth"
        headerToolbar={{ left: 'prev', center: 'title', right: 'next' }}
        events={events}
        editable={false}
        selectable={false}
        dayMaxEvents
        fixedWeekCount
        height="100%"
        eventOrder="-duration,start"
        datesSet={handleDatesSet}
        eventDidMount={handleEventDidMount}
        eventWillUnmount={handleEventWillUnmount}
        eventContent={({ event }) => loading
          ? <S.EventSkeleton aria-label="일정 불러오는 중" />
          : <S.EventContentWrapper>
              <FaFlag size={12} aria-hidden="true" />
              <S.EventLabel>{event.title}</S.EventLabel>
            </S.EventContentWrapper>}
        eventClick={({ event, el }) => {
          const schedule = schedules.find((item) => String(item.scheduleId) === event.id)
          if (!schedule) return

          if (selected?.schedule.scheduleId === schedule.scheduleId) {
            handleSelectedClose()
            return
          }

          autoOpenedScheduleIdRef.current = schedule.scheduleId
          selectSchedule(schedule, el)
        }}
        moreLinkClick="popover"
      />
      {selected && (
        <ScheduleDetailPopover
          key={`${selected.schedule.scheduleId}-${selected.x}-${selected.y}`}
          {...selected}
          onClose={handleSelectedClose}
        />
      )}
    </S.CalendarWrapper>
  )
}

function getLoadingEvents(date: Date) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const dayCount = new Date(year, month, 0).getDate()

  return Array.from({ length: dayCount }, (_, index) => {
    const day = index + 1

    return {
      id: `loading-${year}-${month}-${day}`,
      title: '일정 불러오는 중',
      start: toDateKey(year, month, day),
      allDay: true,
      classNames: ['calendar-event-skeleton'],
    }
  })
}
