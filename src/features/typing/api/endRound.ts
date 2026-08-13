import { apiClient } from '@/shared/api'

export const endRound = async (roundId: number, accuracy: number, elapsedTime: number, averageSpeed: number): Promise<void> => {
  await apiClient.post<void>(`/typing/rounds/${roundId}/complete`, {
    accuracy, elapsedTime, averageSpeed,
  })
}
