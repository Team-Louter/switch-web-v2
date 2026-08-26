import { apiClient } from '@/shared/api'

import type { NotificationSettingsResponse } from '../model/types'

export async function getNotificationSettings(): Promise<NotificationSettingsResponse> {
  const response = await apiClient.get<NotificationSettingsResponse>(
    '/notification/settings',
  )

  return response.data
}
