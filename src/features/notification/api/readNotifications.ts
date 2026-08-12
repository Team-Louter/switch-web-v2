import { apiClient } from '@/shared/api'

export async function readNotification(notificationId: number): Promise<void> {
  await apiClient.put(`/in-app-notifications/${notificationId}/read`)
}

export async function readAllNotifications(
  notificationIds: number[],
): Promise<void> {
  await Promise.all(notificationIds.map(readNotification))
}
