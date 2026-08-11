import { apiClient } from '@/shared/api'

export interface CheckEmailExistsRequest {
  userEmail: string
}

export interface CheckEmailExistsResponse {
  exists: boolean
}

export async function checkEmailExists(
  request: CheckEmailExistsRequest,
): Promise<CheckEmailExistsResponse> {
  const response = await apiClient.get<CheckEmailExistsResponse>(
    '/auth/email/exists',
    { params: request },
  )

  if (typeof response.data.exists !== 'boolean') {
    throw new Error('이메일 확인 응답 형식이 올바르지 않습니다.')
  }

  return response.data
}
