import { apiClient } from '@/shared/api'

import type { LoginProvider } from './login'

export interface SignupRequest {
  studentId: number
  userName: string
  userEmail: string
  userPassword: string
  confirmPassword: string
  userProvider: LoginProvider
  clubCode: string
}

export type SignupResponse = Record<string, unknown>

export async function signup(
  request: SignupRequest,
): Promise<SignupResponse> {
  const response = await apiClient.post<SignupResponse>(
    '/auth/signup',
    request,
  )

  return response.data
}
