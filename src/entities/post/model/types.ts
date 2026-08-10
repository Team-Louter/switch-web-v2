import type { PostCategory, PostTag } from '@/shared/constants/community'

export interface PostFile {
  fileId: number
  fileUrl: string
  fileName: string
  fileType: string
  fileSize: number
  createdAt: string
}

export interface PostFileRequest {
  fileUrl: string
  fileName: string
  fileType: string
  fileSize: number
}

export interface Post {
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
  files?: PostFile[]
}

/** 서버 Page<PostResponse> 응답 중 화면에서 사용하는 값만 정의 */
export interface PostPage {
  content: Post[]
  totalElements: number
  totalPages: number
  number: number
  size: number
  first: boolean
  last: boolean
  empty: boolean
}

export interface PostRequest {
  title: string
  content: string
  isAnonymous: boolean
  category: PostCategory
  tag?: PostTag
  files?: PostFileRequest[]
}

export interface PostPageParams {
  page: number
  size: number
}
