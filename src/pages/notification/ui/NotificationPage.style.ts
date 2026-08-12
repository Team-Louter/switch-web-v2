import styled from 'styled-components'

import * as token from '@/shared/styles/values/token'

export const Page = styled.main`
  ${token.flexColumn}
  align-items: center;
  min-height: 100dvh;
  padding: 50px 30px;

  @media (max-width: 760px) {
    padding: 32px 20px;
  }
`

export const Content = styled.div`
  ${token.flexColumnStart}
  width: min(100%, 1000px);
  gap: 40px;

  @media (max-width: 760px) {
    gap: 28px;
  }
`

export const Header = styled.header`
  ${token.flexBetween}
  width: 100%;
`

export const Title = styled.h1`
  color: ${token.colors.gray.gray80};
  line-height: 1;
  ${token.typography('body', 'lg', 'medium')}
`

export const HeaderActions = styled.div`
  ${token.flexLeft}
  gap: 20px;
`

export const ReadAllButton = styled.button`
  ${token.flexLeft}
  gap: 5px;
  color: ${token.colors.primary.primary70};
  line-height: 1;
  ${token.typography('body', 'md', 'semibold')}

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
  width: 20px;
  height: 20px;
  object-fit: contain;
`

export const SettingsButton = styled.button`
  ${token.flexCenter}
  width: 24px;
  height: 24px;
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
  width: 24px;
  height: 24px;
  object-fit: contain;
`

export const NotificationList = styled.div`
  ${token.flexColumnStart}
  width: 100%;
  gap: 20px;
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
