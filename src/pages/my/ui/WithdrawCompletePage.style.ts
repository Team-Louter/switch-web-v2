import styled from 'styled-components'

import * as token from '@/shared/styles/values/token'

export const Page = styled.section`
  ${token.flexColumnCenter}
  position: relative;
  width: 100%;
  min-height: 85vh;
  gap: 36px;
  background: ${token.colors.white};
`

export const Logo = styled.img`
  width: 140px;
  height: auto;
`

export const Title = styled.h1`
  margin: 0;
  color: ${token.colors.gray.gray80};
  text-align: center;
  letter-spacing: -0.5px;

  strong {
    ${token.typography('heading', 'xxl', 'bold')}
  }

  span {
    ${token.typography('heading', 'xxl', 'regular')}
  }
`

export const Description = styled.p`
  margin: -12px 0 0;
  color: ${token.colors.gray.gray80};
  text-align: center;
  ${token.typography('heading', 'sm', 'semibold')}
`

export const ButtonRow = styled.div`
  display: flex;
  gap: 14px;
`

export const LoginButton = styled.button`
  width: 94px;
  padding: 10px 0;
  border: 1.5px solid ${token.colors.gray.gray20};
  border-radius: ${token.shapes.xsmall};
  color: ${token.colors.gray.gray80};
  background: ${token.colors.white};
  cursor: pointer;
  transition: background-color 150ms;
  ${token.typography('body', 'md', 'semibold')}

  &:hover {
    background: ${token.colors.gray.gray0};
  }
`

export const SignupButton = styled.button`
  width: 94px;
  padding: 10px 0;
  border: 0;
  border-radius: ${token.shapes.xsmall};
  color: ${token.colors.gray.gray80};
  background: ${token.colors.primary.primary40};
  cursor: pointer;
  transition: background-color 150ms;
  ${token.typography('body', 'md', 'bold')}

  &:hover {
    background: ${token.colors.primary.primary50};
  }
`

export const Footer = styled.footer`
  ${token.flexColumnCenter}
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 32px 0;
  gap: 10px;
`

export const FooterLouter = styled.span`
  color: ${token.colors.gray.gray50};
  letter-spacing: 0.5px;
  ${token.typography('body', 'sm', 'regular')}
`

export const FooterGithub = styled.a`
  margin-top: 2px;
  color: ${token.colors.gray.gray80};
  text-decoration: none;
  ${token.typography('body', 'sm', 'semibold')}

  &:hover {
    text-decoration: underline;
  }
`
