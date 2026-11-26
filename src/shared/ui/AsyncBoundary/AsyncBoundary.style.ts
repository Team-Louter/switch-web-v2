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

export const Loading = styled.div`
  display: grid;
  gap: 28px;
  width: 100%;
  max-width: 1120px;
  box-sizing: border-box;
  margin-inline: auto;
  padding: clamp(16px, 3vw, 32px);
`

export const LoadingTitle = styled.div`
  width: min(200px, 60%);
  height: 32px;
  border-radius: ${tokens.shapes.small};
  background: ${tokens.colors.gray.gray0};
`

export const LoadingContent = styled.div`
  display: grid;
  gap: 16px;
`

export const LoadingRow = styled.div`
  height: 44px;
  border-radius: ${tokens.shapes.small};
  background: ${tokens.colors.gray.gray0};
`
