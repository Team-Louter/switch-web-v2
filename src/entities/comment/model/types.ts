export interface Comment {
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

export interface CreateCommentRequest {
  content: string
  isAnonymous: boolean
  parentId?: number
}
