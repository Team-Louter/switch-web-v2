import { apiClient } from "@/shared/api";
import type { Round } from "../model/types";

export const startRound = async (type: string):Promise<Round> => {
  const response = await apiClient.post<Round>(`/typing/rounds/${type}`);
  return response.data
}