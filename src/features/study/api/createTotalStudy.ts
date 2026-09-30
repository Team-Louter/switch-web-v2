import { apiClient } from '@/shared/api'
import { studyQueryKeys } from '@/entities/study'
import { queryClient } from '@/shared/lib/queryClient'

import type { StudyRequest, StudyResponse } from '@/entities/study'

export const createTotalStudy = async (
  data: StudyRequest,
): Promise<StudyResponse> => {
  const response = await apiClient.post<StudyResponse>('/club-report', data)
  await queryClient.invalidateQueries({
    queryKey: [...studyQueryKeys.all, 'management'],
  })
  return response.data
}

export const modifyTotalStudy = async (clubReportId: number): Promise<StudyResponse> => {
  const response = await apiClient.post<StudyResponse>(
    `/club-report/${clubReportId}/regenerate`,
  )
  await queryClient.invalidateQueries({ queryKey: ['studies', 'management'] })
  return response.data
}
