import { apiRequest } from '@/shared/api'

export type ProfileMajor =
  | 'AI'
  | 'ANDROID'
  | 'BACKEND'
  | 'DESIGN'
  | 'EMBEDDED'
  | 'FRONTEND'
  | 'GAME'
  | 'IOS'
  | 'SECURITY'

export type ProfileRole = 'LEADER' | 'MENTEE' | 'MENTOR' | 'STUDENT'

export type UpdateProfileRequest = {
  profileImageUrl?: string
  userName?: string
  studentId?: number
  majors?: ProfileMajor[]
  githubId?: string
  linkedinId?: string
}

export type ProfileResponse = {
  userId: number
  userName: string
  userEmail: string
  grade: number
  classRoom: number
  number: number
  profileImageUrl?: string
  majors?: ProfileMajor[]
  githubUrl?: string
  linkedinUrl?: string
  role: ProfileRole
  postCount: number
  commentCount: number
  likedPostCount: number
  receivedLikeCount: number
}

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

export const getMyProfile = () => apiRequest<ProfileResponse>('/me')

export const updateMyProfile = (body: UpdateProfileRequest) =>
  apiRequest<ProfileResponse>('/me/profile', {
    body,
    method: 'PUT',
  })

export const sendWithdrawalVerificationCode = () =>
  apiRequest<string>('/me/withdrawal')

export const verifyWithdrawalCode = (inputCode: string) =>
  apiRequest<string>('/me/withdrawal/verify', {
    query: {
      inputCode,
    },
  })

export const getMyPosts = (pageable: PageableQuery = defaultPageable) =>
  apiRequest<PageResponse<MyPostResponse>>('/me/posts', {
    query: {
      ...defaultPageable,
      ...pageable,
    },
  })

export const getMyLikedPosts = (pageable: PageableQuery = defaultPageable) =>
  apiRequest<PageResponse<MyPostResponse>>('/me/hearts', {
    query: {
      ...defaultPageable,
      ...pageable,
    },
  })

export const getMyComments = (pageable: PageableQuery = defaultPageable) =>
  apiRequest<PageResponse<MyPostResponse>>('/me/comments', {
    query: {
      ...defaultPageable,
      ...pageable,
    },
  })

export const getMyReceivedLikeCount = () =>
  apiRequest<number>('/me/hearts/received')
