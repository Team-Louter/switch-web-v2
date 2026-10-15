import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useIsMutating, useQueries, useQuery } from '@tanstack/react-query'
import { queryClient } from '@/shared/lib/queryClient'

import {
  mapNotificationResponse,
  NotificationItem,
  notificationPageOptions,
  notificationQueryKeys,
  notificationSettingsOptions,
  unreadNotificationCountOptions,
  type Notification,
  type NotificationType,
} from '@/entities/notification'
import { useUserStore } from '@/entities/profile'
import {
  deleteNotification,
  DeleteNotificationModal,
  NotificationSettingsModal,
  type NotificationSettingKey,
  type NotificationSettings,
  type NotificationReadRequest,
  updateNotificationSettings,
  useNotificationReadMutation,
} from '@/features/notification'

import notificationAvatar from '../assets/images/notification-avatar.png'
import notificationCommentIcon from '../assets/svg/notification-comment.svg'
import notificationMoreIcon from '../assets/svg/notification-more.svg'
import notificationSettingsIcon from '../assets/svg/notification-settings.svg'
import { NotificationReadAllIcon } from './icons/NotificationReadAllIcon'
import {
  ActionError,
  Content,
  EmptyState,
  Header,
  HeaderActions,
  InfiniteScrollTrigger,
  NewNotification,
  NotificationList,
  Page,
  ReadAllButton,
  ReadAllIcon,
  RetryButton,
  SettingsAnchor,
  SettingsButton,
  SettingsIcon,
  SkeletonAvatar,
  SkeletonControls,
  SkeletonIndicator,
  SkeletonItem,
  SkeletonLine,
  SkeletonList,
  SkeletonMain,
  SkeletonOccurredAt,
  SkeletonText,
  StatusState,
  StatusText,
  Title,
} from './NotificationPage.style'

const NOTIFICATION_TYPE_ICONS: Partial<Record<NotificationType, string>> = {
  comment: notificationCommentIcon,
}

const SKELETON_ITEM_COUNT = 4
const LOAD_MORE_SKELETON_ITEM_COUNT = 2
const NOTIFICATION_POLLING_INTERVAL = 15_000

const INITIAL_NOTIFICATION_SETTINGS: NotificationSettings = {
  mentoringEnabled: true,
  commentEnabled: true,
  scheduleEnabled: true,
  inAppEnabled: true,
  pushEnabled: true,
  emailEnabled: true,
}

function getNotificationTargetPath(notification: Notification): string | null {
  const target = notification.target

  if (
    target?.type === 'MENTORING_QUESTION' &&
    Number.isSafeInteger(target.id) &&
    target.id > 0
  ) {
    return `/mentoring?questionId=${target.id}`
  }

  if (
    target?.type === 'MENTORING_MESSAGE' &&
    Number.isSafeInteger(target.id) &&
    target.id > 0 &&
    target.parentId !== null &&
    Number.isSafeInteger(target.parentId) &&
    target.parentId > 0
  ) {
    return `/mentoring?questionId=${target.parentId}#message-${target.id}`
  }

  if (
    target?.type === 'SCHEDULE' &&
    Number.isSafeInteger(target.id) &&
    target.id > 0
  ) {
    return `/home?scheduleId=${target.id}`
  }

  if (
    target?.type !== 'COMMENT' ||
    target.parentId === null ||
    !Number.isSafeInteger(target.parentId)
  ) {
    return null
  }

  const commentHash = Number.isSafeInteger(target.id)
    ? `#comment-${target.id}`
    : ''

  return `/community/${target.parentId}${commentHash}`
}

export function NotificationPage() {
  const navigate = useNavigate()
  const userId = useUserStore((state) => state.user?.userId ?? null)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const loadMoreTriggerRef = useRef<HTMLDivElement>(null)
  const notificationIdsRef = useRef<Set<number>>(new Set())
  const hasLoadedNotificationsRef = useRef(false)
  const [newNotificationIds, setNewNotificationIds] = useState<Set<number>>(
    new Set(),
  )
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [nextPage, setNextPage] = useState(1)
  const [hasNextPage, setHasNextPage] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const [isNotificationMutating, setIsNotificationMutating] = useState(false)
  const [openMenuId, setOpenMenuId] = useState<number | null>(null)
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [notificationSettings, setNotificationSettings] = useState(
    INITIAL_NOTIFICATION_SETTINGS,
  )
  const [isSettingsLoading, setIsSettingsLoading] = useState(true)
  const [isSettingsUpdating, setIsSettingsUpdating] = useState(false)
  const [settingsError, setSettingsError] = useState<string | null>(null)

  const { mutateAsync: changeReadState } = useNotificationReadMutation(userId)
  const pendingReads = useIsMutating({
    mutationKey: notificationQueryKeys.reads(userId),
  })
  const unreadCountQuery = useQuery({
    ...unreadNotificationCountOptions(userId),
    enabled: false,
  })
  const cachedPages = useQueries({
    queries: Array.from({ length: nextPage }, (_, page) => ({
      ...notificationPageOptions(userId, page),
      enabled: false,
    })),
  })
  const cachedReadStates = new Map(
    cachedPages.flatMap((page) =>
      page.data?.content.map((notification) =>
        [notification.notificationId, notification.isRead] as const,
      ) ?? [],
    ),
  )
  const visibleNotifications = notifications.map((notification) => ({
    ...notification,
    isRead: cachedReadStates.get(notification.id) ?? notification.isRead,
  }))
  const unreadNotificationCount = unreadCountQuery.data ?? 0
  const hasUnreadNotification = unreadNotificationCount > 0
  const isNotificationActionPending = isNotificationMutating || pendingReads > 0
  const hasPendingReads = useCallback(
    (notificationId?: number) => queryClient.isMutating({
      mutationKey: notificationQueryKeys.reads(userId),
      predicate: (mutation) => {
        const request = mutation.state.variables as NotificationReadRequest | undefined
        return notificationId === undefined || request?.kind === 'all' ||
          (request?.kind === 'single' && request.notificationId === notificationId)
      },
    }) > 0,
    [userId],
  )

  const handleNotificationClick = useCallback(
    (notification: Notification) => {
      const targetPath = getNotificationTargetPath(notification)
      if (!targetPath) return

      if (!notification.isRead && !hasPendingReads(notification.id)) {
        void changeReadState({
          kind: 'single', notificationId: notification.id, isRead: true,
        }).catch(() => {
          toast.error('알림을 읽음 처리하지 못했습니다. 다시 시도해주세요.')
        })
      }

      // 읽음 요청은 캐시에서 완료·복구하므로 페이지 이동을 기다리게 하지 않는다.
      navigate(targetPath, { viewTransition: true })
    },
    [changeReadState, hasPendingReads, navigate],
  )

  const loadNotifications = useCallback(async () => {
    if (hasPendingReads()) return
    setIsLoading(true)
    setLoadError(null)

    try {
      const response = await queryClient.fetchQuery(notificationPageOptions(userId))
      if (hasPendingReads()) return

      const nextNotifications = response.content.map((notification) =>
        mapNotificationResponse(notification),
      )

      notificationIdsRef.current = new Set(
        nextNotifications.map((notification) => notification.id),
      )
      hasLoadedNotificationsRef.current = true
      setNewNotificationIds(new Set())
      setNotifications(nextNotifications)
      setNextPage(response.number + 1)
      setHasNextPage(!response.last)
    } catch {
      setLoadError('알림을 불러오지 못했습니다.')
    } finally {
      setIsLoading(false)
    }
  }, [hasPendingReads, userId])

  const refreshNotifications = useCallback(async () => {
    if (userId === null || hasPendingReads()) {
      return
    }

    try {
      const response = await queryClient.fetchQuery({
        ...notificationPageOptions(userId),
        staleTime: 0,
      })
      if (hasPendingReads()) return

      const refreshedNotifications = response.content.map((notification) =>
        mapNotificationResponse(notification),
      )
      const refreshedNotificationIds = new Set(
        refreshedNotifications.map((notification) => notification.id),
      )
      const addedNotificationIds = refreshedNotifications
        .filter(
          (notification) => !notificationIdsRef.current.has(notification.id),
        )
        .map((notification) => notification.id)

      if (hasLoadedNotificationsRef.current && addedNotificationIds.length > 0) {
        setNewNotificationIds(
          (currentNotificationIds) =>
            new Set([...currentNotificationIds, ...addedNotificationIds]),
        )
      }

      setNotifications((currentNotifications) => {
        const nextNotifications = [
          ...refreshedNotifications,
          ...currentNotifications.filter(
            (notification) => !refreshedNotificationIds.has(notification.id),
          ),
        ]

        notificationIdsRef.current = new Set(
          nextNotifications.map((notification) => notification.id),
        )

        return nextNotifications
      })
      setLoadError(null)
    } catch {
      // Keep the currently visible notifications until the next refresh.
    }
  }, [hasPendingReads, userId])

  const handleLoadMore = useCallback(async () => {
    if (!hasNextPage || isLoadingMore || hasPendingReads()) {
      return
    }

    setIsLoadingMore(true)
    setActionError(null)

    try {
      const response = await queryClient.fetchQuery(
        notificationPageOptions(userId, nextPage),
      )
      if (hasPendingReads()) return

      const nextNotifications = response.content.map((notification) =>
        mapNotificationResponse(notification),
      )

      setNotifications((currentNotifications) => {
        const notificationMap = new Map(
          currentNotifications.map((notification) => [
            notification.id,
            notification,
          ]),
        )

        nextNotifications.forEach((notification) => {
          notificationMap.set(notification.id, notification)
        })

        const mergedNotifications = Array.from(notificationMap.values())

        notificationIdsRef.current = new Set(
          mergedNotifications.map((notification) => notification.id),
        )

        return mergedNotifications
      })
      setNextPage(response.number + 1)
      setHasNextPage(!response.last)
    } catch {
      setActionError('다음 알림을 불러오지 못했습니다.')
    } finally {
      setIsLoadingMore(false)
    }
  }, [hasNextPage, hasPendingReads, isLoadingMore, nextPage, userId])

  const loadSettings = useCallback(async () => {
    setIsSettingsLoading(true)
    setSettingsError(null)

    try {
      const response = await queryClient.fetchQuery(
        notificationSettingsOptions(userId),
      )

      setNotificationSettings(response)
    } catch {
      setSettingsError('알림 설정을 불러오지 못했습니다.')
    } finally {
      setIsSettingsLoading(false)
    }
  }, [userId])

  const handleReadAll = async () => {
    if (!hasUnreadNotification || isNotificationMutating || hasPendingReads()) return

    setActionError(null)
    setOpenMenuId(null)
    try {
      await changeReadState({ kind: 'all' })
    } catch {
      setActionError('모든 알림을 읽음 처리하지 못했습니다.')
    }
  }

  const handleMenuToggle = (notificationId: number) => {
    if (isNotificationMutating || hasPendingReads()) {
      return
    }

    setOpenMenuId((currentId) =>
      currentId === notificationId ? null : notificationId,
    )
  }

  const handleReadToggle = async (notificationId: number) => {
    if (isNotificationMutating || hasPendingReads()) return

    const selectedNotification = visibleNotifications.find(
      (notification) => notification.id === notificationId,
    )
    if (!selectedNotification) return

    const nextIsRead = !selectedNotification.isRead
    setActionError(null)
    setOpenMenuId(null)
    try {
      await changeReadState({ kind: 'single', notificationId, isRead: nextIsRead })
    } catch {
      setActionError(nextIsRead
        ? '알림을 읽음 처리하지 못했습니다.'
        : '알림을 읽지 않음 처리하지 못했습니다.')
    }
  }

  const handleDeleteRequest = (notificationId: number) => {
    if (isNotificationMutating || hasPendingReads()) {
      return
    }

    setPendingDeleteId(notificationId)
    setOpenMenuId(null)
  }

  const handleDeleteCancel = useCallback(() => {
    setPendingDeleteId(null)
  }, [])

  const handleDeleteConfirm = async () => {
    if (pendingDeleteId === null || isNotificationMutating || hasPendingReads()) {
      return
    }

    setIsNotificationMutating(true)
    setActionError(null)

    try {
      await deleteNotification(pendingDeleteId)
      setNotifications((currentNotifications) =>
        currentNotifications.filter(
          (notification) => notification.id !== pendingDeleteId,
        ),
      )
      notificationIdsRef.current.delete(pendingDeleteId)
      setNewNotificationIds((currentNotificationIds) => {
        const nextNotificationIds = new Set(currentNotificationIds)

        nextNotificationIds.delete(pendingDeleteId)

        return nextNotificationIds
      })

      setPendingDeleteId(null)
    } catch {
      setActionError('알림을 삭제하지 못했습니다.')
      setPendingDeleteId(null)
    } finally {
      setIsNotificationMutating(false)
    }
  }

  const handleSettingsToggle = () => {
    if (isSettingsOpen) {
      setIsSettingsOpen(false)
      return
    }

    setIsSettingsOpen(true)
    setOpenMenuId(null)

    if (settingsError) {
      void loadSettings()
    }
  }

  const handleSettingsClose = useCallback(() => {
    setIsSettingsOpen(false)
  }, [])

  const handleSettingToggle = async (setting: NotificationSettingKey) => {
    if (isSettingsLoading || isSettingsUpdating) {
      return
    }

    const previousSettings = notificationSettings
    const nextSettings = {
      ...notificationSettings,
      [setting]: !notificationSettings[setting],
    }

    setNotificationSettings(nextSettings)
    setIsSettingsUpdating(true)
    setSettingsError(null)

    try {
      const response = await updateNotificationSettings(
        setting,
        nextSettings[setting],
      )

      setNotificationSettings(response)
    } catch {
      setNotificationSettings(previousSettings)
      setSettingsError('알림 설정을 변경하지 못했습니다.')
    } finally {
      setIsSettingsUpdating(false)
    }
  }

  useEffect(() => {
    if (userId === null) {
      return
    }

    let isCancelled = false

    const pageOptions = notificationPageOptions(userId)
    // 재진입 시 진행 중인 읽음 상태를 서버의 이전 응답으로 덮어쓰지 않는다.
    const initialPage = hasPendingReads()
      ? Promise.resolve(queryClient.getQueryData(pageOptions.queryKey))
      : queryClient.fetchQuery(pageOptions)

    initialPage
      .then((response) => {
        if (isCancelled || !response) {
          return
        }

        const nextNotifications = response.content.map((notification) =>
          mapNotificationResponse(notification),
        )

        notificationIdsRef.current = new Set(
          nextNotifications.map((notification) => notification.id),
        )
        hasLoadedNotificationsRef.current = true
        setNotifications(nextNotifications)
        setNextPage(response.number + 1)
        setHasNextPage(!response.last)
      })
      .catch(() => {
        if (!isCancelled) {
          setLoadError('알림을 불러오지 못했습니다.')
        }
      })
      .finally(() => {
        if (!isCancelled) {
          setIsLoading(false)
        }
      })

    queryClient.fetchQuery(notificationSettingsOptions(userId))
      .then((response) => {
        if (!isCancelled) {
          setNotificationSettings(response)
        }
      })
      .catch(() => {
        if (!isCancelled) {
          setSettingsError('알림 설정을 불러오지 못했습니다.')
        }
      })
      .finally(() => {
        if (!isCancelled) {
          setIsSettingsLoading(false)
        }
      })

    return () => {
      isCancelled = true
    }
  }, [hasPendingReads, userId])

  const handleNewNotificationAnimationEnd = useCallback(
    (notificationId: number) => {
      setNewNotificationIds((currentNotificationIds) => {
        if (!currentNotificationIds.has(notificationId)) {
          return currentNotificationIds
        }

        const nextNotificationIds = new Set(currentNotificationIds)

        nextNotificationIds.delete(notificationId)

        return nextNotificationIds
      })
    },
    [],
  )

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        void refreshNotifications()
      }
    }

    const pollingTimer = window.setInterval(() => {
      if (!document.hidden) {
        void refreshNotifications()
      }
    }, NOTIFICATION_POLLING_INTERVAL)

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      window.clearInterval(pollingTimer)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [refreshNotifications])

  useEffect(() => {
    const loadMoreTrigger = loadMoreTriggerRef.current

    if (!loadMoreTrigger || !hasNextPage || isLoadingMore) {
      return
    }

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          void handleLoadMore()
        }
      },
      { rootMargin: '0px 0px 180px' },
    )

    intersectionObserver.observe(loadMoreTrigger)

    return () => {
      intersectionObserver.disconnect()
    }
  }, [handleLoadMore, hasNextPage, isLoadingMore])

  return (
    <Page>
      <Content>
        <Header>
          <Title>내 알림</Title>
          <HeaderActions>
            <ReadAllButton
              type="button"
              disabled={
                !hasUnreadNotification || isLoading || isNotificationActionPending
              }
              onClick={handleReadAll}
            >
              <ReadAllIcon as={NotificationReadAllIcon} />
              모두 읽음
            </ReadAllButton>
            <SettingsAnchor>
              <SettingsButton
                type="button"
                aria-label="알림 설정"
                aria-haspopup="dialog"
                aria-expanded={isSettingsOpen}
                onClick={handleSettingsToggle}
              >
                <SettingsIcon
                  $isOpen={isSettingsOpen}
                  src={notificationSettingsIcon}
                  alt=""
                />
              </SettingsButton>
              {isSettingsOpen && (
                <NotificationSettingsModal
                  settings={notificationSettings}
                  errorMessage={settingsError ?? undefined}
                  isUpdating={isSettingsLoading || isSettingsUpdating}
                  onClose={handleSettingsClose}
                  onToggle={handleSettingToggle}
                />
              )}
            </SettingsAnchor>
          </HeaderActions>
        </Header>

        <NotificationList
          $loaded={!isLoading && !loadError}
          aria-busy={isLoading}
          aria-live="polite"
        >
          {actionError && <ActionError role="alert">{actionError}</ActionError>}

          {isLoading ? (
            <SkeletonList aria-label="알림을 불러오는 중입니다.">
              {Array.from({ length: SKELETON_ITEM_COUNT }, (_, index) => (
                <SkeletonItem key={index} aria-hidden="true">
                  <SkeletonMain>
                    <SkeletonAvatar />
                    <SkeletonText>
                      <SkeletonLine $width="64px" />
                      <SkeletonLine $width="260px" />
                      <SkeletonLine $width="180px" />
                    </SkeletonText>
                  </SkeletonMain>
                  <SkeletonControls>
                    <SkeletonIndicator />
                    <SkeletonOccurredAt />
                  </SkeletonControls>
                </SkeletonItem>
              ))}
            </SkeletonList>
          ) : loadError ? (
            <StatusState>
              <StatusText>{loadError}</StatusText>
              <RetryButton type="button" onClick={loadNotifications}>
                다시 시도
              </RetryButton>
            </StatusState>
          ) : notifications.length > 0 ? (
            <>
              {visibleNotifications.map((notification) => (
                <NewNotification
                  key={notification.id}
                  $isNew={newNotificationIds.has(notification.id)}
                  onAnimationEnd={() =>
                    handleNewNotificationAnimationEnd(notification.id)
                  }
                >
                  <NotificationItem
                    notification={notification}
                    typeIconUrl={NOTIFICATION_TYPE_ICONS[notification.type]}
                    moreIconUrl={notificationMoreIcon}
                    fallbackActorImageUrl={notificationAvatar}
                    isClickable={getNotificationTargetPath(notification) !== null}
                    isMenuOpen={openMenuId === notification.id}
                    onNotificationClick={handleNotificationClick}
                    onMenuToggle={handleMenuToggle}
                    onReadToggle={handleReadToggle}
                    onDelete={handleDeleteRequest}
                  />
                </NewNotification>
              ))}
              {hasNextPage && (
                <InfiniteScrollTrigger ref={loadMoreTriggerRef}>
                  {isLoadingMore && (
                    <SkeletonList aria-label="추가 알림을 불러오는 중입니다.">
                      {Array.from(
                        { length: LOAD_MORE_SKELETON_ITEM_COUNT },
                        (_, index) => (
                          <SkeletonItem key={index} aria-hidden="true">
                            <SkeletonMain>
                              <SkeletonAvatar />
                              <SkeletonText>
                                <SkeletonLine $width="64px" />
                                <SkeletonLine $width="260px" />
                                <SkeletonLine $width="180px" />
                              </SkeletonText>
                            </SkeletonMain>
                            <SkeletonControls>
                              <SkeletonIndicator />
                              <SkeletonOccurredAt />
                            </SkeletonControls>
                          </SkeletonItem>
                        ),
                      )}
                    </SkeletonList>
                  )}
                </InfiniteScrollTrigger>
              )}
            </>
          ) : (
            <EmptyState>새로운 알림이 없습니다.</EmptyState>
          )}
        </NotificationList>
      </Content>

      {pendingDeleteId !== null && (
        <DeleteNotificationModal
          isDeleting={isNotificationActionPending}
          onCancel={handleDeleteCancel}
          onConfirm={handleDeleteConfirm}
        />
      )}

    </Page>
  )
}
