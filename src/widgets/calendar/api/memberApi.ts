/**
 * 담당자 선택용 멤버 API
 */
import { apiClient } from '@/shared/api'
import type { Member } from '@/shared/types/member'

export const getMembers = async (): Promise<Member[]> => {
  const response = await apiClient.get<Member[]>('/members')
  return response.data
}
