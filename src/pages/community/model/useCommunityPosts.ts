import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

import { communityPostListOptions, type PostCategory } from '@/entities/community'
import { useUserStore } from '@/entities/profile'

export function useCommunityPosts(category: PostCategory | null, page: number) {
  const userId = useUserStore((state) => state.user?.userId ?? null)
  const postsQuery = useQuery(
    communityPostListOptions({ category: category ?? undefined, page, userId }),
  )
  const pinnedQuery = useQuery(communityPostListOptions({ userId }))
  const hasData = Boolean(postsQuery.data && pinnedQuery.data)
  const isLoading =
    !hasData && (postsQuery.isPending || pinnedQuery.isPending)
  const hasError = postsQuery.isError || pinnedQuery.isError
  const posts = useMemo(() => {
    if (!postsQuery.data || !pinnedQuery.data) {
      return []
    }

    return [
      ...pinnedQuery.data.content.filter((post) => post.pinned),
      ...postsQuery.data.content.filter((post) => !post.pinned),
    ]
  }, [postsQuery.data, pinnedQuery.data])

  const retry = () => {
    // 전체글 첫 페이지는 두 observer가 같은 요청을 공유한다.
    void Promise.all([
      postsQuery.refetch({ cancelRefetch: false }),
      pinnedQuery.refetch({ cancelRefetch: false }),
    ])
  }

  return {
    posts,
    totalPages: postsQuery.data?.totalPages ?? 0,
    hasData,
    isLoading,
    isFetching: postsQuery.isFetching || pinnedQuery.isFetching,
    loadError: hasError
      ? hasData
        ? '목록을 갱신하지 못했습니다. 이전 데이터를 표시합니다.'
        : '게시글을 불러오지 못했습니다.'
      : null,
    retry,
  }
}
