import styled, { keyframes } from 'styled-components'

import * as token from '@/shared/styles/values/token'
import { Card as ModeCard } from '../ModeButton/ModeButton.style'

const shimmer = keyframes`
  from { background-position: 200% 0; }
  to { background-position: -200% 0; }
`

export const Placeholder = styled.span<{ $width: string; $height: string }>`
  display: block;
  flex-shrink: 0;
  width: ${({ $width }) => $width};
  max-width: 100%;
  height: ${({ $height }) => $height};
  border-radius: ${token.shapes.xsmall};
  background: linear-gradient(
    90deg,
    ${token.colors.gray.gray0} 25%,
    ${token.colors.gray.gray10} 50%,
    ${token.colors.gray.gray0} 75%
  );
  background-size: 200% 100%;
  animation: ${shimmer} 1.4s ease-in-out infinite;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`

export const Medal = styled(Placeholder)`
  width: 60px;
  height: 60px;
  border-radius: ${token.shapes.circle};

  @media (max-width: 768px) {
    width: 52px;
    height: 52px;
  }
`

export const Lines = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
`

export const RankingValue = styled(Placeholder)`
  margin-left: auto;
`

export const Mode = styled(ModeCard).attrs({ as: 'div', $selected: false })``
