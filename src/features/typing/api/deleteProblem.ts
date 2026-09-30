import { apiClient } from "@/shared/api"
import { typingQueryKeys } from '@/entities/typing'
import { queryClient } from '@/shared/lib/queryClient'

export const deleteProblem = async (problemId: number):Promise<void> => {
  await apiClient.delete<void>(`/admin/typing/problems/${problemId}`);
  await queryClient.invalidateQueries({ queryKey: typingQueryKeys.problemsRoot })
}
