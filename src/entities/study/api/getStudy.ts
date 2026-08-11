import { apiClient } from '@/shared/api'

import type { StudyRecord } from '../model/types'

export const getAllStudies = async (): Promise<StudyRecord[]> => {
  const response = await apiClient.get<StudyRecord[]>('/management/studies')
  return response.data
}

export const getStudy = async (year: number, month: number, weekNumber: number): Promise<StudyRecord> => {
  const response = await apiClient.get<StudyRecord>('/studies/me/study', {
    params: { year, month, weekNumber },
  })
  return response.data
}
