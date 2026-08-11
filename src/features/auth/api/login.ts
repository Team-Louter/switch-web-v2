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
  requiresExtraSignup: boolean
  studentId?: number | null
  generation?: number | null
  grade?: number | null
  classRoom?: number | null
  number?: number | null
  userName?: string | null
  userId?: number
  userEmail?: string
  userProvider?: LoginProvider
}

export interface GoogleOAuthCodeExchangeRequest {
  code: string
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

export async function exchangeGoogleOAuthCode(
  request: GoogleOAuthCodeExchangeRequest,
): Promise<LoginResponse> {
  const response = await apiClient.post<LoginResponse>(
    '/auth/oauth/google/exchange',
    request,
  )

  if (typeof response.data.token !== 'string' || !response.data.token.trim()) {
    throw new Error('Google OAuth 응답에 액세스 토큰이 없습니다.')
  }

  return response.data
}
