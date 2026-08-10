import styled from 'styled-components'

import * as token from '@/shared/styles/values/token'

export const Intro = styled.div`
  ${token.flexColumn}
  align-items: center;
  gap: 20px;
`

export const PartnerLogo = styled.img`
  width: 40px;
  height: 40px;
  border-radius: ${token.shapes.small};
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
