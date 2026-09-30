import { queryOptions } from '@tanstack/react-query'

import {
  getAdminMentorDetail,
  getAdminMentoringOverview,
  getAdminMentors,
  getAdminQuestionDetail,
} from './adminMentoringApi'
import type {
  AdminMentorQuery,
  AdminMentorDetailQuery,
} from './adminMentoringApi'

const ADMIN_MENTORING_QUERY_KEY = ['mentoring', 'admin'] as const

export const adminMentoringQueryKeys = {
  overview: (userId: number | null) =>
    [...ADMIN_MENTORING_QUERY_KEY, 'overview', userId] as const,
  mentors: (
    userId: number | null,
    query: AdminMentorQuery = {},
  ) => [...ADMIN_MENTORING_QUERY_KEY, 'mentors', userId, query] as const,
  mentorDetail: (
    userId: number | null,
    mentorId: number,
    query: AdminMentorDetailQuery = {},
  ) =>
    [...ADMIN_MENTORING_QUERY_KEY, 'mentor', userId, mentorId, query] as const,
  questionDetail: (userId: number | null, questionId: number) =>
    [...ADMIN_MENTORING_QUERY_KEY, 'question', userId, questionId] as const,
}

export function adminMentoringOverviewOptions(userId: number | null) {
  return queryOptions({
    queryKey: adminMentoringQueryKeys.overview(userId),
    queryFn: getAdminMentoringOverview,
    staleTime: 10_000,
  })
}

export function adminMentorsOptions(
  userId: number | null,
  query: AdminMentorQuery = {},
) {
  return queryOptions({
    queryKey: adminMentoringQueryKeys.mentors(userId, query),
    queryFn: () => getAdminMentors(query),
    staleTime: 10_000,
  })
}

export function adminMentorDetailOptions(
  userId: number | null,
  mentorId: number,
  query: AdminMentorDetailQuery = {},
) {
  return queryOptions({
    queryKey: adminMentoringQueryKeys.mentorDetail(userId, mentorId, query),
    queryFn: () => getAdminMentorDetail(mentorId, query),
    staleTime: 10_000,
  })
}

export function adminMentoringQuestionOptions(
  userId: number | null,
  questionId: number,
) {
  return queryOptions({
    queryKey: adminMentoringQueryKeys.questionDetail(userId, questionId),
    queryFn: () => getAdminQuestionDetail(questionId),
    staleTime: 10_000,
  })
}
