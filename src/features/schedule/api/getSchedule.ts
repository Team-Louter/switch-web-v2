import { apiClient } from "@/shared/api"
import type { Schedule } from "../model/types";

export const getAllSchedules = async (): Promise<Schedule[]> => {
  const response = await apiClient.get<Schedule[]>('/schedules');
  return response.data;
}