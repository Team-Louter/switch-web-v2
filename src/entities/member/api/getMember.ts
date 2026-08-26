import { apiClient } from "@/shared/api";
import type { CurrentMember, Member } from "../model/types";

export const getMember = async (): Promise<Member[]> => {
  const response = await apiClient.get<Member[]>('/members');
  console.log(response.data);
  return response.data;
}

export const getCurrentMember = async (): Promise<CurrentMember> => {
  const response = await apiClient.get<CurrentMember>('/me');

  return response.data;
}
