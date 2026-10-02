import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { scheduleListOptions } from '@/entities/schedule'
import { useUserStore } from '@/entities/profile'
import { formatEvents } from '../lib/calendarEvents'

export function useEvent() {
  const userId = useUserStore((state) => state.user?.userId ?? null)
  const schedulesQuery = useQuery(scheduleListOptions(userId))
  const eventsInfo = useMemo(
    () => formatEvents(schedulesQuery.data ?? []),
    [schedulesQuery.data],
  )

  return {
    eventsInfo,
    isLoading: schedulesQuery.isPending,
    error: schedulesQuery.isError ? '일정을 불러오지 못했습니다.' : '',
  }
}
