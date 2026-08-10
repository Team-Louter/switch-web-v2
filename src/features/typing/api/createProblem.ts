import { apiClient } from "@/shared/api"

export const createProblem = async (problemType: string, content: string):Promise<void> => {
  await apiClient.post('/admin/typing/problems', { problemType, content });
}
