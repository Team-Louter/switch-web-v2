import { apiClient } from '@/shared/api'

import type { TypingProblemType, TypingRankingBoard } from '../model/types'

/**
 * 문제 유형별 타자 랭킹을 조회한다.
 */
export const getTypingRanking = async (
  problemType: TypingProblemType,
): Promise<TypingRankingBoard> => {
  const response = await apiClient.get<TypingRankingBoard>(
    `/typing/results/rankings/${problemType}`,
  )

  return response.data
}
