export type MemberRole = 'LEADER' | 'MENTOR' | 'MENTEE' | 'STUDENT'

export interface CurrentMember {
  role: MemberRole
}

export interface Member {
  userId: number,
  userName: string,
  profileImageUrl: string,
  majors: string[],
  role: MemberRole,
  generation: number,
  githubUrl: string,
  linkedinUrl: string,
  studentId: number,
  grade: number,
  classRoom: number,
  number: number,
  userEmail: string
}
