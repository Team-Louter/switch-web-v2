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

export const managedMemberList: ManagedMember[] = [
  {
    id: 'member-1',
    name: '이도연',
    classInfo: '1학년 4반 2번',
    role: 'leader',
    email: 'doyeon@dgsw.hs.kr',
  },
  {
    id: 'member-2',
    name: '최현수',
    classInfo: '1학년 3반 16번',
    role: 'mentee',
    email: 'hyunsu@dgsw.hs.kr',
  },
  {
    id: 'member-3',
    name: '이다연',
    classInfo: '1학년 3반 16번',
    role: 'mentee',
    email: 'dayeon@dgsw.hs.kr',
  },
  {
    id: 'member-4',
    name: '전수안',
    classInfo: '1학년 3반 16번',
    role: 'mentee',
    email: 'suan@dgsw.hs.kr',
  },
  {
    id: 'member-5',
    name: '김이박이름',
    classInfo: '1학년 3반 16번',
    role: 'mentee',
    email: 'member@dgsw.hs.kr',
  },
]
