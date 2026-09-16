import styled, { css, keyframes } from 'styled-components'

import { contentReveal } from '@/shared/styles/animations'
import * as token from '@/shared/styles/values/token'

export const Panel = styled.aside<{ $embedded: boolean }>`
  ${token.flexColumnStart}
  box-sizing: border-box;
  min-width: 0;
  min-height: 0;

  ${({ $embedded }) =>
    $embedded
      ? css`
          position: static;
          width: 100%;
          height: 100%;
          padding: 0;
          background-color: ${token.colors.white};
          box-shadow: none;
        `
      : css`
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          z-index: 100;
          width: 460px;
          padding: 24px 16px;
          background-color: ${token.colors.gray.gray0};
          box-shadow: -8px 0 24px rgb(0 0 0 / 10%);
        `}
`

export const CloseButton = styled.button`
  ${token.flexCenter}
  width: 28px;
  height: 28px;
  margin: 0 0 28px;
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

export const Header = styled.div<{ $embedded?: boolean }>`
  ${token.flexColumnStart}
  width: 100%;
  gap: 8px;

  ${({ $embedded }) =>
    $embedded &&
    css`
      padding-bottom: 16px;
      border-bottom: 1px solid ${token.colors.gray.gray10};
    `}
`

export const StatusRow = styled.div`
  ${token.flexBetween}
  width: 100%;
`

export const Status = styled.span<{ $color: string }>`
  ${token.typography('body', 'sm', 'semibold')}
  color: ${({ $color }) => $color};
`

export const QuestionInfo = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  grid-template-rows: auto auto;
  column-gap: 12px;
  row-gap: 4px;
  width: 100%;
  min-width: 0;
`

export const RoomName = styled.p`
  grid-column: 1;
  grid-row: 1;
  ${token.typography('caption', 'md', 'medium')}
  margin: 0;
  color: ${token.colors.gray.gray50};
`

export const TitleRow = styled.div`
  display: flex;
  grid-column: 1;
  grid-row: 2;
  width: 100%;
  min-width: 0;
`

export const Title = styled.h2`
  ${token.typography('body', 'lg', 'semibold')}
  flex: 1 1 auto;
  min-width: 0;
  margin: 0;
  color: ${token.colors.gray.gray100};
  line-height: 1.3;
  word-break: break-word;
`

export const CompletionAction = styled.div`
  ${token.flexRow}
  grid-column: 2;
  grid-row: 1 / span 2;
  align-self: center;
  align-items: center;
  gap: 4px;
  max-width: 100%;
  color: ${token.colors.gray.gray60};
  white-space: nowrap;
  ${token.typography('caption', 'sm', 'medium')}

  @media (max-width: 760px) {
    grid-column: 1 / -1;
    grid-row: 3;
    justify-self: end;
    white-space: normal;
  }
`

export const CompletionButton = styled.button`
  ${token.flexCenter}
  box-sizing: border-box;
  flex-shrink: 0;
  height: 32px;
  padding: 0 10px;
  border: 0;
  border-radius: ${token.shapes.small};
  background: ${token.colors.gray.gray90};
  color: ${token.colors.white};
  white-space: nowrap;
  cursor: pointer;
  ${token.typography('caption', 'lg', 'semibold')}

  &:hover {
    background: ${token.colors.gray.gray100};
  }

  &:disabled {
    background: ${token.colors.gray.gray30};
    cursor: not-allowed;
  }
`

export const CreatedAt = styled.span<{ $embedded?: boolean }>`
  ${token.typography('caption', 'md', 'medium')}
  margin: ${({ $embedded }) => ($embedded ? '12px 0 16px' : '28px 0')};
  color: ${token.colors.gray.gray40};
`

export const Chat = styled.div<{ $embedded: boolean }>`
  ${token.flexColumn}
  width: 100%;
  flex: 1 1 0;
  min-height: 0;
  justify-content: space-between;
  padding: ${({ $embedded }) => ($embedded ? '0 4px' : '12px 8px')};
  border-radius: ${({ $embedded }) =>
    $embedded ? '0' : token.shapes.large};
  background-color: ${token.colors.white};
`

export const MessageList = styled.div`
  ${token.flexColumnStart}
  width: 100%;
  flex: 1 1 0;
  gap: 16px;
  overflow-y: auto;
  scrollbar-color: ${token.colors.gray.gray30} transparent;
  scrollbar-width: thin;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    border: 2px solid transparent;
    border-radius: ${token.shapes.circle};
    background: ${token.colors.gray.gray30};
    background-clip: padding-box;
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
  min-width: 0;
  gap: 6px;
  padding: 0;
`

export const SenderName = styled.span`
  ${token.typography('body', 'sm', 'semibold')}
  color: ${token.colors.gray.gray80};
`

export const Bubbles = styled.div<{ $isMine: boolean }>`
  ${token.flexColumnStart}
  gap: 4px;
  align-items: ${({ $isMine }) => ($isMine ? 'flex-end' : 'flex-start')};
`

export const Bubble = styled.div<{
  $embedded?: boolean
  $isMine: boolean
  $isRoot?: boolean
}>`
  ${token.typography('body', 'sm', 'medium')}
  ${token.flexColumnStart}
  width: fit-content;
  max-width: ${({ $embedded }) => ($embedded ? 'min(100%, 705px)' : '296px')};
  min-width: 0;
  gap: 8px;
  padding: 10px 12px;
  border: ${({ $isMine, $isRoot }) =>
    $isRoot
      ? `1px solid ${token.colors.primary.primary50}`
      : $isMine
        ? `1px solid ${token.colors.primary.primary30}`
        : `1px solid ${token.colors.gray.gray10}`};
  border-radius: ${token.shapes.medium};
  background-color: ${({ $isMine, $isRoot }) =>
    $isRoot
      ? token.colors.white
      : $isMine
        ? token.colors.primary.primary10
        : token.colors.white};
  color: ${token.colors.gray.gray80};
  line-height: 1.45;
  word-break: break-word;
  white-space: pre-wrap;
`

export const MessageMarkdown = styled.div`
  min-width: 0;
  max-width: 100%;
  white-space: normal;

  p {
    margin: 0;
    white-space: pre-wrap;
  }

  p + p {
    margin-top: 8px;
  }

  ul,
  ol {
    margin: 0;
    padding-left: 20px;
  }

  pre {
    max-width: 100%;
    margin: 0;
    padding: 10px 12px;
    overflow-x: auto;
    border-radius: ${token.shapes.small};
    background: ${token.colors.gray.gray90};
    color: ${token.colors.white};
    white-space: pre;
  }

  pre code {
    padding: 0;
    background: transparent;
    color: inherit;
    font-family:
      ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 0.9em;
  }

  :not(pre) > code {
    padding: 2px 5px;
    border-radius: ${token.shapes.xsmall};
    background: ${token.colors.gray.gray0};
    font-family:
      ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 0.9em;
  }
`

export const AttachedImage = styled.img`
  display: block;
  max-width: 100%;
  width: 100%;
  border-radius: ${token.shapes.xsmall};
  object-fit: cover;
`

export const AttachedFile = styled.a`
  ${token.typography('body', 'sm', 'medium')}
  color: ${token.colors.info.info20};
  text-decoration: underline;
`

export const MessageTime = styled.span<{
  $embedded?: boolean
  $isMine: boolean
}>`
  ${token.typography('caption', 'md', 'medium')}
  width: fit-content;
  max-width: ${({ $embedded }) => ($embedded ? 'min(100%, 705px)' : '296px')};
  color: ${token.colors.gray.gray40};
  text-align: ${({ $isMine }) => ($isMine ? 'right' : 'left')};
`

const messageSkeletonShimmer = keyframes`
  from {
    background-position: 100% 0;
  }

  to {
    background-position: -100% 0;
  }
`

const messageSkeletonSurface = css`
  border-radius: ${token.shapes.xsmall};
  background: linear-gradient(
    90deg,
    ${token.colors.gray.gray0} 20%,
    ${token.colors.gray.gray10} 50%,
    ${token.colors.gray.gray0} 80%
  );
  background-size: 200% 100%;
  animation: ${messageSkeletonShimmer} 1.4s ease-in-out infinite;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`

const messageRevealAnimation = css`
  animation: ${contentReveal} 360ms ease-out both;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`

export const MessageLoading = styled.div`
  ${token.flexColumnStart}
  width: 100%;
  gap: 16px;
  ${messageRevealAnimation}
`

export const MessageContent = styled.div`
  ${token.flexColumnStart}
  width: 100%;
  gap: 16px;
  ${messageRevealAnimation}
`

export const MessageLoadingGroup = styled.div`
  ${token.flexRow}
  align-items: flex-start;
  width: 100%;
  gap: 6px;
`

export const MessageLoadingAvatar = styled.span`
  ${messageSkeletonSurface}
  display: block;
  flex: 0 0 32px;
  width: 32px;
  height: 32px;
  border-radius: ${token.shapes.circle};
`

export const MessageLoadingBody = styled.div`
  ${token.flexColumnStart}
  gap: 6px;
`

export const MessageLoadingLine = styled.span<{ $width: string }>`
  ${messageSkeletonSurface}
  display: block;
  width: ${({ $width }) => $width};
  height: 12px;
`

export const MessageLoadingBubble = styled.span<{ $width: string }>`
  ${messageSkeletonSurface}
  display: block;
  width: ${({ $width }) => $width};
  height: 40px;
  border-radius: ${token.shapes.medium};
`
