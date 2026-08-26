import { apiClient } from '@/shared/api'
import type { MentoringRequest, MentoringRoom } from '@/entities/mentoring'

/**
 * 멘토링 방을 생성한다.
 *
 * @param data 방 이름과 참여시킬 멤버 아이디 목록
 */
export const createMentoring = async (
  data: MentoringRequest,
): Promise<MentoringRoom> => {
  const response = await apiClient.post<MentoringRoom>('/mentoring', data)
  return response.data
}

/**
 * 멘토링 방을 수정한다.
 *
 * @param mentoringId 멘토링 방 아이디
 * @param data 수정할 방 이름과 멤버 아이디 목록
 */
export const modifyMentoring = async (
  mentoringId: number,
  data: MentoringRequest,
): Promise<MentoringRoom> => {
  const response = await apiClient.put<MentoringRoom>(
    `/mentoring/${mentoringId}`,
    data,
  )
  return response.data
}

/**
 * 멘토링 방을 삭제한다.
 *
 * @param mentoringId 멘토링 방 아이디
 */
export const deleteMentoring = async (mentoringId: number): Promise<void> => {
  await apiClient.delete<void>(`/mentoring/${mentoringId}`)
}
