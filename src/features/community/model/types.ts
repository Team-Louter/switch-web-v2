import type { PostCategory, PostTag } from '@/entities/community'

export interface PostFileRequest {
  fileUrl: string
  fileName: string
  fileType: string
  fileSize: number
}

export interface CreatePostRequest {
  title: string
  content: string
  isAnonymous: boolean
  category: PostCategory
  tag?: PostTag
  files: PostFileRequest[]
}

export interface CreateCommentRequest {
  content: string
  isAnonymous: boolean
  parentId?: number
}

export interface UpdateCommentRequest {
  content: string
}
