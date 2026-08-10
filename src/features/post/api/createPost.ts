import { apiClient } from '@/shared/api'
import type { Post, PostRequest } from '@/entities/post'

/**
 * 게시글을 작성한다.
 *
 * @param data 제목 / 내용 / 카테고리 / 익명 여부
 */
export const createPost = async (data: PostRequest): Promise<Post> => {
  const response = await apiClient.post<Post>('/posts', data)
  return response.data
}

/**
 * 게시글을 수정한다.
 *
 * @param postId 게시글 id
 * @param data 수정할 내용
 */
export const updatePost = async (
  postId: number,
  data: PostRequest,
): Promise<Post> => {
  const response = await apiClient.put<Post>(`/posts/${postId}`, data)
  return response.data
}

/**
 * 게시글을 삭제한다.
 *
 * @param postId 게시글 id
 */
export const deletePost = async (postId: number): Promise<void> => {
  await apiClient.delete<void>(`/posts/${postId}`)
}
