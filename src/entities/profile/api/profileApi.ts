import { apiClient } from '@/shared/api'

import type { ProfileResponse, UpdateProfileRequest } from '../model/types'

export const getMyProfile = async () => {
  const response = await apiClient.get<ProfileResponse>('/me')

  return response.data
}

export const updateMyProfile = async (body: UpdateProfileRequest) => {
  const response = await apiClient.put<ProfileResponse>('/me/profile', body)

  return response.data
}

export const sendWithdrawalVerificationCode = async () => {
  const response = await apiClient.get<string>('/me/withdrawal')

  return response.data
}

export const verifyWithdrawalCode = async (inputCode: string) => {
  const response = await apiClient.get<string>('/me/withdrawal/verify', {
    params: {
      inputCode,
    },
  })

  return response.data
}
