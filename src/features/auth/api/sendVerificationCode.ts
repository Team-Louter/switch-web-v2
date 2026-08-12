import { apiClient } from '@/shared/api'

export interface SendVerificationCodeRequest {
  userEmail: string
  turnstileToken: string
}

export type SendVerificationCodeResponse = string

export async function sendVerificationCode(
  request: SendVerificationCodeRequest,
): Promise<SendVerificationCodeResponse> {
  const response = await apiClient.post<SendVerificationCodeResponse>(
    '/auth/email',
    request,
  )

  return response.data
}
