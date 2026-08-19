import type { ProfileRole } from '@/entities/profile'

export type { ProfileMajor } from '@/entities/profile'

export type MyActivityTabId = 'posts' | 'comments' | 'likes'

export type MyProfile = {
  name: string
  classInfo: string
  majors: string
  email: string
  role?: ProfileRole
  imageUrl?: string
}

export type MyStat = {
  id: 'point' | 'badge' | 'view'
  label: string
  value: string
}

export type MyActivityTab = {
  id: MyActivityTabId
  label: string
  count: number
}

export type MyPost = {
  id: string
  category: string
  title: string
  author: string
  createdAt: string
  likes: number
  comments: number
  views: number
  commentPreview?: string
}
