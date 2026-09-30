import { queryOptions } from '@tanstack/react-query'

import { queryClient } from '@/shared/lib/queryClient'

import { getPosts } from '../api/getCommunity'
import type { GetPostsParams } from './types'

const POST_LIST_QUERY_KEY = ['community', 'posts'] as const

export function communityPostListOptions({
  category,
  page = 0,
  size = 32,
}: GetPostsParams = {}) {
  return queryOptions({
    queryKey: [...POST_LIST_QUERY_KEY, { category: category ?? null, page, size }],
    queryFn: () => getPosts({ category, page, size }),
    staleTime: 30_000,
    gcTime: 5 * 60_000,
    retry: false,
  })
}

export async function invalidateCommunityPostLists() {
  // 변경 전 시작된 응답이 성공한 변경 이후의 캐시를 덮어쓰지 않도록 취소한다.
  await queryClient.cancelQueries({ queryKey: POST_LIST_QUERY_KEY })
  await queryClient.invalidateQueries({ queryKey: POST_LIST_QUERY_KEY })
}
