import { apiClient } from '@/shared/api'

import type { MentoringMessage } from '../model/types'

/**
 * 멘토링 메시지를 모두 조회한다.
 *
 * 서버에 질문 단위 조회 파라미터가 없어 questionId 기준 분류는 화면에서 처리한다.
 */
export const getMessages = async (): Promise<MentoringMessage[]> => {
  const response = await apiClient.get<MentoringMessage[]>('/mentoring/messages')
  return response.data
}
