import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'

import {
  getNotificationSettings,
  getNotifications,
  getUnreadNotificationCount,
  mapNotificationResponse,
  NotificationItem,
  type Notification,
  type NotificationType,
} from '@/entities/notification'
import {
  deleteNotification,
  DeleteNotificationModal,
  NotificationSettingsModal,
  readAllNotifications,
  readNotification,
  type NotificationSettingKey,
  type NotificationSettings,
  unreadNotification,
  updateNotificationSettings,
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

interface NotificationOutletContext {
  setNotificationCount: (count: number) => void
}

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
  const { setNotificationCount } =
    useOutletContext<NotificationOutletContext>()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const loadMoreTriggerRef = useRef<HTMLDivElement>(null)
  const notificationIdsRef = useRef<Set<number>>(new Set())
  const hasLoadedNotificationsRef = useRef(false)
  const [newNotificationIds, setNewNotificationIds] = useState<Set<number>>(
    new Set(),
  )
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0)
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

  const hasUnreadNotification = unreadNotificationCount > 0

  const handleNotificationClick = useCallback(
    async (notification: Notification) => {
      const targetPath = getNotificationTargetPath(notification)

      if (!targetPath) {
        return
      }

      if (!notification.isRead) {
        try {
          await readNotification(notification.id)
          setNotifications((currentNotifications) =>
            currentNotifications.map((currentNotification) =>
              currentNotification.id === notification.id
                ? { ...currentNotification, isRead: true }
                : currentNotification,
            ),
          )

          const nextUnreadCount = Math.max(0, unreadNotificationCount - 1)

          setUnreadNotificationCount(nextUnreadCount)
          setNotificationCount(nextUnreadCount)
        } catch {
          setActionError('알림을 읽음 처리하지 못했습니다.')
        }
      }

      navigate(targetPath, { viewTransition: true })
    },
    [navigate, setNotificationCount, unreadNotificationCount],
  )

  const loadNotifications = useCallback(async () => {
    setIsLoading(true)
    setLoadError(null)

    try {
      const [response, unreadCount] = await Promise.all([
        getNotifications(),
        getUnreadNotificationCount(),
      ])
      const nextNotifications = response.content.map((notification) =>
        mapNotificationResponse(notification),
      )

      notificationIdsRef.current = new Set(
        nextNotifications.map((notification) => notification.id),
      )
      hasLoadedNotificationsRef.current = true
      setNewNotificationIds(new Set())
      setNotifications(nextNotifications)
      setUnreadNotificationCount(unreadCount)
      setNotificationCount(unreadCount)
      setNextPage(response.number + 1)
      setHasNextPage(!response.last)
    } catch {
      setLoadError('알림을 불러오지 못했습니다.')
    } finally {
      setIsLoading(false)
    }
  }, [setNotificationCount])

  const refreshNotifications = useCallback(async () => {
    try {
      const [response, unreadCount] = await Promise.all([
        getNotifications(),
        getUnreadNotificationCount(),
      ])
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
      setUnreadNotificationCount(unreadCount)
      setNotificationCount(unreadCount)
      setLoadError(null)
    } catch {
      // Keep the currently visible notifications until the next refresh.
    }
  }, [setNotificationCount])

  const handleLoadMore = useCallback(async () => {
    if (!hasNextPage || isLoadingMore) {
      return
    }

    setIsLoadingMore(true)
    setActionError(null)

    try {
      const response = await getNotifications({ page: nextPage })
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
  }, [hasNextPage, isLoadingMore, nextPage])

  const loadSettings = useCallback(async () => {
    setIsSettingsLoading(true)
    setSettingsError(null)

    try {
      const response = await getNotificationSettings()

      setNotificationSettings(response)
    } catch {
      setSettingsError('알림 설정을 불러오지 못했습니다.')
    } finally {
      setIsSettingsLoading(false)
    }
  }, [])

  const handleReadAll = async () => {
    if (!hasUnreadNotification || isNotificationMutating) {
      return
    }

    setIsNotificationMutating(true)
    setActionError(null)
    setOpenMenuId(null)

    try {
      await readAllNotifications()
      setNotifications((currentNotifications) =>
        currentNotifications.map((notification) => ({
          ...notification,
          isRead: true,
        })),
      )
      setUnreadNotificationCount(0)
      setNotificationCount(0)
    } catch {
      setActionError('모든 알림을 읽음 처리하지 못했습니다.')
      void loadNotifications()
    } finally {
      setIsNotificationMutating(false)
    }
  }

  const handleMenuToggle = (notificationId: number) => {
    if (isNotificationMutating) {
      return
    }

    setOpenMenuId((currentId) =>
      currentId === notificationId ? null : notificationId,
    )
  }

  const handleReadToggle = async (notificationId: number) => {
    if (isNotificationMutating) {
      return
    }

    const selectedNotification = notifications.find(
      (notification) => notification.id === notificationId,
    )

    if (!selectedNotification) {
      return
    }

    const nextIsRead = !selectedNotification.isRead

    setIsNotificationMutating(true)
    setActionError(null)
    setOpenMenuId(null)

    try {
      if (nextIsRead) {
        await readNotification(notificationId)
      } else {
        await unreadNotification(notificationId)
      }

      setNotifications((currentNotifications) =>
        currentNotifications.map((notification) =>
          notification.id === notificationId
            ? { ...notification, isRead: nextIsRead }
            : notification,
        ),
      )

      const nextUnreadCount = Math.max(
        0,
        unreadNotificationCount + (nextIsRead ? -1 : 1),
      )

      setUnreadNotificationCount(nextUnreadCount)
      setNotificationCount(nextUnreadCount)
    } catch {
      setActionError(
        nextIsRead
          ? '알림을 읽음 처리하지 못했습니다.'
          : '알림을 읽지 않음 처리하지 못했습니다.',
      )
    } finally {
      setIsNotificationMutating(false)
    }
  }

  const handleDeleteRequest = (notificationId: number) => {
    if (isNotificationMutating) {
      return
    }

    setPendingDeleteId(notificationId)
    setOpenMenuId(null)
  }

  const handleDeleteCancel = useCallback(() => {
    setPendingDeleteId(null)
  }, [])

  const handleDeleteConfirm = async () => {
    if (pendingDeleteId === null || isNotificationMutating) {
      return
    }

    const selectedNotification = notifications.find(
      (notification) => notification.id === pendingDeleteId,
    )

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

      if (selectedNotification && !selectedNotification.isRead) {
        const nextUnreadCount = Math.max(0, unreadNotificationCount - 1)

        setUnreadNotificationCount(nextUnreadCount)
        setNotificationCount(nextUnreadCount)
      }

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
    let isCancelled = false

    Promise.all([getNotifications(), getUnreadNotificationCount()])
      .then(([response, unreadCount]) => {
        if (isCancelled) {
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
        setUnreadNotificationCount(unreadCount)
        setNotificationCount(unreadCount)
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

    getNotificationSettings()
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
  }, [setNotificationCount])

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
                !hasUnreadNotification || isLoading || isNotificationMutating
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
              {notifications.map((notification) => (
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
          isDeleting={isNotificationMutating}
          onCancel={handleDeleteCancel}
          onConfirm={handleDeleteConfirm}
        />
      )}

    </Page>
  )
}
