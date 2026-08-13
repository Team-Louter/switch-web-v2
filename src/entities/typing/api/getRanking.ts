import { apiClient } from "@/shared/api";
import type { RankingList } from "../model/types";

export const getRankingList = async (type: string):Promise<RankingList> => {
  const response = await apiClient.get<RankingList>(`/typing/results/rankings/${type}`);
  return response.data;
}