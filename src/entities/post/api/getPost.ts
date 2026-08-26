import { apiClient } from '@/shared/api'

import type { Post } from '../model/types'

/**
 * 인기글 목록을 조회한다.
 */
export const getHotPosts = async (): Promise<Post[]> => {
  const response = await apiClient.get<Post[]>('/posts/hot')

  return response.data
}
