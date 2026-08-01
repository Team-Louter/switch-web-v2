import { apiClient } from '@/shared/api'

import type { StudyRecord } from '../model/types'

export const getAllStudies = async (): Promise<StudyRecord[]> => {
  const response = await apiClient.get<StudyRecord[]>('/management/studies')
  console.log('Fetched all studies:', response.data)
  return response.data
}
