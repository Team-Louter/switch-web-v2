export type MemberRole = 'LEADER' | 'MENTOR' | 'MENTEE' | 'STUDENT'

export interface Profile {
  userId: number
  userName: string
  userEmail: string
  grade: number
  classRoom: number
  number: number
  profileImageUrl: string
  majors: string[]
  githubUrl: string
  linkedinUrl: string
  role: MemberRole
  postCount: number
  commentCount: number
  likedPostCount: number
  receivedLikeCount: number
}
