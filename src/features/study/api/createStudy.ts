import { apiClient } from '@/shared/api'

import type { CreateStudyRequest } from '../model/types'

export const createStudy = async (data: CreateStudyRequest) => {
  await apiClient.post('/studies', data)
}
