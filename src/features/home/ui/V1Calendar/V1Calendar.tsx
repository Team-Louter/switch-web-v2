import { useEffect, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import koLocale from '@fullcalendar/core/locales/ko'
import { FaFlag } from 'react-icons/fa6'

import type { Schedule, ScheduleColor } from '@/entities/schedule'
import { toDateKey, toDateKeyFromServer } from '@/shared/lib/calendar'

import * as S from './V1Calendar.style'
import { EventDetailCard } from './EventDetailCard'

interface V1CalendarProps {
  schedules: Schedule[]
  loading: boolean
}

const COLORS: Record<ScheduleColor, string> = {
  GOLD: 'gold', LIGHTGREY: 'lightgrey', PINK: 'pink',
  LIGHTGREEN: 'lightgreen', LIGHTBLUE: 'lightblue',
}

export function V1Calendar({ schedules, loading }: V1CalendarProps) {
  const [selected, setSelected] = useState<{ schedule: Schedule; x: number; y: number } | null>(null)
  const events = schedules.map((schedule) => {
    // FullCalendar의 종료일은 exclusive이며 API 종료일은 inclusive이다.
    const end = new Date(`${toDateKeyFromServer(schedule.endDate)}T00:00:00Z`)
    end.setUTCDate(end.getUTCDate() + 1)
    return {
      id: String(schedule.scheduleId), title: schedule.title,
      start: toDateKeyFromServer(schedule.startDate),
      end: toDateKey(end.getUTCFullYear(), end.getUTCMonth() + 1, end.getUTCDate()),
      allDay: true, color: COLORS[schedule.color] ?? 'gold',
      classNames: loading ? ['calendar-event-skeleton'] : [],
    }
  })

  useEffect(() => {
    const close = () => setSelected(null)
    window.addEventListener('resize', close)
    return () => window.removeEventListener('resize', close)
  }, [])

  return (
    <S.CalendarWrapper aria-label="월간 일정" aria-busy={loading}>
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
        datesSet={() => setSelected(null)}
        eventContent={({ event }) => loading
          ? <S.EventSkeleton aria-label="일정 불러오는 중" />
          : <S.EventContentWrapper>
              <FaFlag size={12} aria-hidden="true" />
              <S.EventLabel>{event.title}</S.EventLabel>
            </S.EventContentWrapper>}
        eventClick={({ event, el }) => {
          const schedule = schedules.find((item) => String(item.scheduleId) === event.id)
          if (!schedule) return
          const rect = el.getBoundingClientRect()
          setSelected({ schedule, x: rect.right + 10, y: rect.top })
        }}
        moreLinkClick="popover"
      />
      {selected && <EventDetailCard key={`${selected.schedule.scheduleId}-${selected.x}-${selected.y}`} {...selected} onClose={() => setSelected(null)} />}
    </S.CalendarWrapper>
  )
}
