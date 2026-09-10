import type { DateSelectArg, EventClickArg, EventContentArg } from '@fullcalendar/core'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import FullCalendar from '@fullcalendar/react'
import { FaFlag } from 'react-icons/fa6'

import { SCHEDULE_CHIP_COLORS } from '@/shared/constants/calendar'
import type { Schedule } from '@/shared/types/schedule'
import { formatDateInput } from '@/shared/utils/date'

import {
  CalendarWrapper,
  EventContentWrapper,
  EventLabel,
} from './MonthCalendar.style'

type MonthCalendarProps = {
  schedules: Schedule[]
  onDateSelect: (startDate: Date, endDate: Date) => void
  onScheduleSelect: (schedule: Schedule) => void
}

const getExclusiveEndDate = (date: Date) => {
  const exclusiveEndDate = new Date(date)
  exclusiveEndDate.setDate(exclusiveEndDate.getDate() + 1)
  return formatDateInput(exclusiveEndDate)
}

export function MonthCalendar({
  schedules,
  onDateSelect,
  onScheduleSelect,
}: MonthCalendarProps) {
  const calendarEvents = schedules.map((schedule) => ({
    id: `${schedule.scheduleId}`,
    title: schedule.title,
    start: formatDateInput(schedule.startDate),
    end: getExclusiveEndDate(schedule.endDate),
    backgroundColor: SCHEDULE_CHIP_COLORS[schedule.color],
    extendedProps: { scheduleId: schedule.scheduleId },
  }))

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    const endDate = new Date(selectInfo.end)
    endDate.setDate(endDate.getDate() - 1)
    onDateSelect(selectInfo.start, endDate)
  }

  const handleEventClick = (clickInfo: EventClickArg) => {
    const scheduleId = Number(clickInfo.event.extendedProps.scheduleId)
    const schedule = schedules.find((item) => item.scheduleId === scheduleId)

    if (schedule) onScheduleSelect(schedule)
  }

  const renderEventContent = (eventInfo: EventContentArg) => (
    <EventContentWrapper>
      <FaFlag size={12} />
      <EventLabel>{eventInfo.event.title}</EventLabel>
    </EventContentWrapper>
  )

  return (
    <CalendarWrapper>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{ left: 'prev', center: 'title', right: 'next' }}
        events={calendarEvents}
        editable
        selectable
        selectMirror
        dayMaxEvents
        fixedWeekCount
        locale="ko"
        height="100%"
        select={handleDateSelect}
        eventClick={handleEventClick}
        eventContent={renderEventContent}
        eventDidMount={(info) => {
          info.el.style.border = 'none'
        }}
      />
    </CalendarWrapper>
  )
}
