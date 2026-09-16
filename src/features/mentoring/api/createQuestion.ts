import { apiClient } from '@/shared/api'
import type {
  CreateQuestionRequest,
  MentoringQuestion,
  QuestionStatus,
} from '@/entities/mentoring'

/**
 * 질문을 생성한다.
 *
 * @param data 질문이 속한 방, 제목, 내용, 첨부파일
 */
export const createQuestion = async (
  data: CreateQuestionRequest,
): Promise<MentoringQuestion> => {
  const response = await apiClient.post<MentoringQuestion>(
    '/mentoring/questions',
    data,
  )
  return response.data
}

/**
 * 질문의 진행 상태를 변경한다.
 *
 * @param questionId 질문 아이디
 * @param status 변경할 상태
 */
export const changeQuestionStatus = async (
  questionId: number,
  status: QuestionStatus,
): Promise<void> => {
  await apiClient.patch<void>(
    `/mentoring/questions/${questionId}/status`,
    undefined,
    { params: { status } },
  )
}

/**
 * 질문을 삭제한다.
 *
 * @param questionId 삭제할 질문 아이디
 */
export const deleteQuestion = async (questionId: number): Promise<void> => {
  await apiClient.delete<void>(`/mentoring/questions/${questionId}`)
}
