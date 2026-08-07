export type MentorStatus = '원활' | '답변 지연' | '비활성'

export type QuestionStatus = '대기' | '진행' | '완료'

export type MentorSummary = {
  id: number
  name: string
  role: string
  recentActivityOrder: number
  totalQuestions: string
  pendingQuestions: string
  recentActivity: string
  status: MentorStatus
}

export type QuestionSummary = {
  id: number
  title: string
  mentee: string
  createdAtOrder: number
  createdAt: string
  lastRepliedAt: string
  status: QuestionStatus
}
