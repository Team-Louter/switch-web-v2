import type { ProfileResponse } from '@/entities/profile'

export function requiresRecoveryEmail(
  profile: Pick<ProfileResponse, 'grade' | 'userEmail' | 'recoveryEmail'>,
): boolean {
  return (
    profile.grade === 3 &&
    profile.recoveryEmail == null &&
    profile.userEmail.toLowerCase().endsWith('@dgsw.hs.kr')
  )
}
