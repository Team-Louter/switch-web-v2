import { apiClient } from '@/shared/api'

export interface SendRecoveryEmailVerificationRequest {
  recoveryEmail: string
  turnstileToken: string
}

export async function sendRecoveryEmailVerification(
  request: SendRecoveryEmailVerificationRequest,
): Promise<void> {
  await apiClient.post<void>('/auth/recovery-email/verification', request)
}
