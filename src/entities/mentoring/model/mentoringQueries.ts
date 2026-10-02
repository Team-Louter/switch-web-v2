import { queryOptions } from '@tanstack/react-query'

import { getMentoringMembers, getMentorings } from '../api/getMentoring'
import { getMessages } from '../api/getMessage'
import { getQuestions } from '../api/getQuestion'
import type { MemberRole } from '@/entities/member/model/profile'

export const mentoringQueryKeys = {
  all: ['mentoring'] as const,
  entry: (userId: number | null) =>
    [...mentoringQueryKeys.all, 'entry', userId] as const,
  rooms: (userId: number | null) =>
    [...mentoringQueryKeys.all, 'rooms', userId] as const,
  questions: (userId: number | null) =>
    [...mentoringQueryKeys.all, 'questions', userId] as const,
  roomMembers: (
    userId: number | null,
    mentoringId: number,
    role: MemberRole,
  ) =>
    [...mentoringQueryKeys.all, 'members', userId, mentoringId, role] as const,
  messages: (userId: number | null) =>
    [...mentoringQueryKeys.all, 'messages', userId] as const,
}

export function mentoringRoomsOptions(userId: number | null) {
  return queryOptions({
    queryKey: mentoringQueryKeys.rooms(userId),
    queryFn: getMentorings,
  })
}

export function mentoringQuestionsOptions(userId: number | null) {
  return queryOptions({
    queryKey: mentoringQueryKeys.questions(userId),
    queryFn: getQuestions,
  })
}

export function mentoringRoomMembersOptions(
  userId: number | null,
  mentoringId: number,
  role: MemberRole,
) {
  return queryOptions({
    queryKey: mentoringQueryKeys.roomMembers(userId, mentoringId, role),
    queryFn: () => getMentoringMembers(mentoringId, role),
  })
}

export function mentoringMessagesOptions(userId: number | null) {
  return queryOptions({
    queryKey: mentoringQueryKeys.messages(userId),
    queryFn: getMessages,
    staleTime: 10_000,
  })
}
