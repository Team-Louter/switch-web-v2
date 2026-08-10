import { apiClient } from '@/shared/api'

/**
 * 게시글 좋아요를 토글한다. (누른 상태면 취소된다)
 *
 * @param postId 게시글 id
 */
export const toggleHeart = async (postId: number): Promise<void> => {
  await apiClient.post<void>(`/posts/${postId}/heart`)
}
