import { apiClient } from '@/shared/api'
import type { Comment, CreateCommentRequest } from '@/entities/comment'

/**
 * 댓글 또는 답글을 작성한다. (parentId가 있으면 답글)
 *
 * @param postId 게시글 id
 * @param data 내용 / 익명 여부 / 부모 댓글 id
 */
export const createComment = async (
  postId: number,
  data: CreateCommentRequest,
): Promise<Comment> => {
  const response = await apiClient.post<Comment>(
    `/posts/${postId}/comments`,
    data,
  )
  return response.data
}

/**
 * 댓글을 삭제한다.
 *
 * @param postId 게시글 id
 * @param commentId 댓글 id
 */
export const deleteComment = async (
  postId: number,
  commentId: number,
): Promise<void> => {
  await apiClient.delete<void>(`/posts/${postId}/comments/${commentId}`)
}
