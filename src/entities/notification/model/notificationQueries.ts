import { queryOptions } from '@tanstack/react-query'

import { getNotificationSettings } from '../api/getNotificationSettings'
import { getNotifications } from '../api/getNotifications'
import { getUnreadNotificationCount } from '../api/getUnreadNotificationCount'

export const notificationQueryKeys = {
  all: ['notifications'] as const,
  page: (userId: number | null, page: number) =>
    [...notificationQueryKeys.all, 'page', userId, page] as const,
  unreadCount: (userId: number | null) =>
    [...notificationQueryKeys.all, 'unread-count', userId] as const,
  settingsRoot: ['notifications', 'settings'] as const,
  settings: (userId: number | null) =>
    [...notificationQueryKeys.settingsRoot, userId] as const,
}

export function notificationPageOptions(userId: number | null, page = 0) {
  return queryOptions({
    queryKey: notificationQueryKeys.page(userId, page),
    queryFn: () => getNotifications({ page }),
  })
}

export function unreadNotificationCountOptions(userId: number | null) {
  return queryOptions({
    queryKey: notificationQueryKeys.unreadCount(userId),
    queryFn: getUnreadNotificationCount,
    staleTime: 10_000,
  })
}

export function notificationSettingsOptions(userId: number | null) {
  return queryOptions({
    queryKey: notificationQueryKeys.settings(userId),
    queryFn: getNotificationSettings,
  })
}
