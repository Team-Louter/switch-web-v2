/**
 * 일정 목록 상태 훅
 *
 * 서버 연동 전까지 로컬 상태로 일정 추가/수정/삭제를 처리합니다.
 * 요청 본문은 서버 스키마와 동일한 형태이므로, 추후 API 호출만 끼워 넣으면 됩니다.
 */
import { useRef, useState } from 'react'

import type {
  CreateScheduleRequest,
  Schedule,
  ScheduleResponse,
  UpdateScheduleRequest,
} from '@/shared/types/schedule'
import { toScheduleFromRequest, toSchedules } from '@/shared/utils/schedule'

export function useSchedules(initialResponses: ScheduleResponse[]) {
  const [schedules, setSchedules] = useState<Schedule[]>(() =>
    toSchedules(initialResponses),
  )
  // 로컬에서 새 일정에 부여할 id (서버 연동 시 응답의 scheduleId로 대체)
  const nextScheduleIdRef = useRef(
    initialResponses.reduce(
      (maxId, response) => Math.max(maxId, response.scheduleId),
      0,
    ) + 1,
  )

  // TODO: POST /schedules 연동
  const createSchedule = (request: CreateScheduleRequest) => {
    const scheduleId = nextScheduleIdRef.current

    nextScheduleIdRef.current += 1
    setSchedules((previousSchedules) => [
      ...previousSchedules,
      toScheduleFromRequest(scheduleId, request),
    ])
  }

  // TODO: PUT /schedules/{scheduleId} 연동
  const updateSchedule = (
    scheduleId: number,
    request: UpdateScheduleRequest,
  ) => {
    setSchedules((previousSchedules) =>
      previousSchedules.map((schedule) =>
        schedule.scheduleId === scheduleId
          ? toScheduleFromRequest(scheduleId, request, schedule.users)
          : schedule,
      ),
    )
  }

  // TODO: DELETE /schedules/{scheduleId} 연동
  const deleteSchedule = (scheduleId: number) => {
    setSchedules((previousSchedules) =>
      previousSchedules.filter((schedule) => schedule.scheduleId !== scheduleId),
    )
  }

  return { schedules, createSchedule, updateSchedule, deleteSchedule }
}
