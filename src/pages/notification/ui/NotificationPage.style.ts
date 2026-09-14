import styled, { css, keyframes } from 'styled-components'

import * as token from '@/shared/styles/values/token'

export const Page = styled.main`
  ${token.flexColumn}
  align-items: flex-start;
  justify-content: flex-start;
  box-sizing: border-box;
  min-height: 100dvh;
  padding: clamp(20px, 2vw, 30px) clamp(20px, 2vw, 30px)
    clamp(20px, 2vw, 30px) 0;
  background: ${token.colors.white};
`

export const Content = styled.div`
  ${token.flexColumnStart}
  width: 100%;
  gap: 28px;

  @media (max-width: 760px) {
    gap: 24px;
  }
`

export const Header = styled.header`
  ${token.flexBetween}
  width: 100%;
`

export const Title = styled.h1`
  color: ${token.colors.gray.gray80};
  line-height: 1;
  ${token.typography('body', 'md', 'medium')}
`

export const HeaderActions = styled.div`
  ${token.flexLeft}
  gap: 16px;
`

export const ReadAllButton = styled.button`
  ${token.flexLeft}
  gap: 4px;
  color: ${token.colors.primary.primary70};
  line-height: 1;
  ${token.typography('body', 'sm', 'semibold')}

  &:focus-visible {
    outline: 2px solid ${token.colors.primary.primary40};
    outline-offset: 4px;
  }

  &:disabled {
    cursor: default;
    opacity: 0.5;
  }
`

export const ReadAllIcon = styled.img`
  width: 18px;
  height: 18px;
  object-fit: contain;
`

export const SettingsButton = styled.button`
  ${token.flexCenter}
  width: 20px;
  height: 20px;
  border-radius: ${token.shapes.xsmall};

  &:hover {
    background: ${token.colors.gray.gray0};
  }

  &:focus-visible {
    outline: 2px solid ${token.colors.primary.primary40};
    outline-offset: 3px;
  }
`

export const SettingsIcon = styled.img`
  width: 20px;
  height: 20px;
  object-fit: contain;
`

const notificationListReveal = keyframes`
  from {
    opacity: 0;
    transform: translateY(14px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
`

export const NotificationList = styled.div<{ $loaded: boolean }>`
  ${token.flexColumnStart}
  width: 100%;
  gap: 14px;

  ${({ $loaded }) =>
    $loaded &&
    css`
      animation: ${notificationListReveal} 360ms ease-out both;
    `}

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`

const newNotificationEntrance = keyframes`
  from {
    opacity: 0;
    transform: translateY(-12px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
`

export const NewNotification = styled.div<{ $isNew: boolean }>`
  width: 100%;
  border-radius: ${token.shapes.medium};

  ${({ $isNew }) =>
    $isNew &&
    css`
      animation: ${newNotificationEntrance} 320ms ease-out;
    `}

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`

const shimmer = keyframes`
  from {
    background-position: 100% 0;
  }

  to {
    background-position: -100% 0;
  }
`

const SkeletonBlock = styled.span`
  display: block;
  border-radius: ${token.shapes.xsmall};
  background: linear-gradient(
    90deg,
    ${token.colors.gray.gray0} 20%,
    ${token.colors.gray.gray10} 45%,
    ${token.colors.gray.gray0} 70%
  );
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s ease-in-out infinite;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`

export const SkeletonList = styled.div`
  ${token.flexColumnStart}
  width: 100%;
  gap: 14px;
`

export const InfiniteScrollTrigger = styled.div`
  width: 100%;
  min-height: 1px;
`

export const SkeletonItem = styled.div`
  ${token.flexBetween}
  align-items: flex-start;
  width: 100%;
  padding: 14px 0;
`

export const SkeletonMain = styled.div`
  ${token.flexRow}
  flex: 1;
  min-width: 0;
  gap: 16px;
`

export const SkeletonAvatar = styled(SkeletonBlock)`
  flex: 0 0 44px;
  width: 44px;
  height: 44px;
  border-radius: ${token.shapes.circle};
`

export const SkeletonText = styled.div`
  ${token.flexColumnStart}
  flex: 1;
  min-width: 0;
  gap: 7px;
  padding-top: 1px;
`

export const SkeletonLine = styled(SkeletonBlock)<{ $width: string }>`
  width: ${({ $width }) => $width};
  max-width: 100%;
  height: 13px;

  &:nth-child(2) {
    height: 16px;
  }
`

export const SkeletonControls = styled.div`
  ${token.flexColumn}
  align-items: flex-end;
  flex: 0 0 auto;
  justify-content: space-between;
  align-self: stretch;
  width: 52px;
  min-height: 44px;
  margin-left: 16px;
`

export const SkeletonIndicator = styled(SkeletonBlock)`
  width: 14px;
  height: 14px;
  border-radius: ${token.shapes.circle};
`

export const SkeletonOccurredAt = styled(SkeletonBlock)`
  width: 42px;
  height: 13px;
`

export const LoadMoreButton = styled.button`
  align-self: center;
  padding: 10px 20px;
  border-radius: ${token.shapes.small};
  color: ${token.colors.gray.gray70};
  background: ${token.colors.gray.gray0};
  line-height: 1;
  ${token.typography('body', 'sm', 'medium')}

  &:hover {
    background: ${token.colors.gray.gray10};
  }

  &:focus-visible {
    outline: 2px solid ${token.colors.primary.primary40};
    outline-offset: 2px;
  }

  &:disabled {
    cursor: default;
    opacity: 0.5;
  }
`

export const EmptyState = styled.p`
  width: 100%;
  padding: 80px 0;
  color: ${token.colors.gray.gray50};
  text-align: center;
  ${token.typography('body', 'md', 'medium')}
`

export const StatusState = styled.div`
  ${token.flexColumnCenter}
  width: 100%;
  gap: 16px;
  padding: 80px 0;
`

export const StatusText = styled.p`
  color: ${token.colors.gray.gray50};
  text-align: center;
  ${token.typography('body', 'md', 'medium')}
`

export const RetryButton = styled.button`
  padding: 10px 20px;
  border-radius: ${token.shapes.small};
  color: ${token.colors.gray.gray80};
  background: ${token.colors.gray.gray10};
  line-height: 1;
  ${token.typography('body', 'sm', 'medium')}

  &:hover {
    background: ${token.colors.gray.gray20};
  }

  &:focus-visible {
    outline: 2px solid ${token.colors.primary.primary40};
    outline-offset: 2px;
  }
`

export const ActionError = styled.p`
  width: 100%;
  color: ${token.colors.danger.danger20};
  text-align: right;
  ${token.typography('body', 'sm', 'medium')}
`
