import styled, { css, keyframes } from 'styled-components'

import * as token from '@/shared/styles/values/token'
import {
  studyModalBackdropAnimation,
  studyModalContentAnimation,
} from '../studyModalAnimation.style'

// Figma의 삭제 액션 기본 색상을 유지해 다른 주요 액션과 시각적 우선순위를 구분합니다.
const DELETE_BACKGROUND = '#F48771'
const SUCCESS_PARTICLE_COLORS = {
  primary: token.colors.primary.primary50,
  danger: token.colors.danger.danger10,
  success: token.colors.success.success10,
  info: token.colors.info.info10,
} as const

export const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 40px;
  overflow-y: auto;
  box-sizing: border-box;
  padding: 20px;
  background-color: rgb(12 16 20 / 70%);
  ${studyModalBackdropAnimation}
`;

export const Modal = styled.div<{ $readOnly: boolean }>`
  --modal-height: 650px;

  position: relative;
  box-sizing: border-box;
  width: ${({ $readOnly }) => ($readOnly ? '50%' : '594px')};
  max-width: 100%;
  max-height: calc(100vh - 40px);
  height: ${({ $readOnly }) =>
    $readOnly ? 'var(--modal-height)' : 'auto'};
  overflow-y: auto;
  border-radius: ${token.shapes.large};
  background-color: ${token.colors.white};
  box-shadow: 4px 4px 20px rgb(0 0 0 / 2%);
  padding: ${({ $readOnly }) => ($readOnly ? '30px' : '40px')};
  display: flex;
  flex-direction: column;
  gap: ${({ $readOnly }) => ($readOnly ? '14px' : '40px')};
  ${studyModalContentAnimation}

  @media (max-width: 720px) {
    width: 100%;
    height: auto;
    padding: 24px;
    gap: 32px;
  }
`;

const loadingSkeletonShimmer = keyframes`
  from {
    background-position: 200% 0;
  }

  to {
    background-position: -200% 0;
  }
`

const loadingSkeletonSurface = css`
  border-radius: ${token.shapes.xsmall};
  background: linear-gradient(
    90deg,
    ${token.colors.gray.gray0} 25%,
    ${token.colors.gray.gray10} 50%,
    ${token.colors.gray.gray0} 75%
  );
  background-size: 200% 100%;
  animation: ${loadingSkeletonShimmer} 1.4s ease-in-out infinite;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`

export const LoadingState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 16px;
  width: 100%;
  color: ${token.colors.gray.gray50};
`

export const LoadingSkeleton = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
`

export const LoadingSkeletonColumn = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`

export const LoadingSkeletonField = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
  }
`

export const LoadingSkeletonLabel = styled.span`
  ${loadingSkeletonSurface};
  display: block;
  width: 80px;
  height: 20px;
  flex: 0 0 auto;
`

export const LoadingSkeletonBox = styled.span<{ $multiline?: boolean }>`
  ${loadingSkeletonSurface};
  display: block;
  width: 380px;
  height: ${({ $multiline }) => ($multiline ? '120px' : '35px')};

  @media (max-width: 640px) {
    width: 100%;
  }
`

export const LoadingSkeletonCount = styled.span`
  ${loadingSkeletonSurface};
  display: block;
  width: 42px;
  height: 12px;
  align-self: flex-end;
  margin-top: 4px;
`

export const LoadingSkeletonDivider = styled.div`
  width: 100%;
  height: 2px;
  flex: 0 0 auto;
  background-color: ${token.colors.gray.gray0};
`

export const LoadingText = styled.p`
  ${token.typography('body', 'sm', 'medium')};
  margin: 0;
  align-self: center;
`

export const NavigationButton = styled.button<{
  $direction: 'previous' | 'next'
}>`
  position: absolute;
  top: 50%;
  ${({ $direction }) =>
    $direction === 'previous' ? 'left: -68px;' : 'right: -68px;'}
  transform: translateY(-50%);
  display: flex;
  width: 50px;
  height: 50px;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: 0;
  border-radius: ${token.shapes.xsmall};
  background-color: ${token.colors.white};
  color: ${token.colors.gray.gray50};
  cursor: pointer;

  svg {
    width: 28px;
    height: 28px;
  }

  &:hover {
    color: ${token.colors.gray.gray80};
    background-color: ${token.colors.gray.gray10};
  }
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
`;

export const Title = styled.h2`
  ${token.typography('heading', 'md', 'semibold')};
  margin: 0;
  line-height: normal;
  color: #181f29;
`;

export const Author = styled.span`
  ${token.typography('caption', 'sm', 'medium')};
  color: ${token.colors.gray.gray40};
`;

export const Form = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
`;

export const FormDivider = styled.div`
  width: 100%;
  height: 2px;
  flex: 0 0 auto;
  background-color: ${token.colors.gray.gray0};
`;

export const Div = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
  }
`;

export const Label = styled.label`
  ${token.typography('body', 'md', 'medium')};
  line-height: normal;
  color: ${token.colors.gray.gray70};
`;

export const Required = styled.span`
  ${token.typography('body', 'md', 'medium')};
  line-height: normal;
  color: ${token.colors.danger.danger20};
`;

export const Column = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const Input = styled.input<{ $readOnly: boolean }>`
  width: ${({ $readOnly }) => ($readOnly ? '70%' : '380px')};
  height: ${({ $readOnly }) => ($readOnly ? '40px' : '35px')};
  box-sizing: border-box;
  border-radius: ${token.shapes.xsmall};
  border: 1px solid ${token.colors.gray.gray10};
  padding: 0 10px;
  ${token.typography('body', 'sm', 'medium')};
  line-height: normal;
  color: ${token.colors.gray.gray70};

  &::placeholder {
    color: ${token.colors.gray.gray30};
  }

  &:focus {
    border-color: ${token.colors.primary.primary50};
    outline: none;
  }

  &:read-only {
    cursor: default;
  }

  @media (max-width: 640px) {
    width: 100%;
  }
`;

export const LearningInput = styled.textarea<{ $readOnly: boolean }>`
  width: ${({ $readOnly }) => ($readOnly ? '70%' : '380px')};
  height: ${({ $readOnly }) =>
    $readOnly ? 'calc(var(--modal-height) * 0.3)' : '120px'};
  box-sizing: border-box;
  padding: 10px;
  resize: none;

  border: 1px solid ${token.colors.gray.gray10};
  border-radius: ${token.shapes.xsmall};
  ${token.typography('body', 'sm', 'medium')};
  line-height: normal;
  color: ${token.colors.gray.gray70};

  &::placeholder {
    color: ${token.colors.gray.gray30};
  }

  &:focus {
    border-color: ${token.colors.primary.primary50};
    outline: none;
  }

  &:read-only {
    cursor: default;
  }

  @media (max-width: 640px) {
    width: 100%;
  }
`;

export const LetterCount = styled.span`
  ${token.typography('caption', 'sm', 'medium')};
  font-size: 10px;
  line-height: normal;
  color: ${token.colors.gray.gray80};
  text-align: right;
`;

export const ButtonContainer = styled.div<{ $readOnly: boolean }>`
  display: flex;
  justify-content: flex-end;
  gap: ${({ $readOnly }) => ($readOnly ? '10px' : '20px')};
  margin-top: ${({ $readOnly }) => ($readOnly ? 'auto' : '0')};
`;

export const CancelButton = styled.button`
  width: 100px;
  height: 36px;
  padding: 0;
  border-radius: ${token.shapes.xsmall};
  border: 1px solid ${token.colors.gray.gray0};
  background-color: ${token.colors.white};
  ${token.typography('body', 'sm', 'bold')};
  line-height: normal;
  color: ${token.colors.gray.gray80};
  cursor: pointer;

  &:hover {
    background-color: ${token.colors.gray.gray10};
  }
`;

export const SubmitButton = styled.button`
  display: flex;
  width: 100px;
  height: 36px;
  align-items: center;
  justify-content: center;
  padding: 0;
  border-radius: ${token.shapes.xsmall};
  border: none;
  background-color: ${token.colors.primary.primary50};
  ${token.typography('body', 'sm', 'bold')};
  line-height: normal;
  color: ${token.colors.gray.gray80};
  cursor: pointer;

  &:hover {
    background-color: ${token.colors.primary.primary60};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.75;
  }
`;

export const SubmitButtonContent = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
`

const submitLoadingSpin = keyframes`
  to {
    transform: rotate(360deg);
  }
`

export const SubmitLoadingSpinner = styled.span`
  display: inline-block;
  width: 14px;
  height: 14px;
  box-sizing: border-box;
  border: 2px solid rgb(55 54 47 / 25%);
  border-top-color: ${token.colors.gray.gray80};
  border-radius: ${token.shapes.circle};
  animation: ${submitLoadingSpin} 700ms linear infinite;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`

export const DeleteAction = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  height: 36px;
  padding: 9px 37px;
  border: 0;
  border-radius: ${token.shapes.xsmall};
  background-color: ${DELETE_BACKGROUND};
  ${token.typography('body', 'sm', 'bold')};
  line-height: normal;
  color: ${token.colors.white};
  cursor: pointer;

  img {
    width: 16px;
    height: 16px;
    flex: 0 0 16px;
    object-fit: contain;
  }

  &:focus-visible {
    outline: 2px solid ${token.colors.white};
    outline-offset: 2px;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const successEffectEnter = keyframes`
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
`

const successMarkEnter = keyframes`
  0% {
    opacity: 0;
    transform: scale(0.4) rotate(-12deg);
  }

  65% {
    transform: scale(1.12) rotate(3deg);
  }

  100% {
    opacity: 1;
    transform: scale(1) rotate(0deg);
  }
`

const successParticleBurst = keyframes`
  0% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.5) rotate(0deg);
  }

  20% {
    opacity: 1;
  }

  100% {
    opacity: 0;
    transform: translate(
      calc(-50% + var(--success-particle-x)),
      calc(-50% + var(--success-particle-y))
    ) scale(1) rotate(var(--success-particle-rotation));
  }
`

export const SuccessEffect = styled.div`
  position: absolute;
  inset: 0;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: ${token.shapes.large};
  background-color: rgb(255 255 255 / 96%);
  animation: ${successEffectEnter} 180ms ease-out both;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`

export const SuccessParticles = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
`

export const SuccessParticle = styled.span<{
  $color: keyof typeof SUCCESS_PARTICLE_COLORS
  $x: number
  $y: number
  $rotation: number
  $delay: number
}>`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 8px;
  height: 14px;
  border-radius: 2px;
  background-color: ${({ $color }) => SUCCESS_PARTICLE_COLORS[$color]};
  opacity: 0;
  --success-particle-x: ${({ $x }) => `${$x}px`};
  --success-particle-y: ${({ $y }) => `${$y}px`};
  --success-particle-rotation: ${({ $rotation }) => `${$rotation}deg`};
  animation: ${successParticleBurst} 820ms cubic-bezier(0.22, 0.61, 0.36, 1)
    ${({ $delay }) => `${$delay}ms`} both;

  @media (prefers-reduced-motion: reduce) {
    display: none;
  }
`

export const SuccessContent = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
`

export const SuccessMark = styled.span`
  display: flex;
  width: 64px;
  height: 64px;
  align-items: center;
  justify-content: center;
  border-radius: ${token.shapes.circle};
  background-color: ${token.colors.success.success10};
  ${token.typography('heading', 'lg', 'semibold')};
  line-height: 1;
  color: ${token.colors.white};
  animation: ${successMarkEnter} 420ms cubic-bezier(0.34, 1.56, 0.64, 1) both;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`

export const SuccessMessage = styled.p`
  ${token.typography('body', 'md', 'semibold')};
  margin: 0;
  line-height: normal;
  color: ${token.colors.gray.gray80};
`
