import { apiClient } from '@/shared/api'
import { notificationQueryKeys } from '@/entities/notification'
import { queryClient } from '@/shared/lib/queryClient'

export async function deleteNotification(
  notificationId: number,
): Promise<void> {
  await apiClient.delete(`/in-app-notifications/${notificationId}`)
  await queryClient.invalidateQueries({ queryKey: notificationQueryKeys.all })
}
