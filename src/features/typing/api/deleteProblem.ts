import { apiClient } from "@/shared/api"

export const deleteProblem = async (problemId: number):Promise<void> => {
  await apiClient.delete<void>(`/admin/typing/problems/${problemId}`);
}