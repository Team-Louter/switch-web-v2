import styled from 'styled-components'

import * as token from '@/shared/styles/values/token'

export const Intro = styled.div<{ $logoBelowTitle: boolean }>`
  ${token.flexColumn}
  align-items: center;
  gap: ${({ $logoBelowTitle }) => ($logoBelowTitle ? '12px' : '20px')};
  width: ${({ $logoBelowTitle }) => ($logoBelowTitle ? '100%' : 'auto')};
`

export const IntroDivider = styled.div`
  width: 100%;
  height: 1px;
  background: ${token.colors.gray.gray10};
`

export const PartnerLogo = styled.img<{
  $isSwitchLogo: boolean
  $isCompactLogo: boolean
}>`
  width: ${({ $isSwitchLogo, $isCompactLogo }) =>
    $isSwitchLogo ? ($isCompactLogo ? '64px' : '112px') : '40px'};
  height: ${({ $isSwitchLogo, $isCompactLogo }) =>
    $isSwitchLogo ? ($isCompactLogo ? '18px' : '31px') : '40px'};
  border-radius: ${({ $isSwitchLogo }) =>
    $isSwitchLogo ? '0' : token.shapes.small};
  object-fit: contain;
`

export const Copy = styled.div`
  ${token.flexColumn}
  align-items: center;
  gap: 8px;
  text-align: center;
`

export const Title = styled.h1`
  color: ${token.colors.gray.gray80};
  line-height: 1.3;
  letter-spacing: -0.48px;
  ${token.typography('heading', 'md', 'bold')}
`

export const Subtitle = styled.p`
  color: ${token.colors.gray.gray50};
  line-height: 1.3;
  letter-spacing: -0.28px;
  ${token.typography('body', 'sm', 'medium')}
`
