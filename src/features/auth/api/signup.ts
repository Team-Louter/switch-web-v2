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

export interface GoogleExtraSignupRequest {
  userName: string
  studentId: number
  clubCode: string
}

export type GoogleExtraSignupResponse = void

export async function signup(
  request: SignupRequest,
): Promise<SignupResponse> {
  const response = await apiClient.post<SignupResponse>(
    '/auth/signup',
    request,
  )

  return response.data
}

export async function signupGoogleExtra(
  request: GoogleExtraSignupRequest,
): Promise<GoogleExtraSignupResponse> {
  await apiClient.post('/auth/signup/extra', request)
}
