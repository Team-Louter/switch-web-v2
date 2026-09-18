import { apiClient } from '@/shared/api'

export interface VerifyRecoveryEmailRequest {
  recoveryEmail: string
  verificationCode: string
}

export async function verifyRecoveryEmail(
  request: VerifyRecoveryEmailRequest,
): Promise<void> {
  await apiClient.post<void>('/auth/recovery-email/verification/confirm', request)
}
