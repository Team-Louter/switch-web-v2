import { apiClient } from '@/shared/api'
import { typingQueryKeys } from '@/entities/typing'
import { queryClient } from '@/shared/lib/queryClient'

export const endRound = async (roundId: number, accuracy: number, elapsedTime: number, averageSpeed: number): Promise<void> => {
  await apiClient.post<void>(`/typing/rounds/${roundId}/complete`, {
    accuracy, elapsedTime, averageSpeed,
  })
  await queryClient.invalidateQueries({ queryKey: typingQueryKeys.resultsRoot })
}
