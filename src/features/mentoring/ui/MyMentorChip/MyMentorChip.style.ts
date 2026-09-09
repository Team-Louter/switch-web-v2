import styled from 'styled-components'

import * as token from '@/shared/styles/values/token'

export const Chip = styled.div`
  ${token.flexCenter}
  gap: 12px;
  padding: 12px 24px;
  border-radius: 24px;
  background-color: ${token.colors.gray.gray0};
`

export const Label = styled.span`
  ${token.typography('heading', 'sm', 'medium')}
  color: ${token.colors.gray.gray50};
`

export const Divider = styled.span`
  width: 1px;
  height: 39px;
  background-color: ${token.colors.gray.gray20};
`

export const MentorGroup = styled.div`
  ${token.flexLeft}
  gap: 16px;
`

export const AvatarGroup = styled.div`
  ${token.flexLeft}

  & > *:not(:first-child) {
    margin-left: -26px;
  }
`

export const MentorName = styled.p`
  ${token.typography('heading', 'sm', 'medium')}
  margin: 0;
  color: ${token.colors.gray.gray80};
`

export const RestCount = styled.span`
  ${token.typography('heading', 'sm', 'regular')}
  color: ${token.colors.gray.gray50};
`
