export type ManagedMemberRole = 'leader' | 'mentor' | 'mentee'

export type ManagedMember = {
  id: string
  name: string
  classInfo: string
  role: ManagedMemberRole
  email: string
}

export type MemberConfirmAction = 'mentor' | 'leader' | 'remove'

export const memberRoleLabel: Record<ManagedMemberRole, string> = {
  leader: '부장 (Leader)',
  mentor: '멘토 (Mentor)',
  mentee: '멘티 (Mentee)',
}

export const memberActionLabel: Record<MemberConfirmAction, string> = {
  mentor: '멘토',
  leader: '부장',
  remove: '동아리에서 퇴출',
}

export const memberActionCompleteText: Record<MemberConfirmAction, string> = {
  mentor: '멘토로 지정했습니다',
  leader: '부장으로 지정했습니다',
  remove: '동아리에서 퇴출했습니다',
}

export const managedMemberList: ManagedMember[] = []
