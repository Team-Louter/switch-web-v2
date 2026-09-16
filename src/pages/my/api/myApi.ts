import { apiClient } from '@/shared/api'

import type { PostCategory } from '@/entities/community'

export {
  getMyProfile,
  sendWithdrawalVerificationCode,
  updateMyProfile,
  verifyWithdrawalCode,
} from '@/entities/profile'
export type {
  ProfileResponse,
  ProfileRole,
  UpdateProfileRequest,
} from '@/entities/profile'

type PageableQuery = {
  page?: number
  size?: number
  sort?: string[]
}

// 백엔드 OpenAPI 스펙(MyPostResponse/MyCommentResponse) 기준 응답 타입.
export interface MyPostResponse {
  postId: number
  userId: number
  userName: string
  userProfileImageUrl?: string
  isAnonymous: boolean
  postTitle: string
  postCategory: PostCategory
  viewers: number
  likeCount: number
  commentCount: number
  isHearted: boolean
  createdAt: string
}

export interface MyCommentResponse {
  commentId: number
  commentContent: string
  commentCreatedAt: string
  postId: number
  userId: number
  userName: string
  userProfileImageUrl?: string
  isAnonymous: boolean
  postTitle: string
  postCategory: PostCategory
  viewers: number
  likeCount: number
  isHearted: boolean
  commentCount: number
}

export type PageResponse<T> = {
  content?: T[]
  first?: boolean
  last?: boolean
  number?: number
  numberOfElements?: number
  size?: number
  totalElements?: number
  totalPages?: number
}

const defaultPageable: Required<Pick<PageableQuery, 'page' | 'size'>> = {
  page: 0,
  size: 5,
}

export const getMyPosts = async (
  pageable: PageableQuery = defaultPageable,
  signal?: AbortSignal,
) => {
  const response = await apiClient.get<PageResponse<MyPostResponse>>(
    '/me/posts',
    {
      params: {
        ...defaultPageable,
        ...pageable,
      },
      signal,
    },
  )

  return response.data
}

export const getMyLikedPosts = async (
  pageable: PageableQuery = defaultPageable,
  signal?: AbortSignal,
) => {
  const response = await apiClient.get<PageResponse<MyPostResponse>>(
    '/me/hearts',
    {
      params: {
        ...defaultPageable,
        ...pageable,
      },
      signal,
    },
  )

  return response.data
}

export const getMyComments = async (
  pageable: PageableQuery = defaultPageable,
  signal?: AbortSignal,
) => {
  const response = await apiClient.get<PageResponse<MyCommentResponse>>(
    '/me/comments',
    {
      params: {
        ...defaultPageable,
        ...pageable,
      },
      signal,
    },
  )

  return response.data
}

export const getMyPoint = async (signal?: AbortSignal) => {
  const response = await apiClient.get<number>('/me/points', { signal })

  return response.data
}

export const getMyReceivedLikeCount = async (signal?: AbortSignal) => {
  const response = await apiClient.get<number>('/me/hearts/received', {
    signal,
  })

  return response.data
}
