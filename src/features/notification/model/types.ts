import type { NotificationSettingsResponse } from '@/entities/notification'

export type NotificationMenuAction = 'read' | 'delete'

export type NotificationSettings = NotificationSettingsResponse

export type NotificationSettingKey = keyof NotificationSettings

export interface ReadAllNotificationsResponse {
  updatedCount: number
}

export interface PatchNotificationSettingRequest {
  setting: NotificationSettingKey
  enabled: boolean
}
