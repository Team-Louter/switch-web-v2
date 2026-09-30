import { apiClient } from '@/shared/api'
import { notificationQueryKeys } from '@/entities/notification'
import { queryClient } from '@/shared/lib/queryClient'

import type { ReadAllNotificationsResponse } from '../model/types'

export async function readNotification(notificationId: number): Promise<void> {
  await apiClient.put(`/in-app-notifications/${notificationId}/read`)
  await queryClient.invalidateQueries({ queryKey: notificationQueryKeys.all })
}

export async function unreadNotification(
  notificationId: number,
): Promise<void> {
  await apiClient.put(`/in-app-notifications/${notificationId}/unread`)
  await queryClient.invalidateQueries({ queryKey: notificationQueryKeys.all })
}

export async function readAllNotifications(): Promise<ReadAllNotificationsResponse> {
  const response = await apiClient.put<ReadAllNotificationsResponse>(
    '/in-app-notifications/read-all',
  )
  await queryClient.invalidateQueries({ queryKey: notificationQueryKeys.all })

  return response.data
}
