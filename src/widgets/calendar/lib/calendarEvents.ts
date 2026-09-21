import type { EventApi, EventInput } from '@fullcalendar/core'
import type { Member } from '@/shared/types/member'
import type { ScheduleResponse, ScheduleTarget } from '@/shared/types/schedule'
import { addDays, formatDateInput, parseDateInput } from '@/shared/utils/date'
import { toDateKeyFromServer } from '@/shared/lib/calendar'
import * as paletteToken from '@/shared/styles/values/token'

function getCalendarEventColor(color: ScheduleResponse['color']): string {
  return color === 'GOLD' ? paletteToken.colors.primary.primary50 : color
}

export const calendarHighlight = ['LIGHTGREY', 'PINK', 'GOLD', 'LIGHTGREEN', 'LIGHTBLUE']

export function formatAssignees(assignees?: { userName: string }[] | string[]) {
  const names = assignees?.map((member) => typeof member === 'string' ? member : member.userName) ?? []
  return names.length > 1 ? `${names[0]} 외 ${names.length - 1}명` : names[0] ?? '-'
}

export function getGenerations(members: Member[]) {
  return ['전체', ...[...new Set(members.flatMap((member) => member.generation === undefined ? [] : [member.generation]))]
    .sort((a, b) => a - b).map((generation) => `${generation}기`)]
}

export function getScheduleTarget(selectedIds: number[], members: Member[]): {
  scheduleTarget: ScheduleTarget
  generations: number[]
  userIds: number[]
} {
  if (members.length > 0 && members.every((member) => selectedIds.includes(member.userId))) {
    return { scheduleTarget: 'ALL', generations: [], userIds: [] }
  }
  const generations = [...new Set(members.flatMap((member) => member.generation === undefined ? [] : [member.generation]))]
    .filter((generation) => members.filter((member) => member.generation === generation)
      .every((member) => selectedIds.includes(member.userId)))
  const userIds = selectedIds.filter((id) => {
    const member = members.find((item) => item.userId === id)
    return member?.generation === undefined || !generations.includes(member.generation)
  })

  // API는 하나의 대상 타입만 받으므로 기수 전체와 개별 멤버를 함께 선택하면
  // 선택된 멤버 전체를 PERSONAL 대상으로 전송해 일부 담당자가 누락되지 않게 합니다.
  if (generations.length > 0 && userIds.length > 0) {
    return { scheduleTarget: 'PERSONAL', generations: [], userIds: selectedIds }
  }

  if (generations.length > 0) {
    return { scheduleTarget: 'GENERATION', generations, userIds: [] }
  }

  return { scheduleTarget: 'PERSONAL', generations: [], userIds }
}

export function formatEvents(events: ScheduleResponse[]): EventInput[] {
  return events.map((event) => {
    // API 종료일은 inclusive, FullCalendar 종료일은 exclusive이므로 다음 날 자정으로 변환합니다.
    const endDate = addDays(
      parseDateInput(toDateKeyFromServer(event.endDate)),
      1,
    )

    return {
      id: String(event.scheduleId), title: event.title,
      start: event.startDate,
      end: formatDateInput(endDate),
      color: getCalendarEventColor(event.color),
      classNames: event.color === 'GOLD' ? ['club-primary-event'] : undefined,
      scheduleId: event.scheduleId,
      extendedProps: {
        scheduleId: event.scheduleId,
        scheduleColor: event.color,
        description: event.content,
        assignees: event.users,
      },
    }
  })
}

export function formatApiEvents(event: EventApi): EventInput {
  const scheduleColor = event.extendedProps?.scheduleColor

  return {
    id: event.id, scheduleId: Number(event.extendedProps.scheduleId ?? event.id),
    title: event.title,
    start: event.start?.toISOString(),
    end: event.end?.toISOString(),
    color: scheduleColor === 'GOLD' ? 'GOLD' : event.backgroundColor,
    extendedProps: event.extendedProps,
  }
}
