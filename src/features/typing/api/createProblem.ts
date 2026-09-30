import { apiClient } from "@/shared/api"
import { typingQueryKeys } from '@/entities/typing'
import { queryClient } from '@/shared/lib/queryClient'

export const createProblem = async (problemType: string, content: string):Promise<void> => {
  await apiClient.post<void>('/admin/typing/problems', { problemType, content });
  await queryClient.invalidateQueries({ queryKey: typingQueryKeys.problemsRoot })
}
