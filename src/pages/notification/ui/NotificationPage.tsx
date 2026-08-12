import { useCallback, useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'

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
import notificationModalCloseIcon from '../assets/svg/notification-modal-close.svg'
import notificationMoreIcon from '../assets/svg/notification-more.svg'
import notificationReadAllIcon from '../assets/svg/notification-read-all.svg'
import notificationSettingsIcon from '../assets/svg/notification-settings.svg'
import {
  ActionError,
  Content,
  EmptyState,
  Header,
  HeaderActions,
  LoadMoreButton,
  NotificationList,
  Page,
  ReadAllButton,
  ReadAllIcon,
  RetryButton,
  SettingsButton,
  SettingsIcon,
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

const INITIAL_NOTIFICATION_SETTINGS: NotificationSettings = {
  mentoringEnabled: true,
  commentEnabled: true,
  scheduleEnabled: true,
  inAppEnabled: true,
  pushEnabled: true,
  emailEnabled: true,
}

export function NotificationPage() {
  const { setNotificationCount } =
    useOutletContext<NotificationOutletContext>()
  const [notifications, setNotifications] = useState<Notification[]>([])
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

  const loadNotifications = useCallback(async () => {
    setIsLoading(true)
    setLoadError(null)

    try {
      const [response, unreadCount] = await Promise.all([
        getNotifications(),
        getUnreadNotificationCount(),
      ])
      const nextNotifications = response.content.map((notification) =>
        mapNotificationResponse(notification, notificationAvatar),
      )

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

  const handleLoadMore = async () => {
    if (!hasNextPage || isLoadingMore) {
      return
    }

    setIsLoadingMore(true)
    setActionError(null)

    try {
      const response = await getNotifications({ page: nextPage })
      const nextNotifications = response.content.map((notification) =>
        mapNotificationResponse(notification, notificationAvatar),
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

        return Array.from(notificationMap.values())
      })
      setNextPage(response.number + 1)
      setHasNextPage(!response.last)
    } catch {
      setActionError('다음 알림을 불러오지 못했습니다.')
    } finally {
      setIsLoadingMore(false)
    }
  }

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

  const handleSettingsOpen = () => {
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
          mapNotificationResponse(notification, notificationAvatar),
        )

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
              <ReadAllIcon src={notificationReadAllIcon} alt="" />
              모두 읽음
            </ReadAllButton>
            <SettingsButton
              type="button"
              aria-label="알림 설정"
              aria-haspopup="dialog"
              aria-expanded={isSettingsOpen}
              onClick={handleSettingsOpen}
            >
              <SettingsIcon src={notificationSettingsIcon} alt="" />
            </SettingsButton>
          </HeaderActions>
        </Header>

        <NotificationList aria-live="polite">
          {actionError && <ActionError role="alert">{actionError}</ActionError>}

          {isLoading ? (
            <StatusState>
              <StatusText>알림을 불러오는 중입니다.</StatusText>
            </StatusState>
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
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  typeIconUrl={NOTIFICATION_TYPE_ICONS[notification.type]}
                  moreIconUrl={notificationMoreIcon}
                  fallbackActorImageUrl={notificationAvatar}
                  isMenuOpen={openMenuId === notification.id}
                  onMenuToggle={handleMenuToggle}
                  onReadToggle={handleReadToggle}
                  onDelete={handleDeleteRequest}
                />
              ))}
              {hasNextPage && (
                <LoadMoreButton
                  type="button"
                  disabled={isLoadingMore}
                  onClick={handleLoadMore}
                >
                  {isLoadingMore ? '불러오는 중' : '알림 더 보기'}
                </LoadMoreButton>
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

      {isSettingsOpen && (
        <NotificationSettingsModal
          closeIconUrl={notificationModalCloseIcon}
          settings={notificationSettings}
          errorMessage={settingsError ?? undefined}
          isUpdating={isSettingsLoading || isSettingsUpdating}
          onClose={handleSettingsClose}
          onToggle={handleSettingToggle}
        />
      )}
    </Page>
  )
}
