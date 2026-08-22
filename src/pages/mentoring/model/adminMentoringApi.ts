import { apiRequest } from '@/shared/api'

import type {
  MentoringMessageResponse,
  MentoringQuestionResponse,
  MentoringQuestionStatus,
} from './mentoringApi'

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

export type AdminMentoringMentorsResponse = {
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
  AdminMentoringMentorsResponse & {
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

export type CurrentUserProfileResponse = {
  userId: number
}

export const getCurrentUserProfile = () =>
  apiRequest<CurrentUserProfileResponse>('/me')

export const getAdminMentoringOverview = () =>
  apiRequest<AdminMentoringOverviewResponse>('/admin/mentoring/overview')

export const getAdminMentors = (query?: AdminMentorQuery) =>
  apiRequest<AdminMentoringMentorsResponse[]>('/admin/mentoring/mentors', {
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
