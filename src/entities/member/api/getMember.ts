import { apiClient } from "@/shared/api";
import type { Member } from "../model/types";

export const getMember = async (): Promise<Member[]> => {
  const response = await apiClient.get<Member[]>('/members');
  console.log(response.data);
  return response.data;
}