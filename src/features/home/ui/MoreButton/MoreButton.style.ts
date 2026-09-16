import styled from 'styled-components'

import * as token from '@/shared/styles/values/token'

export const Chip = styled.button`
  ${token.flexCenter}
  gap: 8px;
  width: 74px;
  height: 26px;
  border-radius: 15px;
  background: ${token.colors.primary.primary50};
  color: ${token.colors.primary.primary100};
  line-height: 1;
  ${token.typography('caption', 'sm', 'medium')}

  &:focus-visible {
    outline: 2px solid ${token.colors.primary.primary60};
    outline-offset: 2px;
  }
`

export const ArrowIcon = styled.img`
  width: 8px;
  height: 16px;
`
