import { apiClient } from "@/shared/api";

import type { TypingProblem } from "../model/types";

export const getProblems = async (): Promise<TypingProblem[]> => {
  const response = await apiClient.get("/admin/typing/problems");
  return response.data;
}
