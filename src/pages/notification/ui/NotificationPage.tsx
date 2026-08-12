import { useState } from 'react'

import {
  NotificationItem,
  type Notification,
  type NotificationType,
} from '@/entities/notification'

import notificationAvatar from '../assets/images/notification-avatar.png'
import notificationCommentIcon from '../assets/svg/notification-comment.svg'
import notificationLikeIcon from '../assets/svg/notification-like.svg'
import notificationMoreIcon from '../assets/svg/notification-more.svg'
import notificationReadAllIcon from '../assets/svg/notification-read-all.svg'
import notificationSettingsIcon from '../assets/svg/notification-settings.svg'
import {
  Content,
  EmptyState,
  Header,
  HeaderActions,
  NotificationList,
  Page,
  ReadAllButton,
  ReadAllIcon,
  SettingsButton,
  SettingsIcon,
  Title,
} from './NotificationPage.style'

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 1,
    type: 'post',
    category: '커뮤니티',
    message: '이도연님이 게시글을 작성했어요',
    content: '[자유게시판] 집가고 싶다',
    occurredAt: '2시간 전',
    isRead: false,
    actorImageUrl: notificationAvatar,
  },
  {
    id: 2,
    type: 'comment',
    category: '커뮤니티',
    message: '이도연님이 내 게시글에 댓글을 작성했어요',
    content: '[자유게시판] 집가고 싶다',
    occurredAt: '2시간 전',
    isRead: false,
    actorImageUrl: notificationAvatar,
  },
  {
    id: 3,
    type: 'like',
    category: '커뮤니티',
    message: '이도연님이 내 게시글에 댓글을 작성했어요',
    content: '[자유게시판] 집가고 싶다',
    occurredAt: '2시간 전',
    isRead: false,
    actorImageUrl: notificationAvatar,
  },
  {
    id: 4,
    type: 'like',
    category: '커뮤니티',
    message: '이도연님이 내 게시글에 댓글을 작성했어요',
    content: '[자유게시판] 집가고 싶다',
    occurredAt: '2시간 전',
    isRead: true,
    actorImageUrl: notificationAvatar,
  },
  {
    id: 5,
    type: 'comment',
    category: '커뮤니티',
    message: '이도연님이 내 게시글에 댓글을 작성했어요',
    content: '[자유게시판] 집가고 싶다',
    occurredAt: '2시간 전',
    isRead: false,
    actorImageUrl: notificationAvatar,
  },
  {
    id: 6,
    type: 'post',
    category: '커뮤니티',
    message: '이도연님이 게시글을 작성했어요',
    content: '[자유게시판] 집가고 싶다',
    occurredAt: '2시간 전',
    isRead: false,
    actorImageUrl: notificationAvatar,
  },
  {
    id: 7,
    type: 'post',
    category: '커뮤니티',
    message: '이도연님이 게시글을 작성했어요',
    content: '[자유게시판] 집가고 싶다',
    occurredAt: '2시간 전',
    isRead: false,
    actorImageUrl: notificationAvatar,
  },
]

const NOTIFICATION_TYPE_ICONS: Partial<Record<NotificationType, string>> = {
  comment: notificationCommentIcon,
  like: notificationLikeIcon,
}

export function NotificationPage() {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS)
  const [openMenuId, setOpenMenuId] = useState<number | null>(null)

  const hasUnreadNotification = notifications.some(
    (notification) => !notification.isRead,
  )

  const handleReadAll = () => {
    setNotifications((currentNotifications) =>
      currentNotifications.map((notification) => ({
        ...notification,
        isRead: true,
      })),
    )
    setOpenMenuId(null)
  }

  const handleMenuToggle = (notificationId: number) => {
    setOpenMenuId((currentId) =>
      currentId === notificationId ? null : notificationId,
    )
  }

  const handleRead = (notificationId: number) => {
    setNotifications((currentNotifications) =>
      currentNotifications.map((notification) =>
        notification.id === notificationId
          ? { ...notification, isRead: true }
          : notification,
      ),
    )
    setOpenMenuId(null)
  }

  const handleDelete = (notificationId: number) => {
    setNotifications((currentNotifications) =>
      currentNotifications.filter(
        (notification) => notification.id !== notificationId,
      ),
    )
    setOpenMenuId(null)
  }

  return (
    <Page>
      <Content>
        <Header>
          <Title>내 알림</Title>
          <HeaderActions>
            <ReadAllButton
              type="button"
              disabled={!hasUnreadNotification}
              onClick={handleReadAll}
            >
              <ReadAllIcon src={notificationReadAllIcon} alt="" />
              모두 읽음
            </ReadAllButton>
            <SettingsButton type="button" aria-label="알림 설정">
              <SettingsIcon src={notificationSettingsIcon} alt="" />
            </SettingsButton>
          </HeaderActions>
        </Header>

        <NotificationList aria-live="polite">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                typeIconUrl={NOTIFICATION_TYPE_ICONS[notification.type]}
                moreIconUrl={notificationMoreIcon}
                isMenuOpen={openMenuId === notification.id}
                onMenuToggle={handleMenuToggle}
                onRead={handleRead}
                onDelete={handleDelete}
              />
            ))
          ) : (
            <EmptyState>새로운 알림이 없습니다.</EmptyState>
          )}
        </NotificationList>
      </Content>
    </Page>
  )
}
