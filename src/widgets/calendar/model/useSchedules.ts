/**
 * 일정 목록 상태 훅
 *
 * 서버에서 일정을 불러오고, 추가/수정/삭제 후 응답으로 목록을 갱신합니다.
 */
import { useEffect, useState } from 'react'

import type {
  CreateScheduleRequest,
  Schedule,
  UpdateScheduleRequest,
} from '@/shared/types/schedule'
import { toSchedule, toSchedules } from '@/shared/utils/schedule'

import {
  createSchedule as requestCreateSchedule,
  deleteSchedule as requestDeleteSchedule,
  getAllSchedules,
  modifySchedule as requestModifySchedule,
} from '../api/scheduleApi'

export function useSchedules() {
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    let isCancelled = false

    getAllSchedules()
      .then((responses) => {
        if (!isCancelled) setSchedules(toSchedules(responses))
      })
      .catch(() => {
        if (!isCancelled) setHasError(true)
      })
      .finally(() => {
        if (!isCancelled) setIsLoading(false)
      })

    return () => {
      isCancelled = true
    }
  }, [])

  const createSchedule = async (request: CreateScheduleRequest) => {
    const response = await requestCreateSchedule(request)

    setSchedules((previousSchedules) => [
      ...previousSchedules,
      toSchedule(response),
    ])
  }

  const updateSchedule = async (
    scheduleId: number,
    request: UpdateScheduleRequest,
  ) => {
    const response = await requestModifySchedule(scheduleId, request)

    setSchedules((previousSchedules) =>
      previousSchedules.map((schedule) =>
        schedule.scheduleId === scheduleId ? toSchedule(response) : schedule,
      ),
    )
  }

  const deleteSchedule = async (scheduleId: number) => {
    await requestDeleteSchedule(scheduleId)

    setSchedules((previousSchedules) =>
      previousSchedules.filter((schedule) => schedule.scheduleId !== scheduleId),
    )
  }

  return {
    schedules,
    isLoading,
    hasError,
    createSchedule,
    updateSchedule,
    deleteSchedule,
  }
}
