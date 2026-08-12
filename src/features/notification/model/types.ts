import type { NotificationSettingsResponse } from '@/entities/notification'

export type NotificationMenuAction = 'read' | 'delete'

export type NotificationSettings = NotificationSettingsResponse

export type NotificationSettingKey = keyof NotificationSettings

export interface UpdateNotificationContentSettingsRequest {
  mentoringEnabled: boolean
  commentEnabled: boolean
  scheduleEnabled: boolean
}

export interface UpdateNotificationChannelSettingsRequest {
  pushEnabled: boolean
  inAppEnabled: boolean
  emailEnabled: boolean
}
