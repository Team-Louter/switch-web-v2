import { apiClient } from '@/shared/api'

import type { ReadAllNotificationsResponse } from '../model/types'

export async function readNotification(notificationId: number): Promise<void> {
  await apiClient.put(`/in-app-notifications/${notificationId}/read`)
}

export async function unreadNotification(
  notificationId: number,
): Promise<void> {
  await apiClient.put(`/in-app-notifications/${notificationId}/unread`)
}

export async function readAllNotifications(): Promise<ReadAllNotificationsResponse> {
  const response = await apiClient.put<ReadAllNotificationsResponse>(
    '/in-app-notifications/read-all',
  )

  return response.data
}
