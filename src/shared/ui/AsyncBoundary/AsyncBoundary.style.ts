import styled from 'styled-components'

import { tokens } from '@/shared/styles'

export const Status = styled.div`
  display: flex;
  min-height: 160px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 24px;
  color: ${tokens.colors.gray.gray60};
`
