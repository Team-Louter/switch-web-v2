import styled from 'styled-components'

import * as token from '@/shared/styles/values/token'

export const Panel = styled.aside`
  ${token.flexColumnStart}
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
  width: 460px;
  padding: 24px 16px;
  background-color: ${token.colors.gray.gray0};
  box-shadow: -8px 0 24px rgb(0 0 0 / 10%);
`

export const CloseButton = styled.button`
  ${token.flexCenter}
  width: 28px;
  height: 28px;
  margin: 0 0 28px 28px;
  padding: 0;
  border: 0;
  background-color: transparent;
  color: ${token.colors.gray.gray50};
  cursor: pointer;

  svg {
    width: 28px;
    height: 28px;
  }

  &:hover {
    color: ${token.colors.gray.gray80};
  }
`

export const Header = styled.div`
  ${token.flexColumnStart}
  width: 100%;
  gap: 12px;
`

export const StatusRow = styled.div`
  ${token.flexBetween}
  width: 100%;
`

export const Status = styled.span<{ $color: string }>`
  ${token.typography('body', 'lg', 'bold')}
  color: ${({ $color }) => $color};
`

export const QuestionInfo = styled.div`
  ${token.flexColumnStart}
  width: 100%;
  gap: 4px;
`

export const RoomName = styled.p`
  ${token.typography('caption', 'lg', 'medium')}
  margin: 0;
  color: ${token.colors.gray.gray50};
`

export const Title = styled.h2`
  ${token.typography('heading', 'sm', 'bold')}
  margin: 0;
  color: ${token.colors.gray.gray80};
  word-break: break-word;
`

export const CreatedAt = styled.span`
  ${token.typography('caption', 'lg', 'medium')}
  margin: 28px 0;
  color: ${token.colors.gray.gray30};
`

export const Chat = styled.div`
  ${token.flexColumn}
  width: 100%;
  flex: 1 1 0;
  min-height: 0;
  justify-content: space-between;
  padding: 12px 8px;
  border-radius: ${token.shapes.large};
  background-color: ${token.colors.white};
`

export const MessageList = styled.div`
  ${token.flexColumnStart}
  width: 100%;
  flex: 1 1 0;
  gap: 10px;
  overflow-y: auto;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`

export const MessageGroup = styled.div<{ $isMine: boolean }>`
  ${token.flexRow}
  width: 100%;
  gap: 6px;
  justify-content: ${({ $isMine }) => ($isMine ? 'flex-end' : 'flex-start')};
`

export const MessageBody = styled.div`
  ${token.flexColumnStart}
  gap: 8px;
  padding: 8px 0;
`

export const SenderName = styled.span`
  ${token.typography('body', 'md', 'semibold')}
  color: ${token.colors.gray.gray80};
`

export const Bubbles = styled.div<{ $isMine: boolean }>`
  ${token.flexColumnStart}
  gap: 4px;
  align-items: ${({ $isMine }) => ($isMine ? 'flex-end' : 'flex-start')};
`

export const Bubble = styled.div<{ $isMine: boolean }>`
  ${token.typography('body', 'md', 'medium')}
  ${token.flexColumnStart}
  width: 296px;
  gap: 8px;
  padding: 10px;
  border: ${({ $isMine }) =>
    $isMine ? `1px solid ${token.colors.gray.gray20}` : '0'};
  border-radius: ${token.shapes.small};
  background-color: ${({ $isMine }) =>
    $isMine ? 'transparent' : token.colors.primary.primary30};
  color: ${token.colors.gray.gray100};
  word-break: break-word;
`

export const AttachedImage = styled.img`
  width: 100%;
  border-radius: ${token.shapes.xsmall};
  object-fit: cover;
`

export const AttachedFile = styled.a`
  ${token.typography('caption', 'lg', 'medium')}
  color: ${token.colors.info.info20};
  text-decoration: underline;
`

export const MessageTime = styled.span<{ $isMine: boolean }>`
  ${token.typography('caption', 'md', 'medium')}
  width: 296px;
  color: ${token.colors.gray.gray20};
  text-align: ${({ $isMine }) => ($isMine ? 'right' : 'left')};
`

export const EmptyText = styled.p`
  ${token.typography('body', 'sm', 'medium')}
  width: 100%;
  margin: auto 0;
  color: ${token.colors.gray.gray40};
  text-align: center;
`

export const InputRow = styled.div`
  ${token.flexBetween}
  width: 100%;
  height: 48px;
  flex-shrink: 0;
  gap: 8px;
  margin-top: 10px;
  padding: 10px 12px;
  border-radius: ${token.shapes.small};
  background-color: ${token.colors.gray.gray0};
`

export const AttachButton = styled.label`
  ${token.flexCenter}
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  color: ${token.colors.gray.gray50};
  cursor: pointer;

  svg {
    width: 24px;
    height: 24px;
  }

  input {
    display: none;
  }
`

export const MessageInput = styled.input`
  ${token.typography('body', 'md', 'medium')}
  width: 100%;
  border: 0;
  background-color: transparent;
  color: ${token.colors.gray.gray80};

  &::placeholder {
    color: ${token.colors.gray.gray30};
  }

  &:focus {
    outline: none;
  }
`

export const SendButton = styled.button`
  ${token.typography('body', 'lg', 'bold')}
  flex-shrink: 0;
  padding: 0;
  border: 0;
  background-color: transparent;
  color: ${token.colors.primary.text};
  cursor: pointer;

  &:disabled {
    color: ${token.colors.gray.gray30};
    cursor: not-allowed;
  }
`

export const AttachedFileNames = styled.span`
  ${token.typography('caption', 'md', 'medium')}
  flex-shrink: 0;
  max-width: 120px;
  overflow: hidden;
  color: ${token.colors.gray.gray50};
  text-overflow: ellipsis;
  white-space: nowrap;
`
