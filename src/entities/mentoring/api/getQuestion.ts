import { apiClient } from '@/shared/api'

import type { MentoringQuestion } from '../model/types'

/**
 * 볼 수 있는 질문을 모두 조회한다.
 *
 * 서버에 방 단위 조회 파라미터가 없어 mentoringId 기준 분류는 화면에서 처리한다.
 */
export const getQuestions = async (): Promise<MentoringQuestion[]> => {
  const response = await apiClient.get<MentoringQuestion[]>(
    '/mentoring/questions',
  )
  return response.data
}
