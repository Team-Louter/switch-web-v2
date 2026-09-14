import { useEffect, useLayoutEffect, useRef } from 'react'
import type {
  KeyboardEvent as ReactKeyboardEvent,
  MouseEvent as ReactMouseEvent,
  SyntheticEvent,
} from 'react'

import type { Notification } from '../../model/types'
import {
  Avatar,
  AvatarWrap,
  Category,
  Content,
  ContextMenu,
  Controls,
  IndicatorSlot,
  Item,
  Main,
  MenuActionButton,
  Message,
  Meta,
  MoreButton,
  MoreButtonWrap,
  MoreIcon,
  OccurredAt,
  Subject,
  TypeIcon,
  UnreadIndicator,
} from './NotificationItem.style'

interface NotificationItemProps {
  notification: Notification
  typeIconUrl?: string
  moreIconUrl: string
  fallbackActorImageUrl?: string
  isClickable: boolean
  isMenuOpen: boolean
  onNotificationClick: (notification: Notification) => void
  onMenuToggle: (notificationId: number) => void
  onReadToggle: (notificationId: number) => void
  onDelete: (notificationId: number) => void
}

export function NotificationItem({
  notification,
  typeIconUrl,
  moreIconUrl,
  fallbackActorImageUrl,
  isClickable,
  isMenuOpen,
  onNotificationClick,
  onMenuToggle,
  onReadToggle,
  onDelete,
}: NotificationItemProps) {
  const moreButtonRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const {
    actorImageUrl,
    category,
    content,
    id,
    isRead,
    message,
    occurredAt,
    type,
  } = notification
  const avatarImageUrl = actorImageUrl ?? fallbackActorImageUrl

  const handleMenuToggle = () => {
    onMenuToggle(id)
  }

  const handleReadToggle = () => {
    onReadToggle(id)
  }

  const handleDelete = () => {
    onDelete(id)
  }

  const handleItemClick = (event: ReactMouseEvent<HTMLElement>) => {
    if (
      !isClickable ||
      (event.target instanceof Element && event.target.closest('button'))
    ) {
      return
    }

    onNotificationClick(notification)
  }

  const handleItemKeyDown = (event: ReactKeyboardEvent<HTMLElement>) => {
    if (
      !isClickable ||
      event.target !== event.currentTarget ||
      (event.key !== 'Enter' && event.key !== ' ')
    ) {
      return
    }

    event.preventDefault()
    onNotificationClick(notification)
  }

  const handleAvatarError = (event: SyntheticEvent<HTMLImageElement>) => {
    if (!fallbackActorImageUrl) {
      return
    }

    event.currentTarget.onerror = null
    event.currentTarget.src = fallbackActorImageUrl
  }

  useEffect(() => {
    if (!isMenuOpen) {
      return
    }

    function handleOutsidePointerDown(event: PointerEvent) {
      const target = event.target

      if (
        !(target instanceof Node) ||
        moreButtonRef.current?.contains(target) ||
        menuRef.current?.contains(target)
      ) {
        return
      }

      onMenuToggle(id)
    }

    function handleEscapeKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onMenuToggle(id)
      }
    }

    document.addEventListener('pointerdown', handleOutsidePointerDown)
    window.addEventListener('keydown', handleEscapeKeyDown)

    return () => {
      document.removeEventListener('pointerdown', handleOutsidePointerDown)
      window.removeEventListener('keydown', handleEscapeKeyDown)
    }
  }, [id, isMenuOpen, onMenuToggle])

  useLayoutEffect(() => {
    if (!isMenuOpen) {
      return
    }

    const menu = menuRef.current
    const moreButton = moreButtonRef.current

    if (!menu || !moreButton) {
      return
    }

    const updateMenuPlacement = () => {
      const moreButtonRect = moreButton.getBoundingClientRect()
      const menuHeight = menu.getBoundingClientRect().height
      const shouldOpenUpward =
        moreButtonRect.bottom + menuHeight + 16 > window.innerHeight

      menu.dataset.placement = shouldOpenUpward ? 'top' : 'bottom'
    }

    updateMenuPlacement()
    window.addEventListener('resize', updateMenuPlacement)

    return () => window.removeEventListener('resize', updateMenuPlacement)
  }, [isMenuOpen])

  return (
    <Item
      $isClickable={isClickable}
      data-notification-type={type}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onClick={handleItemClick}
      onKeyDown={handleItemKeyDown}
    >
      <Main>
        {avatarImageUrl && (
          <AvatarWrap>
            <Avatar src={avatarImageUrl} alt="" onError={handleAvatarError} />
            {typeIconUrl && <TypeIcon src={typeIconUrl} alt="" />}
          </AvatarWrap>
        )}
        <Content>
          <Category>{category}</Category>
          <Message>{message}</Message>
          <Subject>{content}</Subject>
        </Content>
      </Main>

      <Controls>
        <Meta>
          <IndicatorSlot>
            {!isRead && (
              <UnreadIndicator role="status" aria-label="읽지 않은 알림" />
            )}
          </IndicatorSlot>
          <OccurredAt>{occurredAt}</OccurredAt>
        </Meta>

        <MoreButtonWrap>
          <MoreButton
            ref={moreButtonRef}
            type="button"
            aria-label={`${message} 더보기`}
            aria-haspopup="menu"
            aria-expanded={isMenuOpen}
            aria-controls={`notification-menu-${id}`}
            onClick={handleMenuToggle}
          >
            <MoreIcon src={moreIconUrl} alt="" />
          </MoreButton>

          {isMenuOpen && (
            <ContextMenu
              ref={menuRef}
              id={`notification-menu-${id}`}
              role="menu"
              onClick={(event) => event.stopPropagation()}
            >
              <MenuActionButton
                type="button"
                role="menuitem"
                onClick={handleReadToggle}
              >
                {isRead ? '읽지 않음으로 표시' : '읽음으로 표시'}
              </MenuActionButton>
              <MenuActionButton
                type="button"
                role="menuitem"
                onClick={handleDelete}
              >
                삭제
              </MenuActionButton>
            </ContextMenu>
          )}
        </MoreButtonWrap>
      </Controls>
    </Item>
  )
}
