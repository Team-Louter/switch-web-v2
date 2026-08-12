import type {
  Notification,
  NotificationApiType,
  NotificationResponse,
  NotificationType,
} from '../model/types'

interface NotificationDisplayMeta {
  category: string
  type: NotificationType
}

const NOTIFICATION_DISPLAY_META: Record<
  NotificationApiType,
  NotificationDisplayMeta
> = {
  MENTORING: { category: '멘토링', type: 'mentoring' },
  COMMENT: { category: '커뮤니티', type: 'comment' },
  SCHEDULE: { category: '일정', type: 'schedule' },
}

function resolveActorImageUrl(
  profileImageUrl: string | undefined,
): string | undefined {
  const trimmedProfileImageUrl = profileImageUrl?.trim()

  if (!trimmedProfileImageUrl) {
    return undefined
  }

  try {
    return new URL(
      trimmedProfileImageUrl,
      import.meta.env.VITE_API_BASE_URL,
    ).toString()
  } catch {
    return undefined
  }
}

function formatRelativeTime(createdAt: string): string {
  const createdTime = new Date(createdAt).getTime()

  if (Number.isNaN(createdTime)) {
    return createdAt
  }

  const differenceInMilliseconds = Math.max(0, Date.now() - createdTime)
  const differenceInMinutes = Math.floor(
    differenceInMilliseconds / (1000 * 60),
  )

  if (differenceInMinutes < 1) {
    return '방금 전'
  }

  if (differenceInMinutes < 60) {
    return `${differenceInMinutes}분 전`
  }

  const differenceInHours = Math.floor(differenceInMinutes / 60)

  if (differenceInHours < 24) {
    return `${differenceInHours}시간 전`
  }

  const differenceInDays = Math.floor(differenceInHours / 24)

  if (differenceInDays < 7) {
    return `${differenceInDays}일 전`
  }

  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  }).format(createdTime)
}

export function mapNotificationResponse(
  response: NotificationResponse,
): Notification {
  const displayMeta = NOTIFICATION_DISPLAY_META[response.notiType]

  return {
    id: response.notificationId,
    type: displayMeta.type,
    category: displayMeta.category,
    message: response.title,
    content: response.content,
    occurredAt: formatRelativeTime(response.createdAt),
    isRead: response.isRead,
    actorImageUrl: resolveActorImageUrl(response.actor?.profileImageUrl),
    target: response.target,
  }
}
