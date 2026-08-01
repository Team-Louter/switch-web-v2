import { apiClient } from '@/shared/api'

import type { StudyStatus } from '../model/types'

export const getWeekStatus = async (
  year: number,
  month: number,
  weekNumber: number,
): Promise<StudyStatus[]> => {
  console.log(`Fetching study statuses for Year: ${year}, Month: ${month}, Week: ${weekNumber}`)
  const response = await apiClient.get<StudyStatus[]>('/management/studies/statuses', {
      params: { year, month, weekNumber },
    },
  )

  return response.data
}
