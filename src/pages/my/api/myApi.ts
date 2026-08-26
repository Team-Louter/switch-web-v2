import { apiClient } from '@/shared/api'

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

export type MyPostResponse = Record<string, unknown>

export type PageResponse<T> = {
  content?: T[]
  numberOfElements?: number
  totalElements?: number
}

const defaultPageable: Required<Pick<PageableQuery, 'page' | 'size'>> = {
  page: 0,
  size: 20,
}

export const getMyPosts = async (
  pageable: PageableQuery = defaultPageable,
) => {
  const response = await apiClient.get<PageResponse<MyPostResponse>>(
    '/me/posts',
    {
      params: {
        ...defaultPageable,
        ...pageable,
      },
    },
  )

  return response.data
}

export const getMyLikedPosts = async (
  pageable: PageableQuery = defaultPageable,
) => {
  const response = await apiClient.get<PageResponse<MyPostResponse>>(
    '/me/hearts',
    {
      params: {
        ...defaultPageable,
        ...pageable,
      },
    },
  )

  return response.data
}

export const getMyComments = async (
  pageable: PageableQuery = defaultPageable,
) => {
  const response = await apiClient.get<PageResponse<MyPostResponse>>(
    '/me/comments',
    {
      params: {
        ...defaultPageable,
        ...pageable,
      },
    },
  )

  return response.data
}

export const getMyPoint = async () => {
  const response = await apiClient.get<number>('/me/points')

  return response.data
}

export const getMyReceivedLikeCount = async () => {
  const response = await apiClient.get<number>('/me/hearts/received')

  return response.data
}
