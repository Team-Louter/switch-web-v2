/**
 * 일정 API
 *
 * 서버 문서(docs/server-docs.json)의 schedule-controller를 따릅니다.
 * 다른 도메인처럼 entities 계층으로 옮기는 작업은 폴더 구조 정리 시 함께 진행합니다.
 */
import { apiClient } from '@/shared/api'
import type {
  CreateScheduleRequest,
  ScheduleResponse,
  UpdateScheduleRequest,
} from '@/shared/types/schedule'

export const getAllSchedules = async (): Promise<ScheduleResponse[]> => {
  const response = await apiClient.get<ScheduleResponse[]>('/schedules')
  return response.data
}

/**
 * 일정을 생성한다.
 *
 * @param request 제목, 기간, 색상, 대상 정보
 */
export const createSchedule = async (
  request: CreateScheduleRequest,
): Promise<ScheduleResponse> => {
  const response = await apiClient.post<ScheduleResponse>('/schedules', request)
  return response.data
}

/**
 * 일정을 수정한다.
 *
 * @param scheduleId 일정 아이디
 * @param request 수정할 일정 정보
 */
export const modifySchedule = async (
  scheduleId: number,
  request: UpdateScheduleRequest,
): Promise<ScheduleResponse> => {
  const response = await apiClient.put<ScheduleResponse>(
    `/schedules/${scheduleId}`,
    request,
  )
  return response.data
}

/**
 * 일정을 삭제한다.
 *
 * @param scheduleId 일정 아이디
 */
export const deleteSchedule = async (scheduleId: number): Promise<void> => {
  await apiClient.delete<void>(`/schedules/${scheduleId}`)
}
