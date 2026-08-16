import { apiRequest } from '@/shared/api'

export type MentoringQuestionStatus = 'PAUSED' | 'ACTIVE' | 'DONE'
export type MentoringMemberRole = 'LEADER' | 'MENTOR' | 'MENTEE' | 'STUDENT'
export type MentoringFileTargetType = 'QUESTION' | 'MESSAGE'
export type AdminMentoringState = 'ACTIVE' | 'DELAYED' | 'INACTIVE'
export type AdminMentoringMajor =
  | 'BACKEND'
  | 'FRONTEND'
  | 'DESIGN'
  | 'IOS'
  | 'ANDROID'
  | 'SECURITY'
  | 'GAME'
  | 'AI'
  | 'EMBEDDED'

export type MentoringRequest = {
  mentoringName: string
  memberIds?: number[]
}

export type MentoringResponse = {
  mentoringId: number
  mentoringName: string
  createdAt: string
}

export type MentoringFileRequest = {
  targetType?: MentoringFileTargetType
  targetId?: number
  fileUrl?: string
  fileName?: string
  fileType?: string
  fileSize?: number
}

export type MentoringFileResponse = MentoringFileRequest & {
  fileId?: number
  createdAt?: string
}

export type MentoringQuestionResponse = {
  questionId: number
  mentoringId: number
  userId: number
  userName?: string
  profileImageUrl?: string
  status: MentoringQuestionStatus
  title: string
  content: string
  files?: MentoringFileResponse[]
  createdAt: string
}

export type MentoringMessageResponse = {
  messageId: number
  questionId: number
  userId: number
  userName?: string
  profileImageUrl?: string
  content: string
  files?: MentoringFileResponse[]
  createdAt: string
}

export type MentoringMemberResponse = {
  memberId: number
  mentoringId: number
  userId: number
  role: MentoringMemberRole
}

export type CreateQuestionRequest = {
  mentoringId: number
  title: string
  content: string
  files?: MentoringFileRequest[]
}

export type UpdateQuestionRequest = {
  title: string
  content: string
  files?: MentoringFileRequest[]
}

export type CreateMessageRequest = {
  questionId: number
  content: string
  files?: MentoringFileRequest[]
}

export type UpdateMessageRequest = {
  content: string
  files?: MentoringFileRequest[]
}

export type AdminMentoringOverviewResponse = {
  attentionMentors: number
  waitingQuestions: number
  progressQuestions: number
  completedQuestions: number
}

export type AdminMentoringQuestion = {
  questionId: number
  title: string
  writerId: number
  writerName: string
  writerProfileImageUrl?: string
  createdAt: string
  lastAnsweredAt?: string
  status: MentoringQuestionStatus
}

export type AdminMentoringMentorResponse = {
  mentorId: number
  mentorName: string
  profileImageUrl?: string
  majors: AdminMentoringMajor[]
  allQuestions: number
  waitingAnswers: number
  recentActivity?: string
  state: AdminMentoringState
}

export type AdminMentoringMentorDetailResponse =
  AdminMentoringMentorResponse & {
    questions: AdminMentoringQuestion[]
  }

export type AdminMentoringQuestionDetailResponse = {
  question: MentoringQuestionResponse
  messages: MentoringMessageResponse[]
}

export type AdminMentorQuery = {
  mentorName?: string
  state?: AdminMentoringState
}

export type AdminMentorDetailQuery = {
  questionTitle?: string
  status?: MentoringQuestionStatus
}

export const getAdminMentoringOverview = () =>
  apiRequest<AdminMentoringOverviewResponse>('/admin/mentoring/overview')

export const getAdminMentors = (query?: AdminMentorQuery) =>
  apiRequest<AdminMentoringMentorResponse[]>('/admin/mentoring/mentors', {
    query,
  })

export const getAdminMentorDetail = (
  mentorId: number,
  query?: AdminMentorDetailQuery,
) =>
  apiRequest<AdminMentoringMentorDetailResponse>(
    `/admin/mentoring/mentors/${mentorId}`,
    {
      query,
    },
  )

export const getAdminQuestionDetail = (questionId: number) =>
  apiRequest<AdminMentoringQuestionDetailResponse>(
    `/admin/mentoring/questions/${questionId}`,
  )

export const getMentorings = () =>
  apiRequest<MentoringResponse[]>('/mentoring')

export const createMentoring = (body: MentoringRequest) =>
  apiRequest<MentoringResponse>('/mentoring', {
    body,
    method: 'POST',
  })

export const updateMentoring = (
  mentoringId: number,
  body: MentoringRequest,
) =>
  apiRequest<MentoringResponse>(`/mentoring/${mentoringId}`, {
    body,
    method: 'PUT',
  })

export const deleteMentoring = (mentoringId: number) =>
  apiRequest<void>(`/mentoring/${mentoringId}`, {
    method: 'DELETE',
  })

export const getQuestions = () =>
  apiRequest<MentoringQuestionResponse[]>('/mentoring/questions')

export const getQuestion = (questionId: number) =>
  apiRequest<MentoringQuestionResponse>(`/mentoring/questions/${questionId}`)

export const createQuestion = (body: CreateQuestionRequest) =>
  apiRequest<MentoringQuestionResponse>('/mentoring/questions', {
    body,
    method: 'POST',
  })

export const updateQuestion = (
  questionId: number,
  body: UpdateQuestionRequest,
) =>
  apiRequest<MentoringQuestionResponse>(`/mentoring/questions/${questionId}`, {
    body,
    method: 'PUT',
  })

export const deleteQuestion = (questionId: number) =>
  apiRequest<void>(`/mentoring/questions/${questionId}`, {
    method: 'DELETE',
  })

export const updateQuestionStatus = (
  questionId: number,
  status: MentoringQuestionStatus,
) =>
  apiRequest<void>(`/mentoring/questions/${questionId}/status`, {
    method: 'PATCH',
    query: {
      status,
    },
  })

export const getMessages = () =>
  apiRequest<MentoringMessageResponse[]>('/mentoring/messages')

export const getMessage = (messageId: number) =>
  apiRequest<MentoringMessageResponse>(`/mentoring/messages/${messageId}`)

export const createMessage = (body: CreateMessageRequest) =>
  apiRequest<MentoringMessageResponse>('/mentoring/messages', {
    body,
    method: 'POST',
  })

export const updateMessage = (
  messageId: number,
  body: UpdateMessageRequest,
) =>
  apiRequest<MentoringMessageResponse>(`/mentoring/messages/${messageId}`, {
    body,
    method: 'PUT',
  })

export const deleteMessage = (messageId: number) =>
  apiRequest<void>(`/mentoring/messages/${messageId}`, {
    method: 'DELETE',
  })

export const getMentoringMembers = (
  mentoringId: number,
  role: MentoringMemberRole,
) =>
  apiRequest<MentoringMemberResponse[]>(`/mentoring/${mentoringId}/members`, {
    query: {
      role,
    },
  })

export const getQuestionsByMentee = (
  mentoringId: number,
  userId: number,
) =>
  apiRequest<MentoringQuestionResponse[]>(
    `/mentoring/questions/${mentoringId}/mentees/${userId}/questions`,
  )
