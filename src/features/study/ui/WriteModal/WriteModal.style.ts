import styled, { keyframes } from 'styled-components'

import * as token from '@/shared/styles/values/token'
import {
  studyModalBackdropAnimation,
  studyModalContentAnimation,
} from '../studyModalAnimation.style'

// 삭제 액션은 호버 시에도 같은 계열 안에서 자연스럽게 어두워지도록 별도 색상을 사용합니다.
const DELETE_BACKGROUND = '#F48771'
const DELETE_HOVER_BACKGROUND = '#F8A08D'

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

const loadingSpin = keyframes`
  to {
    transform: rotate(360deg);
  }
`

export const LoadingState = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: ${token.colors.gray.gray50};
`

export const LoadingIndicator = styled.span`
  display: block;
  width: 28px;
  height: 28px;
  border: 3px solid ${token.colors.gray.gray10};
  border-top-color: ${token.colors.primary.primary50};
  border-radius: ${token.shapes.circle};
  animation: ${loadingSpin} 700ms linear infinite;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`

export const LoadingText = styled.p`
  ${token.typography('body', 'sm', 'medium')};
  margin: 0;
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
  width: 100px;
  height: 36px;
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
`;

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

  &:hover {
    background-color: ${DELETE_HOVER_BACKGROUND};
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
