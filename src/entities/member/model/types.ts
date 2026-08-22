export type AdminMemberRole = 'LEADER' | 'MENTEE' | 'MENTOR' | 'STUDENT'

export interface Member {
  userId: number
  userName: string
  profileImageUrl: string
  majors: string[]
  role: string
  generation: number
  githubUrl: string
  linkedinUrl: string
  studentId: number
  grade: number
  classRoom: number
  number: number
  userEmail: string
}

export type AdminMemberResponse = {
  userId: number
  userName: string
  grade: number
  classRoom: number
  number: number
  role: AdminMemberRole
  userEmail: string
}

export type GetAdminMembersParams = {
  keyword?: string
}

export type ChangeRoleRequest = {
  userId: number
  role: AdminMemberRole
}

export type QuitMemberRequest = {
  userIds: number[]
}
