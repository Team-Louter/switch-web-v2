export type NotificationType = 'mentoring' | 'comment' | 'schedule'

export type NotificationApiType = 'MENTORING' | 'COMMENT' | 'SCHEDULE'

export type NotificationTargetType =
  | 'COMMENT'
  | 'MENTORING_QUESTION'
  | 'MENTORING_MESSAGE'
  | 'SCHEDULE'

export interface Notification {
  id: number
  type: NotificationType
  category: string
  message: string
  content: string
  occurredAt: string
  isRead: boolean
  actorImageUrl?: string
  target: NotificationTargetResponse | null
}

export interface NotificationActorResponse {
  memberId: number | null
  name: string
  profileImageUrl: string
}

export interface NotificationTargetResponse {
  type: NotificationTargetType
  id: number
  parentId: number | null
}

export interface NotificationResponse {
  notificationId: number
  notiType: NotificationApiType
  title: string
  content: string
  actor: NotificationActorResponse | null
  target: NotificationTargetResponse | null
  isRead: boolean
  readAt: string | null
  createdAt: string
}

export interface NotificationSortResponse {
  unsorted: boolean
  empty: boolean
  sorted: boolean
}

export interface NotificationPageableResponse {
  unpaged: boolean
  offset: number
  sort: NotificationSortResponse
  pageNumber: number
  paged: boolean
  pageSize: number
}

export interface NotificationPageResponse {
  totalElements: number
  totalPages: number
  numberOfElements: number
  first: boolean
  last: boolean
  size: number
  content: NotificationResponse[]
  number: number
  sort: NotificationSortResponse
  pageable: NotificationPageableResponse
  empty: boolean
}

export interface GetNotificationsParams {
  page?: number
  size?: number
}

export interface UnreadNotificationCountResponse {
  unreadCount: number
}

export interface NotificationSettingsResponse {
  mentoringEnabled: boolean
  commentEnabled: boolean
  scheduleEnabled: boolean
  pushEnabled: boolean
  inAppEnabled: boolean
  emailEnabled: boolean
}
