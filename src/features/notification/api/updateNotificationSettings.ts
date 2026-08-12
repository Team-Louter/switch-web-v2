import type { NotificationSettingsResponse } from '@/entities/notification'
import { apiClient } from '@/shared/api'

import type {
  PatchNotificationSettingRequest,
  NotificationSettingKey,
} from '../model/types'

export async function updateNotificationSettings(
  setting: NotificationSettingKey,
  enabled: boolean,
): Promise<NotificationSettingsResponse> {
  const request: PatchNotificationSettingRequest = {
    setting,
    enabled,
  }
  const response = await apiClient.patch<NotificationSettingsResponse>(
    '/notification/settings',
    request,
  )

  return response.data
}
