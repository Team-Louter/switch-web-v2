export type NotificationMenuAction = 'read' | 'delete'

export type NotificationSettingKey =
  | 'mentoring'
  | 'comment'
  | 'scheduleReminder'
  | 'inApp'
  | 'push'
  | 'email'

export interface NotificationSettings {
  mentoring: boolean
  comment: boolean
  scheduleReminder: boolean
  inApp: boolean
  push: boolean
  email: boolean
}
