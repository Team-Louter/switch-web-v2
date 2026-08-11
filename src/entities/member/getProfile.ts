import { apiClient } from '@/shared/api'

import type { Profile } from './model/profile'

/**
 * 로그인한 사용자의 프로필을 조회한다.
 */
export const getProfile = async (): Promise<Profile> => {
  const response = await apiClient.get<Profile>('/me')
  return response.data
}
