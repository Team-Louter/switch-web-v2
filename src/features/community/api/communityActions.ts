import type { CommentResponse, PostResponse } from '@/entities/community'
import { invalidateCommunityPostLists } from '@/entities/community'
import { apiClient } from '@/shared/api'

import type {
  CreateCommentRequest,
  CreatePostRequest,
  UpdateCommentRequest,
} from '../model/types'

interface FileUploadResponse {
  url: string
  key: string
  fileName: string
  fileType: string
  fileSize: number
}

export async function createPost(
  request: CreatePostRequest,
): Promise<PostResponse> {
  const response = await apiClient.post<PostResponse>('/posts', request)
  await invalidateCommunityPostLists()

  return response.data
}

export async function updatePost(
  postId: number,
  request: CreatePostRequest,
): Promise<PostResponse> {
  const response = await apiClient.put<PostResponse>(`/posts/${postId}`, request)
  await invalidateCommunityPostLists()

  return response.data
}

export async function deletePost(postId: number): Promise<void> {
  await apiClient.delete(`/posts/${postId}`)
  await invalidateCommunityPostLists()
}

export async function uploadCommunityFile(
  file: File,
): Promise<FileUploadResponse> {
  const formData = new FormData()

  formData.append('file', file)

  const response = await apiClient.post<FileUploadResponse>(
    '/files/upload',
    formData,
    {
      params: { prefix: 'posts' },
    },
  )

  return response.data
}

export async function togglePostHeart(postId: number): Promise<void> {
  await apiClient.post(`/posts/${postId}/heart`)
  await invalidateCommunityPostLists()
}

export async function setPostPinned(
  postId: number,
  pinned: boolean,
): Promise<void> {
  await apiClient.put<void>(`/posts/${postId}/pin`, null, {
    params: { pinned },
  })
  await invalidateCommunityPostLists()
}

export async function createComment(
  postId: number,
  request: CreateCommentRequest,
): Promise<CommentResponse> {
  const response = await apiClient.post<CommentResponse>(
    `/posts/${postId}/comments`,
    request,
  )
  await invalidateCommunityPostLists()

  return response.data
}

export async function updateComment(
  postId: number,
  commentId: number,
  request: UpdateCommentRequest,
): Promise<CommentResponse> {
  const response = await apiClient.put<CommentResponse>(
    `/posts/${postId}/comments/${commentId}`,
    request,
  )

  return response.data
}

export async function deleteComment(
  postId: number,
  commentId: number,
): Promise<void> {
  await apiClient.delete(`/posts/${postId}/comments/${commentId}`)
  await invalidateCommunityPostLists()
}
