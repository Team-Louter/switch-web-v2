import { apiClient } from "@/shared/api";

import type { TypingResult } from "../model/types";

export const getPreviousResult = async ():Promise<TypingResult> => {
  const response = await apiClient.get<TypingResult>('/typing/results/previous');
  return response.data
}
