import type { ProfileAvatarEquippedItems } from '@/shared/ui'

export type MemberRole = 'LEADER' | 'MENTOR' | 'MENTEE' | 'STUDENT'
export type AdminMemberRole = MemberRole

export interface CurrentMember {
  userId: number
  role: MemberRole
  profileImageUrl?: string
}

export interface Member {
  userId: number
  userName: string
  profileImageUrl: string
  majors: string[]
  role: MemberRole
  generation: number
  githubUrl: string
  linkedinUrl: string
  studentId: number
  grade: number
  classRoom: number
  number: number
  userEmail: string
  equippedItems?: ProfileAvatarEquippedItems
}

export type AdminMemberResponse = {
  userId: number
  userName: string
  profileImageUrl?: string
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
