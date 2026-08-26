import { apiClient } from '@/shared/api'
import type { MemberRole } from '@/entities/member/model/profile'

import type { MentoringMember, MentoringRoom } from '../model/types'

/**
 * 참여 중인 멘토링 방 목록을 조회한다.
 */
export const getMentorings = async (): Promise<MentoringRoom[]> => {
  const response = await apiClient.get<MentoringRoom[]>('/mentoring')
  return response.data
}

/**
 * 멘토링 방에 속한 특정 역할의 멤버를 조회한다.
 *
 * @param mentoringId 멘토링 방 아이디
 * @param role 조회할 역할
 */
export const getMentoringMembers = async (
  mentoringId: number,
  role: MemberRole,
): Promise<MentoringMember[]> => {
  const response = await apiClient.get<MentoringMember[]>(
    `/mentoring/${mentoringId}/members`,
    { params: { role } },
  )
  return response.data
}
