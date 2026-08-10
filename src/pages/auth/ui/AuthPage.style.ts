import styled from 'styled-components'

import { tokens } from '@/shared/styles'

export const Container = styled.main`
  ${tokens.flexCenter}
  min-height: 100dvh;
  background: ${tokens.colors.white};
`

export const Title = styled.h1`
  color: ${tokens.colors.gray.gray90};
  ${tokens.typography('heading', 'md', 'bold')}
`
