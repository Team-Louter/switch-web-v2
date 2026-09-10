import { useRef, useState } from 'react'
import type { Dispatch, SetStateAction } from 'react'
import type { EventInput } from '@fullcalendar/core'
import type { Member } from '@/shared/types/member'
import type { ScheduleColor } from '@/shared/types/schedule'
import { toEndDateTime, toStartDateTime } from '@/shared/utils/schedule'
import { createSchedule, deleteSchedule, modifySchedule, getAllSchedules } from '../api/scheduleApi'
import { formatEvents, getScheduleTarget } from '../lib/calendarEvents'

interface EditorParams {
  modalMode: string
  event: EventInput | null
  title: string
  content: string
  startDate: string
  endDate: string
  selectedColor: string
  selectedMemberIds: number[]
  allMembers: Member[]
  setEvents: Dispatch<SetStateAction<EventInput[]>>
  setIsModalOpen: Dispatch<SetStateAction<boolean>>
}

export function useEventEditor(params: EditorParams) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState('')
  const pending = useRef(false)
  const refresh = async () => {
    params.setEvents(formatEvents(await getAllSchedules()))
    params.setIsModalOpen(false)
  }
  const handleSubmit = async () => {
    if (pending.current) return
    pending.current = true
    setIsSubmitting(true)
    setError('')
    const payload = {
      title: params.title, content: params.content,
      startDate: toStartDateTime(params.startDate),
      endDate: toEndDateTime(params.endDate),
      color: params.selectedColor.toUpperCase() as ScheduleColor,
      ...getScheduleTarget(params.selectedMemberIds, params.allMembers),
    }
    try {
      if (params.modalMode === '추가') await createSchedule(payload)
      else await modifySchedule(Number(params.event?.scheduleId), payload)
      await refresh()
    } catch {
      setError('일정 저장에 실패했습니다. 다시 시도해 주세요.')
    } finally {
      pending.current = false
      setIsSubmitting(false)
    }
  }
  const handleDelete = async (scheduleId: number) => {
    if (pending.current) return
    pending.current = true
    setIsDeleting(true)
    setError('')
    try {
      await deleteSchedule(scheduleId)
      await refresh()
    } catch {
      setError('일정 삭제에 실패했습니다. 다시 시도해 주세요.')
    } finally {
      pending.current = false
      setIsDeleting(false)
    }
  }
  return { handleSubmit, handleDelete, isSubmitting, isDeleting, error }
}
