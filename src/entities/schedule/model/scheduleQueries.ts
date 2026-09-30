import { queryOptions } from '@tanstack/react-query'

import { getAllSchedules } from '../api/getSchedule'

export const scheduleQueryKeys = {
  all: ['schedules'] as const,
  lists: () => [...scheduleQueryKeys.all, 'list'] as const,
  list: (userId: number | null) =>
    [...scheduleQueryKeys.lists(), userId] as const,
}

export function scheduleListOptions(userId: number | null) {
  return queryOptions({
    queryKey: scheduleQueryKeys.list(userId),
    queryFn: getAllSchedules,
    enabled: userId !== null,
  })
}
