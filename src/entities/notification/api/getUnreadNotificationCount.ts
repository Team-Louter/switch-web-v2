import { apiClient } from '@/shared/api'

import type { UnreadNotificationCountResponse } from '../model/types'

export async function getUnreadNotificationCount(): Promise<number> {
  const response = await apiClient.get<UnreadNotificationCountResponse>(
    '/in-app-notifications/unread-count',
  )

  return response.data.unreadCount
}
