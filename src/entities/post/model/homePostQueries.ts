import { queryOptions } from '@tanstack/react-query'

import { getHotPosts, getRecentHomePost } from '../api/getPost'

export const homePostQueryKeys = {
  all: ['home-posts'] as const,
  recent: (userId: number | null) =>
    [...homePostQueryKeys.all, 'recent', userId] as const,
  popular: () => [...homePostQueryKeys.all, 'popular'] as const,
}

export function recentHomePostOptions(userId: number | null) {
  return queryOptions({
    queryKey: homePostQueryKeys.recent(userId),
    queryFn: getRecentHomePost,
    enabled: userId !== null,
  })
}

export function popularHomePostsOptions() {
  return queryOptions({
    queryKey: homePostQueryKeys.popular(),
    queryFn: getHotPosts,
    staleTime: 15_000,
  })
}
