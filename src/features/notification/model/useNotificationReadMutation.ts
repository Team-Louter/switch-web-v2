import { useMutation } from '@tanstack/react-query'

import {
  notificationQueryKeys,
  type NotificationPageResponse,
} from '@/entities/notification'
import { queryClient } from '@/shared/lib/queryClient'

import {
  readAllNotifications,
  readNotification,
  unreadNotification,
} from '../api/readNotifications'

export type NotificationReadRequest =
  | { kind: 'all' }
  | { kind: 'single'; notificationId: number; isRead: boolean }

export function useNotificationReadMutation(userId: number | null) {
  const pageQueryKey = [...notificationQueryKeys.all, 'page', userId]
  const countQueryKey = notificationQueryKeys.unreadCount(userId)
  const mutationKey = notificationQueryKeys.reads(userId)

  return useMutation({
    mutationKey,
    mutationFn: async (request: NotificationReadRequest) => {
      if (request.kind === 'all') {
        await readAllNotifications()
      } else if (request.isRead) {
        await readNotification(request.notificationId)
      } else {
        await unreadNotification(request.notificationId)
      }
    },
    onMutate: async (request) => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: pageQueryKey }),
        queryClient.cancelQueries({ queryKey: countQueryKey }),
      ])

      const previousReads = new Map<number, boolean>()
      queryClient.setQueriesData<NotificationPageResponse>(
        { queryKey: pageQueryKey },
        (page) => page && {
          ...page,
          content: page.content.map((notification) => {
            if (
              request.kind === 'single' &&
              notification.notificationId !== request.notificationId
            ) {
              return notification
            }

            previousReads.set(notification.notificationId, notification.isRead)
            return {
              ...notification,
              isRead: request.kind === 'all' || request.isRead,
            }
          }),
        },
      )

      let countDelta = 0
      queryClient.setQueryData<number>(countQueryKey, (count) => {
        if (count === undefined) return count

        const previousRead = request.kind === 'single'
          ? previousReads.get(request.notificationId)
          : undefined
        const delta = request.kind === 'all'
          ? -count
          : previousRead === undefined || previousRead === request.isRead
            ? 0
            : request.isRead ? -1 : 1
        const nextCount = Math.max(0, count + delta)
        countDelta = nextCount - count
        return nextCount
      })

      return { previousReads, countDelta }
    },
    onError: (_error, _request, context) => {
      if (!context) return

      // 다른 알림의 내용과 새 항목은 보존하고 이 요청의 읽음 상태만 복구한다.
      queryClient.setQueriesData<NotificationPageResponse>(
        { queryKey: pageQueryKey },
        (page) => page && {
          ...page,
          content: page.content.map((notification) => {
            const previousRead = context.previousReads.get(notification.notificationId)
            return previousRead === undefined
              ? notification
              : { ...notification, isRead: previousRead }
          }),
        },
      )
      queryClient.setQueryData<number>(countQueryKey, (count) =>
        count === undefined ? count : Math.max(0, count - context.countDelta),
      )
    },
    onSettled: async () => {
      // 진행 중에는 조회를 재개하지 않고 마지막 요청 종료 후 배지를 동기화한다.
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: pageQueryKey, refetchType: 'none' }),
        queryClient.invalidateQueries({ queryKey: countQueryKey, refetchType: 'none' }),
      ])
    },
  })
}
