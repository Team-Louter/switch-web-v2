import styled from 'styled-components'

import * as token from '@/shared/styles/values/token'

export const Container = styled.section`
  ${token.flexCenter}
  min-height: 100vh;
  padding: 48px;
  background: ${token.colors.white};
`

export const Text = styled.p`
  color: ${token.colors.gray.gray90};
  ${token.typography('caption', 'md', 'medium')}
`
