import { useEffect, useState } from 'react'
import type { EventInput } from '@fullcalendar/core'
import { getAllSchedules } from '../api/scheduleApi'
import { formatEvents } from '../lib/calendarEvents'

export function useEvent() {
  const [eventsInfo, setEventsInfo] = useState<EventInput[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  useEffect(() => {
    let cancelled = false
    getAllSchedules().then((events) => {
      if (!cancelled) setEventsInfo(formatEvents(events))
    }).catch(() => {
      if (!cancelled) setError('일정을 불러오지 못했습니다.')
    }).finally(() => {
      if (!cancelled) setIsLoading(false)
    })
    return () => { cancelled = true }
  }, [])
  return { eventsInfo, setEventsInfo, isLoading, error }
}
