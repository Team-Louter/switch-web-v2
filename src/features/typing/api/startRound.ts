import type { Round } from '@/entities/typing'
import { apiClient } from '@/shared/api'

export const startRound = async (type: string): Promise<Round> => {
  const response = await apiClient.post<Round>(`/typing/rounds/${type}`)
  return response.data
}
