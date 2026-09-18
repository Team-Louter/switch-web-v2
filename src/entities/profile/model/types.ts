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

export type ProfileEquippedItem = {
  displayType?: 'COVER' | 'FRAME'
  imageUrl?: string
  itemId?: number
  itemImageUrl?: string
  itemName?: string
  itemType?: string
  originalImageUrl?: string
  previewImageUrl?: string
  thumbnailUrl?: string
  styleKey?: string
  valueColor?: string
  value_color?: string
  valueImageUrl?: string
  valueText?: string
}

export type ProfileEquippedItems = {
  badge?: ProfileEquippedItem
  border?: ProfileEquippedItem
  nameColor?: ProfileEquippedItem
  title?: ProfileEquippedItem
}

export type ProfileResponse = {
  userId: number
  userName: string
  userEmail: string
  recoveryEmail: string | null
  grade: number
  classRoom: number
  number: number
  studentId?: number | null
  profileImageUrl?: string
  majors?: ProfileMajor[]
  githubUrl?: string
  linkedinUrl?: string
  role: ProfileRole
  postCount: number
  commentCount: number
  likedPostCount: number
  receivedLikeCount?: number
  point?: number
  points?: number
  badgeCount?: number
  equippedItems?: ProfileEquippedItems
  viewCount?: number
  totalViewCount?: number
}
