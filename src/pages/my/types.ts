export type MyActivityTabId = 'posts' | 'comments' | 'likes'

export type MyProfile = {
  name: string
  classInfo: string
  role: string
  email: string
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
  id: number
  category: string
  title: string
  author: string
  createdAt: string
  likes: number
  comments: number
  views: number
  commentPreview?: string
}
