import { queryOptions } from '@tanstack/react-query'

import { getMember } from '../api/getMember'

export const memberQueryKeys = {
  all: ['members'] as const,
  directory: (userId: number | null) =>
    [...memberQueryKeys.all, 'directory', userId] as const,
}

export function memberDirectoryOptions(userId: number | null) {
  return queryOptions({
    queryKey: memberQueryKeys.directory(userId),
    queryFn: getMember,
    enabled: userId !== null,
  })
}
