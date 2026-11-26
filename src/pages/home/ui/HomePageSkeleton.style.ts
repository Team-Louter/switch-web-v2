import styled, { keyframes } from 'styled-components'

import * as token from '@/shared/styles/values/token'

import { Canvas } from './HomePage.style'

const shimmer = keyframes`
  from { background-position: 100% 0; }
  to { background-position: -100% 0; }
`

export const Layout = styled(Canvas)`
  aspect-ratio: 1280 / 675;
  height: auto;
  column-gap: 2.5%;
  animation: none;

  @media (max-width: 768px) {
    aspect-ratio: auto;
  }
`

const Panel = styled.div`
  min-width: 0;
  border: 1px solid ${token.colors.gray.gray10};
  border-radius: ${token.shapes.small};
  background: ${token.colors.white};
`

const Surface = styled.span`
  display: block;
  border-radius: ${token.shapes.small};
  background: linear-gradient(
    90deg,
    ${token.colors.gray.gray0} 25%,
    ${token.colors.gray.gray10} 50%,
    ${token.colors.gray.gray0} 75%
  );
  background-size: 200% 100%;

  @media (prefers-reduced-motion: no-preference) {
    animation: ${shimmer} 1.4s ease-in-out infinite;
  }
`

export const Calendar = styled(Panel)`
  display: flex;
  height: 100%;
  flex-direction: column;
`

export const MonthTitle = styled(Surface)`
  align-self: center;
  width: 20%;
  height: clamp(14px, 2vw, 24px);
  margin-block: clamp(12px, 2vw, 24px);
`

export const MonthGrid = styled.div`
  flex: 1;
  border-top: 1px solid ${token.colors.gray.gray10};
  background-image:
    linear-gradient(to left, ${token.colors.gray.gray10} 1px, transparent 1px),
    linear-gradient(to top, ${token.colors.gray.gray10} 1px, transparent 1px);
  background-size: calc(100% / 7) calc(100% / 6);
`

export const Cards = styled.div`
  display: grid;
  grid-template-rows: minmax(0, 35fr) minmax(0, 52fr);
  row-gap: 4%;

  @media (max-width: 768px) {
    min-height: 620px;
  }
`

export const Card = styled(Panel)`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: clamp(12px, 2vw, 20px);
`

export const Profile = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`

export const Avatar = styled(Surface)`
  width: clamp(32px, 4vw, 60px);
  aspect-ratio: 1;
  flex-shrink: 0;
  border-radius: 50%;
`

export const Line = styled(Surface)<{ $width: string }>`
  width: min(100%, ${({ $width }) => $width});
  height: 16px;
`
