import { apiClient } from '@/shared/api'

import type { CreateStudyRequest } from '../model/types'

export const createStudy = async (data: CreateStudyRequest): Promise<void> => {
  await apiClient.post<void>('/studies', data);
}
