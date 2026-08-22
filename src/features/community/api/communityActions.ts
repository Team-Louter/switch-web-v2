import type { CommentResponse, PostResponse } from '@/entities/community'
import { apiClient } from '@/shared/api'

import type { CreateCommentRequest, CreatePostRequest } from '../model/types'

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

  return response.data
}

export async function updatePost(
  postId: number,
  request: CreatePostRequest,
): Promise<PostResponse> {
  const response = await apiClient.put<PostResponse>(`/posts/${postId}`, request)

  return response.data
}

export async function deletePost(postId: number): Promise<void> {
  await apiClient.delete(`/posts/${postId}`)
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
}

export async function setPostPinned(
  postId: number,
  pinned: boolean,
): Promise<void> {
  await apiClient.put<void>(`/posts/${postId}/pin`, null, {
    params: { pinned },
  })
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
