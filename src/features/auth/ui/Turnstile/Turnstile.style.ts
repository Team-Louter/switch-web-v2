import styled from 'styled-components'

import * as token from '@/shared/styles/values/token'

const TURNSTILE_COMPACT_HEIGHT = '140px'
const TURNSTILE_COMPACT_WIDTH = '150px'
const TURNSTILE_DEFAULT_HEIGHT = '65px'

export const WidgetShell = styled.div<{ $isCompact: boolean }>`
  position: relative;
  flex: 0 0
    ${({ $isCompact }) =>
      $isCompact ? TURNSTILE_COMPACT_HEIGHT : TURNSTILE_DEFAULT_HEIGHT};
  width: ${({ $isCompact }) =>
    $isCompact ? TURNSTILE_COMPACT_WIDTH : '100%'};
  height: ${({ $isCompact }) =>
    $isCompact ? TURNSTILE_COMPACT_HEIGHT : TURNSTILE_DEFAULT_HEIGHT};
  overflow: hidden;
  border-radius: ${token.shapes.xsmall};
  background: ${token.colors.white};
`

export const WidgetContainer = styled.div`
  width: 100%;
  height: 100%;

  iframe {
    display: block;
    width: 100%;
    height: 100%;
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
