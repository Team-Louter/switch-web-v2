import { useRef, useState } from 'react'
import type { Dispatch, SetStateAction } from 'react'
import type { EventInput } from '@fullcalendar/core'
import type { Member } from '@/shared/types/member'
import type { ScheduleColor } from '@/shared/types/schedule'
import { toEndDateTime, toStartDateTime } from '@/shared/utils/schedule'
import { createSchedule, deleteSchedule, modifySchedule } from '../api/scheduleApi'
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
      const savedSchedule = params.modalMode === '추가'
        ? await createSchedule(payload)
        : await modifySchedule(Number(params.event?.scheduleId), payload)
      const savedEvent = formatEvents([savedSchedule])[0]

      params.setEvents((currentEvents) => {
        if (params.modalMode === '추가') {
          return [...currentEvents, savedEvent]
        }

        return currentEvents.map((currentEvent) =>
          currentEvent.scheduleId === savedEvent.scheduleId
            ? savedEvent
            : currentEvent,
        )
      })
      params.setIsModalOpen(false)
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
      params.setEvents((currentEvents) =>
        currentEvents.filter((currentEvent) =>
          currentEvent.scheduleId !== scheduleId && currentEvent.id !== String(scheduleId),
        ),
      )
      params.setIsModalOpen(false)
    } catch {
      setError('일정 삭제에 실패했습니다. 다시 시도해 주세요.')
    } finally {
      pending.current = false
      setIsDeleting(false)
    }
  }
  return { handleSubmit, handleDelete, isSubmitting, isDeleting, error }
}
