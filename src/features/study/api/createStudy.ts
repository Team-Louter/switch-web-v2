import { apiClient } from '@/shared/api'
import { queryClient } from '@/shared/lib/queryClient'
import { studyQueryKeys } from '@/entities/study'

import type { CreateStudyRequest, StudyRecord } from '@/entities/study'

export const createStudy = async (data: CreateStudyRequest): Promise<void> => {
  await apiClient.post<void>('/studies', data);
  await queryClient.invalidateQueries({ queryKey: studyQueryKeys.all })
}

export const modifyStudy = async (studyId: number, data: CreateStudyRequest): Promise<void> => {
  await apiClient.put<StudyRecord>(`/studies/${studyId}`, data);
  await queryClient.invalidateQueries({ queryKey: studyQueryKeys.all })
}
