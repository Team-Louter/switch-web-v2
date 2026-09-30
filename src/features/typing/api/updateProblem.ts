import { apiClient } from "@/shared/api"
import { typingQueryKeys } from '@/entities/typing'
import { queryClient } from '@/shared/lib/queryClient'

export const updateProblem = async (problemId: number, problemType: string, content: string):Promise<void> => {
  await apiClient.put<void>(`/admin/typing/problems/${problemId}`, { problemType, content });
  await queryClient.invalidateQueries({ queryKey: typingQueryKeys.problemsRoot })
}
