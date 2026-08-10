import { apiClient } from '@/shared/api'

import type { Comment } from '../model/types'

/**
 * 게시글의 최상위 댓글 목록을 가져온다.
 *
 * @param postId 게시글 id
 */
export const getRootComments = async (postId: number): Promise<Comment[]> => {
  const response = await apiClient.get<Comment[]>(`/posts/${postId}/comments`)
  return response.data
}

/**
 * 특정 댓글의 답글 목록을 가져온다.
 *
 * @param postId 게시글 id
 * @param commentId 부모 댓글 id
 */
export const getReplies = async (
  postId: number,
  commentId: number,
): Promise<Comment[]> => {
  const response = await apiClient.get<Comment[]>(
    `/posts/${postId}/comments/${commentId}/replies`,
  )
  return response.data
}
