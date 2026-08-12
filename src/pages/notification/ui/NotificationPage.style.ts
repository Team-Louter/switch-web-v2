import styled from 'styled-components'

import * as token from '@/shared/styles/values/token'

export const Page = styled.main`
  ${token.flexColumn}
  align-items: center;
  min-height: 100dvh;
  padding: 50px 30px;
`

export const Content = styled.div`
  ${token.flexColumnStart}
  width: min(100%, 1000px);
  gap: 40px;
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
