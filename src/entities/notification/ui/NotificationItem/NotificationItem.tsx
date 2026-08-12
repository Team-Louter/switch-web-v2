import type { Notification } from '../../model/types'
import {
  Avatar,
  Category,
  Content,
  Item,
  Main,
  Message,
  Meta,
  OccurredAt,
  Subject,
  UnreadIndicator,
} from './NotificationItem.style'

interface NotificationItemProps {
  notification: Notification
}

export function NotificationItem({ notification }: NotificationItemProps) {
  const {
    actorImageUrl,
    category,
    content,
    isRead,
    message,
    occurredAt,
    type,
  } = notification

  return (
    <Item data-notification-type={type}>
      <Main>
        {actorImageUrl && <Avatar src={actorImageUrl} alt="" />}
        <Content>
          <Category>{category}</Category>
          <Message>{message}</Message>
          <Subject>{content}</Subject>
        </Content>
      </Main>

      <Meta>
        {!isRead && (
          <UnreadIndicator role="status" aria-label="읽지 않은 알림" />
        )}
        <OccurredAt dateTime={occurredAt}>{occurredAt}</OccurredAt>
      </Meta>
    </Item>
  )
}
