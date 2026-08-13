import { apiClient } from '@/shared/api'

export async function deleteNotification(
  notificationId: number,
): Promise<void> {
  await apiClient.delete(`/in-app-notifications/${notificationId}`)
}
