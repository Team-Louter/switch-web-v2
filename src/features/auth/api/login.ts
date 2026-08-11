import { apiClient } from '@/shared/api'

export type LoginProvider = 'SELF' | 'GOOGLE'

export interface LoginRequest {
  userEmail: string
  userPassword: string
  userProvider: LoginProvider
  turnstileToken: string
}

export interface LoginResponse {
  token: string
  studentId?: number
  generation?: number
  grade?: number
  classRoom?: number
  number?: number
  userName?: string
  userId?: number
  userEmail?: string
  userProvider?: LoginProvider
}

export async function login(request: LoginRequest): Promise<LoginResponse> {
  const response = await apiClient.post<LoginResponse>('/auth/login', request)

  if (
    typeof response.data.token !== 'string' ||
    !response.data.token.trim()
  ) {
    throw new Error('로그인 응답에 액세스 토큰이 없습니다.')
  }

  return response.data
}
