import { apiClient } from '@/shared/api'

import type { StudyRequest, StudyResponse } from '../model/types'

export const createTotalStudy = async (
  data: StudyRequest,
): Promise<StudyResponse> => {
  console.log('Creating total study with data:', data)
  const response = await apiClient.post<StudyResponse>('/club-report', data)
  return response.data
}
