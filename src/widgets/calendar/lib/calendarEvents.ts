import type { EventApi, EventInput } from '@fullcalendar/core'
import type { Member } from '@/shared/types/member'
import type { ScheduleResponse, ScheduleTarget } from '@/shared/types/schedule'

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
  return { scheduleTarget: generations.length ? 'GENERATION' : 'PERSONAL', generations, userIds }
}

export function formatEvents(events: ScheduleResponse[]): EventInput[] {
  return events.map((event) => {
    const endDate = new Date(event.endDate)
    endDate.setDate(endDate.getDate() + 1)
    return {
      id: String(event.scheduleId), title: event.title,
      start: event.startDate, end: endDate.toISOString(), color: event.color,
      scheduleId: event.scheduleId,
      extendedProps: { scheduleId: event.scheduleId, description: event.content, assignees: event.users },
    }
  })
}

export function formatApiEvents(event: EventApi): EventInput {
  return {
    id: event.id, scheduleId: Number(event.extendedProps.scheduleId ?? event.id),
    title: event.title, start: event.start?.toISOString(), end: event.end?.toISOString(),
    color: event.backgroundColor, extendedProps: event.extendedProps,
  }
}
