import { apiClient } from '@/shared/api'

import type { StudyResponse } from '../model/types'

export const getAllTotalStudies = async (): Promise<StudyResponse[]> => {
  const response = await apiClient.get<StudyResponse[]>('/club-report')
  return response.data
}

export const getTotalStudy = async (
  clubReportId: number,
): Promise<StudyResponse> => {
  const response = await apiClient.get<StudyResponse>(
    `/club-report/${clubReportId}`,
  )
  return response.data
}
