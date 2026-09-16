export type PostCategory =
  | 'NOTICE'
  | 'FREE'
  | 'ASSIGNMENT'
  | 'INFORMATION'
  | 'ROADMAP'
  | 'CONTEST'
  | 'QNA'

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
  tag?: string
}
