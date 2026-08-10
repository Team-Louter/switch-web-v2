import styled from 'styled-components'

import * as token from '@/shared/styles/values/token'

export const WidgetShell = styled.div`
  position: relative;
  width: 100%;
  min-height: 65px;
  overflow: hidden;
  border-radius: ${token.shapes.xsmall};
  background: ${token.colors.white};
`

export const WidgetContainer = styled.div`
  width: 100%;
  min-height: 65px;

  iframe {
    display: block;
    max-width: 100%;
  }
`

export const StatusMessage = styled.p`
  ${token.flexCenter}
  position: absolute;
  inset: 0;
  border: 1px solid ${token.colors.gray.gray10};
  color: ${token.colors.gray.gray50};
  background: ${token.colors.gray.gray0};
  text-align: center;
  ${token.typography('caption', 'md', 'medium')}
`
