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
  viewCount?: number
  totalViewCount?: number
}
