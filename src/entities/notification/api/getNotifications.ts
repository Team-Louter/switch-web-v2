import { apiClient } from '@/shared/api'

import type {
  GetNotificationsParams,
  NotificationPageResponse,
} from '../model/types'

export async function getNotifications(
  params: GetNotificationsParams = {},
): Promise<NotificationPageResponse> {
  const response = await apiClient.get<NotificationPageResponse>(
    '/in-app-notifications',
    { params },
  )

  return response.data
}
