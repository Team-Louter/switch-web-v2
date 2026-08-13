import { apiClient } from '@/shared/api'

export interface VerifyEmailCodeRequest {
  userEmail: string
  inputCode: string
}

export type VerifyEmailCodeResponse = string

export async function verifyEmailCode(
  request: VerifyEmailCodeRequest,
): Promise<VerifyEmailCodeResponse> {
  const response = await apiClient.get<VerifyEmailCodeResponse>(
    '/auth/verify',
    { params: request },
  )

  return response.data
}
