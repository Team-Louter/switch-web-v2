import { apiClient } from '@/shared/api'

import type { NotificationResponse } from '../model/types'

export async function getNotifications(): Promise<NotificationResponse[]> {
  const response = await apiClient.get<NotificationResponse[]>(
    '/in-app-notifications',
  )

  return response.data
}
