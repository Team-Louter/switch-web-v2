import { queryOptions } from '@tanstack/react-query'

import { getMyProfile } from '../api/profileApi'

export const profileQueryKeys = {
  meRoot: ['profile', 'me'] as const,
  me: (userId: number | null) => [...profileQueryKeys.meRoot, userId] as const,
}

export function profileMeOptions(userId: number | null) {
  return queryOptions({
    queryKey: profileQueryKeys.me(userId),
    queryFn: getMyProfile,
  })
}
