export type NotificationType = 'post' | 'comment' | 'like'

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

export interface NotificationListResponse {
  notifications: Notification[]
  unreadCount: number
}
