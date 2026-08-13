import { apiClient } from "@/shared/api"

export const updateProblem = async (problemId: number, problemType: string, content: string):Promise<void> => {
  await apiClient.put<void>(`/admin/typing/problems/${problemId}`, { problemType, content });
}
