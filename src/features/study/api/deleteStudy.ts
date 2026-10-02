import { apiClient } from "@/shared/api";
import { studyQueryKeys } from '@/entities/study'
import { queryClient } from '@/shared/lib/queryClient'

export const deleteStudy = async (studyId: number): Promise<void> => {
  await apiClient.delete(`/studies/${studyId}`);
  await queryClient.invalidateQueries({ queryKey: studyQueryKeys.all })
}
