import { apiClient } from '@/shared/api'

import type { Post } from '../model/types'

export interface RecentHomePost {
  postId: number
  postTitle: string
  viewers: number
  likeCount?: number
  isHearted?: boolean
}

interface MyPostsResponse {
  content?: RecentHomePost[]
}

export async function getRecentHomePost(): Promise<RecentHomePost | null> {
  const response = await apiClient.get<MyPostsResponse>('/me/posts', {
    params: { page: 0, size: 1 },
  })
  return response.data.content?.[0] ?? null
}

/**
 * 인기글 목록을 조회한다.
 */
export const getHotPosts = async (): Promise<Post[]> => {
  const response = await apiClient.get<Post[]>('/posts/hot')

  return response.data
}
