import { apiClient } from "@/shared/api";

import type { TypingProblem } from "../model/types";

export const getProblems = async (): Promise<TypingProblem[]> => {
  const response = await apiClient.get<TypingProblem[]>("/admin/typing/problems");
  return response.data;
}

export const getProblemsForPractice = async (type: string):Promise<TypingProblem[]> => {
  const response = await apiClient.get<TypingProblem[]>('/typing/problems/practice', {
    params: { type }
  });
  return response.data;
}
