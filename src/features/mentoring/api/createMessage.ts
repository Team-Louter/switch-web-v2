import { apiClient } from '@/shared/api'
import { mentoringQueryKeys } from '@/entities/mentoring'
import { queryClient } from '@/shared/lib/queryClient'
import type { CreateMessageRequest, MentoringMessage } from '@/entities/mentoring'

/**
 * 질문에 메시지를 남긴다.
 *
 * @param data 질문 아이디, 내용, 첨부파일
 */
export const createMessage = async (
  data: CreateMessageRequest,
): Promise<MentoringMessage> => {
  const response = await apiClient.post<MentoringMessage>(
    '/mentoring/messages',
    data,
  )
  await queryClient.invalidateQueries({ queryKey: mentoringQueryKeys.all })
  return response.data
}
