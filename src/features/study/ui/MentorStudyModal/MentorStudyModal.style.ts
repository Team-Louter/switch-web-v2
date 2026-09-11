import styled, { keyframes } from 'styled-components'

import * as token from '@/shared/styles/values/token'
import {
  studyModalBackdropAnimation,
  studyModalContentAnimation,
} from '../studyModalAnimation.style'

export const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1000;
  overflow-y: auto;
  padding: 64px 48px;
  background-color: rgb(14 13 12 / 70%);

  @media (max-width: 720px) {
    padding: 40px 20px;
  }

  ${studyModalBackdropAnimation}
`

export const Content = styled.div`
  width: min(100%, 1488px);
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  ${studyModalContentAnimation}
`

const loadingSpin = keyframes`
  to {
    transform: rotate(360deg);
  }
`

export const LoadingState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  min-height: 220px;
  color: ${token.colors.white};
`

export const LoadingIndicator = styled.span`
  display: block;
  width: 28px;
  height: 28px;
  border: 3px solid rgb(255 255 255 / 35%);
  border-top-color: ${token.colors.white};
  border-radius: ${token.shapes.circle};
  animation: ${loadingSpin} 700ms linear infinite;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`

export const LoadingText = styled.p`
  ${token.typography('body', 'md', 'medium')};
  margin: 0;
`

export const Title = styled.h2`
  ${token.typography('heading', 'lg', 'bold')};
  margin: 0 0 50px;
  color: ${token.colors.white};
  text-align: center;
`

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 300px));
  gap: 44px;
`

export const EmptyMessage = styled.p`
  ${token.typography('body', 'lg', 'medium')};
  margin: 0;
  color: ${token.colors.white};
  text-align: center;
`
