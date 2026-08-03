import { apiClient } from '@/shared/api'

import type { StudyRecord } from '../model/types'

export const getAllStudies = async (): Promise<StudyRecord[]> => {
  const response = await apiClient.get<StudyRecord[]>('/management/studies')
  console.log('Fetched all studies:', response.data)
  return response.data
}

export const getStudy = async (year: number, month: number, weekNumber: number): Promise<StudyRecord> => {
  const response = await apiClient.get<StudyRecord>('/studies/me/study', {
    params: { year, month, weekNumber },
  })
  console.log(`Fetched study for Year: ${year}, Month: ${month}, Week: ${weekNumber}`, response.data)
  return response.data
}
