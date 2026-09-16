import type {
  AdminMemberResponse,
  AdminMemberRole,
  Member,
} from '@/entities/member'

export type ManagedMemberRole = AdminMemberRole

export type ManagedMember = {
  id: number
  name: string
  profileImageUrl?: string
  classInfo: string
  role: ManagedMemberRole
  email: string
}

export type MemberConfirmAction = 'mentor' | 'mentee' | 'leader' | 'remove'

export const memberRoleLabel: Record<ManagedMemberRole, string> = {
  LEADER: '부장 (Leader)',
  MENTOR: '멘토 (Mentor)',
  MENTEE: '멘티 (Mentee)',
  STUDENT: '학생 (Student)',
}

export const memberActionLabel: Record<MemberConfirmAction, string> = {
  mentor: '멘토',
  mentee: '멘티',
  leader: '부장',
  remove: '동아리에서 퇴출',
}

export const memberActionCompleteText: Record<MemberConfirmAction, string> = {
  mentor: '멘토로 지정했습니다',
  mentee: '멘티로 변경했습니다',
  leader: '부장으로 지정했습니다',
  remove: '동아리에서 퇴출했습니다',
}

export const memberActionRoleMap: Record<
  Exclude<MemberConfirmAction, 'remove'>,
  AdminMemberRole
> = {
  mentor: 'MENTOR',
  mentee: 'MENTEE',
  leader: 'LEADER',
}

export const formatManagedMember = (
  member: AdminMemberResponse | Member,
): ManagedMember => ({
  id: member.userId,
  name: member.userName,
  profileImageUrl: member.profileImageUrl,
  classInfo: `${member.grade}학년 ${member.classRoom}반 ${member.number}번`,
  role: member.role,
  email: member.userEmail,
})
