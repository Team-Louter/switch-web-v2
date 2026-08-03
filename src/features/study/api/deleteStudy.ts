import { apiClient } from "@/shared/api";

export const deleteStudy = async (studyId: number): Promise<void> => {
  await apiClient.delete(`/studies/${studyId}`);
}