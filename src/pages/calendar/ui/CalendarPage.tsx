import { Calendar } from '@/widgets/calendar'
import { useSearchParams } from 'react-router-dom'
import { CalendarContainer, CalendarContent } from './CalendarPage.style'

function parseScheduleId(value: string | null): number | null {
  if (!value) return null

  const scheduleId = Number(value)
  return Number.isSafeInteger(scheduleId) && scheduleId > 0 ? scheduleId : null
}

export function CalendarPage() {
  const [searchParams] = useSearchParams()
  const initialScheduleId = parseScheduleId(searchParams.get('scheduleId'))

  return <CalendarContainer><CalendarContent><Calendar initialScheduleId={initialScheduleId} /></CalendarContent></CalendarContainer>
}
