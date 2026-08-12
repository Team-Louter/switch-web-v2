import type { NotificationSettingsResponse } from '@/entities/notification'
import { apiClient } from '@/shared/api'

import type {
  NotificationSettingKey,
  NotificationSettings,
  UpdateNotificationChannelSettingsRequest,
  UpdateNotificationContentSettingsRequest,
} from '../model/types'

const CONTENT_SETTING_KEYS = new Set<NotificationSettingKey>([
  'mentoringEnabled',
  'commentEnabled',
  'scheduleEnabled',
])

export async function updateNotificationSettings(
  settings: NotificationSettings,
  changedSetting: NotificationSettingKey,
): Promise<NotificationSettingsResponse> {
  if (CONTENT_SETTING_KEYS.has(changedSetting)) {
    const request: UpdateNotificationContentSettingsRequest = {
      mentoringEnabled: settings.mentoringEnabled,
      commentEnabled: settings.commentEnabled,
      scheduleEnabled: settings.scheduleEnabled,
    }
    const response = await apiClient.put<NotificationSettingsResponse>(
      '/notification/settings',
      request,
    )

    return response.data
  }

  const request: UpdateNotificationChannelSettingsRequest = {
    pushEnabled: settings.pushEnabled,
    inAppEnabled: settings.inAppEnabled,
    emailEnabled: settings.emailEnabled,
  }
  const response = await apiClient.put<NotificationSettingsResponse>(
    '/notification/settings/type',
    request,
  )

  return response.data
}
