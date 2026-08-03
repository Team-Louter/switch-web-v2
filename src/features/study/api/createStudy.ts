import { apiClient } from '@/shared/api'

import type { CreateStudyRequest, StudyRecord } from '../model/types'

export const createStudy = async (data: CreateStudyRequest): Promise<void> => {
  await apiClient.post<void>('/studies', data);
}

export const modifyStudy = async (studyId: number, data: CreateStudyRequest): Promise<void> => {
  await apiClient.put<StudyRecord>(`/studies/${studyId}`, data);
}
