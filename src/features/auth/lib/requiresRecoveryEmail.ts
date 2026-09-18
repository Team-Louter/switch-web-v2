import type { ProfileResponse } from '@/entities/profile'

export function requiresRecoveryEmail(
  profile: Pick<ProfileResponse, 'userEmail' | 'recoveryEmail'>,
): boolean {
  return (
    profile.recoveryEmail == null &&
    profile.userEmail.toLowerCase().endsWith('@dgsw.hs.kr')
  )
}
