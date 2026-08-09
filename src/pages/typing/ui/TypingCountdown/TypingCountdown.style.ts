import styled from 'styled-components'

import * as token from '@/shared/styles/values/token'

export const Overlay = styled.div`
  position: fixed;
  z-index: 1000;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgb(14 13 12 / 70%);
  color: ${token.colors.primary.primary0};

  svg {
    width: 8.5rem;
    height: 8.5rem;
  }
`
