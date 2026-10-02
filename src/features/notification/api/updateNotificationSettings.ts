import type { NotificationSettingsResponse } from '@/entities/notification'
import { notificationQueryKeys } from '@/entities/notification'
import { apiClient } from '@/shared/api'
import { queryClient } from '@/shared/lib/queryClient'

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
  await queryClient.invalidateQueries({
    queryKey: notificationQueryKeys.settingsRoot,
  })

  return response.data
}
