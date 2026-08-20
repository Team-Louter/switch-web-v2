export type MentorStatus = '원활' | '답변 지연' | '비활성'

export type QuestionStatus = '대기' | '진행' | '완료'

export type MentorSummary = {
  id: number
  mentorId: number
  name: string
  role: string
  profileImageUrl?: string
  recentActivityOrder: number
  totalQuestions: string
  pendingQuestions: string
  recentActivity: string
  status: MentorStatus
}

export type QuestionSummary = {
  id: number
  mentorId: number
  userId: number
  title: string
  content: string
  mentee: string
  profileImageUrl?: string
  createdAtOrder: number
  createdAt: string
  lastRepliedAt: string
  status: QuestionStatus
}

export type ChatMessageSummary = {
  id: number
  questionId: number
  userId: number
  authorName?: string
  profileImageUrl?: string
  content: string
  createdAt: string
}
