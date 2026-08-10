import styled from 'styled-components'

import * as token from '@/shared/styles/values/token'

export const Panel = styled.div<{ $isPasswordStep: boolean }>`
  flex: 0 0 369px;
  width: 369px;
  height: ${({ $isPasswordStep }) => ($isPasswordStep ? '597px' : '549px')};
  overflow: hidden;
  border: 1px solid ${token.colors.gray.gray10};
  border-radius: 0 20px 20px 0;
  padding: 39px 27px 32px;
  background: ${token.colors.white};
  transition: height 320ms cubic-bezier(0.22, 1, 0.36, 1);

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }

  @media (max-width: 900px) {
    border-radius: 20px;
  }

  @media (max-width: 420px) {
    flex-basis: 100%;
    width: 100%;
    height: auto;
    padding: 32px 20px;
  }
`

export const Content = styled.div`
  ${token.flexColumn}
  align-items: center;
  gap: 20px;
  width: 313px;

  @media (max-width: 420px) {
    width: 100%;
  }
`

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

export const IntroCopy = styled.div`
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
