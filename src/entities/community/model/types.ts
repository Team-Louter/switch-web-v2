export type PostCategory =
  | 'NOTICE'
  | 'FREE'
  | 'ASSIGNMENT'
  | 'INFORMATION'
  | 'ROADMAP'
  | 'CONTEST'
  | 'QNA'

export type PostTag =
  | 'INFO_BACKEND'
  | 'INFO_FRONTEND'
  | 'INFO_DESIGN'
  | 'INFO_AI'
  | 'INFO_ETC'
  | 'INFO_SCHOOL'
  | 'ROADMAP_BACKEND'
  | 'ROADMAP_FRONTEND'
  | 'ROADMAP_ETC'
  | 'HACKATHON'
  | 'IDEA_CONTEST'
  | 'ALGORITHM'
  | 'AI_DATA'
  | 'YOUTH_CONTEST'
  | 'CONTEST_ETC'
  | 'RECRUITMENT'
  | 'Q_BACKEND'
  | 'Q_FRONTEND'
  | 'Q_DESIGN'
  | 'Q_PLANNING'
  | 'Q_ETC'

export interface PostFileResponse {
  fileId: number
  fileUrl: string
  fileName: string
  fileType: string
  fileSize: number
  createdAt: string
}

export interface PostResponse {
  postId: number
  userId: number
  userName: string
  userProfileImageUrl: string
  postTitle: string
  postContent: string
  category: PostCategory
  createdAt: string
  isAnonymous: boolean
  viewers: number
  likeCount: number
  commentCount: number
  isHearted: boolean
  pinned: boolean
  tag?: PostTag
  files?: PostFileResponse[]
}

export interface CommentResponse {
  commentId: number
  userId: number
  userName: string
  userProfileImageUrl: string
  content: string
  depth: number
  createdAt: string
  isAnonymous: boolean
  deleted: boolean
  replyCount: number
}

export interface SortResponse {
  unsorted: boolean
  empty: boolean
  sorted: boolean
}

export interface PageableResponse {
  unpaged: boolean
  pageNumber: number
  paged: boolean
  pageSize: number
  offset: number
  sort: SortResponse
}

export interface PostPageResponse {
  totalElements: number
  totalPages: number
  pageable: PageableResponse
  numberOfElements: number
  first: boolean
  last: boolean
  size: number
  content: PostResponse[]
  number: number
  sort: SortResponse
  empty: boolean
}

export interface GetPostsParams {
  category?: PostCategory
  page?: number
  size?: number
}
