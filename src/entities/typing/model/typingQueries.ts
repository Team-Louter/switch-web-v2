import { queryOptions } from '@tanstack/react-query'

import { getProblems } from '../api/getProblem'
import { getRankingList } from '../api/getRanking'
import { getPreviousResult } from '../api/getResult'
import type { TypingProblemType } from './types'

export const typingQueryKeys = {
  all: ['typing'] as const,
  resultsRoot: ['typing', 'results'] as const,
  previousResult: (userId: number | null) =>
    [...typingQueryKeys.resultsRoot, 'previous-result', userId] as const,
  problemsRoot: ['typing', 'problems'] as const,
  problems: (userId: number | null) =>
    [...typingQueryKeys.problemsRoot, userId] as const,
  rankings: (userId: number | null, type: TypingProblemType) =>
    [...typingQueryKeys.resultsRoot, 'rankings', userId, type] as const,
}

export function typingPreviousResultOptions(userId: number | null) {
  return queryOptions({
    queryKey: typingQueryKeys.previousResult(userId),
    queryFn: getPreviousResult,
  })
}

export function typingProblemsOptions(userId: number | null) {
  return queryOptions({
    queryKey: typingQueryKeys.problems(userId),
    queryFn: getProblems,
  })
}

export function typingRankingOptions(
  userId: number | null,
  type: TypingProblemType,
) {
  return queryOptions({
    queryKey: typingQueryKeys.rankings(userId, type),
    queryFn: () => getRankingList(type),
    enabled: userId !== null,
    staleTime: 10_000,
  })
}
