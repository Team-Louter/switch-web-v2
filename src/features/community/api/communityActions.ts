import type { CommentResponse, PostResponse } from '@/entities/community'
import {
  communityActivityQueryKeys,
  invalidateCommunityPostData,
  invalidateCommunityPostLists,
} from '@/entities/community'
import { homePostQueryKeys } from '@/entities/post'
import { profileQueryKeys } from '@/entities/profile'
import { apiClient } from '@/shared/api'
import { queryClient } from '@/shared/lib/queryClient'

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

async function invalidateCommunityWriteViews(postId?: number) {
  const invalidations: Promise<unknown>[] = [
    invalidateCommunityPostLists(),
    queryClient.invalidateQueries({
      queryKey: communityActivityQueryKeys.mine,
    }),
    queryClient.invalidateQueries({ queryKey: profileQueryKeys.meRoot }),
    queryClient.invalidateQueries({ queryKey: homePostQueryKeys.all }),
  ]

  if (postId !== undefined) {
    invalidations.push(invalidateCommunityPostData(postId))
  }

  await Promise.all(invalidations)
}

export async function createPost(
  request: CreatePostRequest,
): Promise<PostResponse> {
  const response = await apiClient.post<PostResponse>('/posts', request)
  await invalidateCommunityWriteViews(response.data.postId)

  return response.data
}

export async function updatePost(
  postId: number,
  request: CreatePostRequest,
): Promise<PostResponse> {
  const response = await apiClient.put<PostResponse>(`/posts/${postId}`, request)
  await invalidateCommunityWriteViews(postId)

  return response.data
}

export async function deletePost(postId: number): Promise<void> {
  await apiClient.delete(`/posts/${postId}`)
  await invalidateCommunityWriteViews(postId)
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
  await invalidateCommunityWriteViews(postId)
}

export async function setPostPinned(
  postId: number,
  pinned: boolean,
): Promise<void> {
  await apiClient.put<void>(`/posts/${postId}/pin`, null, {
    params: { pinned },
  })
  await invalidateCommunityWriteViews(postId)
}

export async function createComment(
  postId: number,
  request: CreateCommentRequest,
): Promise<CommentResponse> {
  const response = await apiClient.post<CommentResponse>(
    `/posts/${postId}/comments`,
    request,
  )
  await invalidateCommunityWriteViews(postId)

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
  await invalidateCommunityWriteViews(postId)

  return response.data
}

export async function deleteComment(
  postId: number,
  commentId: number,
): Promise<void> {
  await apiClient.delete(`/posts/${postId}/comments/${commentId}`)
  await invalidateCommunityWriteViews(postId)
}
