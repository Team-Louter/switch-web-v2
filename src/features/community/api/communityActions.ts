import type { CommentResponse, PostResponse } from '@/entities/community'
import { apiClient } from '@/shared/api'

import type { CreateCommentRequest, CreatePostRequest } from '../model/types'

export async function createPost(
  request: CreatePostRequest,
): Promise<PostResponse> {
  const response = await apiClient.post<PostResponse>('/posts', request)

  return response.data
}

export async function togglePostHeart(postId: number): Promise<void> {
  await apiClient.post(`/posts/${postId}/heart`)
}

export async function createComment(
  postId: number,
  request: CreateCommentRequest,
): Promise<CommentResponse> {
  const response = await apiClient.post<CommentResponse>(
    `/posts/${postId}/comments`,
    request,
  )

  return response.data
}
