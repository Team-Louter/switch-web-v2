export type NotificationType = 'mentoring' | 'comment' | 'schedule'

export type NotificationApiType = 'MENTORING' | 'COMMENT' | 'SCHEDULE'

export interface Notification {
  id: number
  type: NotificationType
  category: string
  message: string
  content: string
  occurredAt: string
  isRead: boolean
  actorImageUrl?: string
}

export interface NotificationResponse {
  notificationId: number
  notiType: NotificationApiType
  title: string
  content: string
  isRead: boolean
  readAt: string | null
  createdAt: string
}

export interface NotificationSettingsResponse {
  mentoringEnabled: boolean
  commentEnabled: boolean
  scheduleEnabled: boolean
  pushEnabled: boolean
  inAppEnabled: boolean
  emailEnabled: boolean
}
