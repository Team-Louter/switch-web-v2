import type { ProfileResponse } from '@/entities/profile'

export function requiresRecoveryEmail(
  profile: Pick<ProfileResponse, 'recoveryEmail'>,
): boolean {
  return profile.recoveryEmail == null
}
