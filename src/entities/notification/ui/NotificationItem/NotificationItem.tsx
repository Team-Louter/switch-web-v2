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
  isMenuOpen: boolean
  onMenuToggle: (notificationId: number) => void
  onReadToggle: (notificationId: number) => void
  onDelete: (notificationId: number) => void
}

export function NotificationItem({
  notification,
  typeIconUrl,
  moreIconUrl,
  isMenuOpen,
  onMenuToggle,
  onReadToggle,
  onDelete,
}: NotificationItemProps) {
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

  const handleMenuToggle = () => {
    onMenuToggle(id)
  }

  const handleReadToggle = () => {
    onReadToggle(id)
  }

  const handleDelete = () => {
    onDelete(id)
  }

  return (
    <Item data-notification-type={type}>
      <Main>
        {actorImageUrl && (
          <AvatarWrap>
            <Avatar src={actorImageUrl} alt="" />
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

        <MoreButton
          type="button"
          aria-label={`${message} 더보기`}
          aria-haspopup="menu"
          aria-expanded={isMenuOpen}
          aria-controls={`notification-menu-${id}`}
          onClick={handleMenuToggle}
        >
          <MoreIcon src={moreIconUrl} alt="" />
        </MoreButton>
      </Controls>

      {isMenuOpen && (
        <ContextMenu id={`notification-menu-${id}`} role="menu">
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
    </Item>
  )
}
