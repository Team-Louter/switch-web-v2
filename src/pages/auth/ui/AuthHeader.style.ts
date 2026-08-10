import styled from 'styled-components'

import * as token from '@/shared/styles/values/token'

export const Header = styled.header`
  ${token.flexRow}
  align-items: center;
  width: 100%;
  height: 72px;
  padding: 0 80px;

  @media (max-width: 768px) {
    padding: 0 24px;
  }
`

export const BrandGroup = styled.div`
  ${token.flexRow}
  align-items: center;
  gap: 12px;
`

export const SwitchLogo = styled.img`
  width: 88px;
  height: 24px;
`

export const CollaborationMark = styled.span`
  color: ${token.colors.gray.gray50};
  line-height: 1;
  ${token.typography('caption', 'md', 'semibold')}
`

export const PartnerLogo = styled.img`
  width: 24px;
  height: 24px;
  border-radius: ${token.shapes.circle};
`
