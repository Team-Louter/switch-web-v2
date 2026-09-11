import styled from 'styled-components'

import * as token from '@/shared/styles/values/token'
import {
  studyModalBackdropAnimation,
  studyModalContentAnimation,
} from '../studyModalAnimation.style'

export const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgb(14 13 12 / 70%);
  ${studyModalBackdropAnimation}
`;

export const Modal = styled.div`
  --modal-height: 650px;

  position: relative;
  width: 50%;
  height: var(--modal-height);
  border-radius: ${token.shapes.small};
  background-color: ${token.colors.white};
  box-shadow: 0 16px 48px rgb(0 0 0 / 20%);
  padding: 30px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  ${studyModalContentAnimation}
`;

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
  color: ${token.colors.info.info40};
`;

export const Author = styled.span`
  ${token.typography('caption', 'sm', 'medium')};
  color: ${token.colors.gray.gray40};
`;

export const DeleteButton = styled.button`
  display: flex;
  width: 36px;
  height: 36px;
  align-items: center;
  justify-content: center;
  margin-right: auto;
  padding: 0;
  border: 0;
  border-radius: ${token.shapes.xsmall};
  background-color: transparent;
  color: ${token.colors.danger.danger10};
  cursor: pointer;

  svg {
    width: 22px;
    height: 22px;
  }

  &:hover {
    color: ${token.colors.danger.danger20};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

export const Div = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

export const Label = styled.label`
  ${token.typography('body', 'md', 'medium')};
  color: ${token.colors.gray.gray70};
`;

export const Required = styled.span`
  ${token.typography('body', 'md', 'medium')};
  color: ${token.colors.danger.danger20};
`;

export const Column = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const Input = styled.input`
  width: 70%;
  height: 40px;
  border-radius: ${token.shapes.xsmall};
  border: 1px solid ${token.colors.gray.gray10};
  padding: 0px 10px;
  ${token.typography('body', 'sm', 'medium')};
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
`;

export const LearningInput = styled.textarea`
  width: 70%;
  height: calc(var(--modal-height) * 0.3);
  padding: 10px;
  resize: none;

  border: 1px solid ${token.colors.gray.gray10};
  border-radius: ${token.shapes.xsmall};
  ${token.typography('body', 'sm', 'medium')};
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
`;

export const LetterCount = styled.span`
  font-size: 0.625rem;
  color: ${token.colors.gray.gray80};
  text-align: right;
`;

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: auto;
`;

export const CancelButton = styled.button`
  width: 100px;
  height: 35px;
  border-radius: ${token.shapes.xsmall};
  border: 1px solid ${token.colors.gray.gray0};
  background-color: ${token.colors.white};
  ${token.typography('body', 'sm', 'bold')};
  color: ${token.colors.gray.gray80};
  cursor: pointer;

  &:hover {
    background-color: ${token.colors.gray.gray10};
  }
`;

export const SubmitButton = styled.button`
  width: 100px;
  height: 35px;
  border-radius: ${token.shapes.xsmall};
  border: none;
  background-color: ${token.colors.primary.primary50};
  ${token.typography('body', 'sm', 'bold')};
  color: ${token.colors.gray.gray80};
  cursor: pointer;

  &:hover {
    background-color: ${token.colors.primary.primary60};
  }
`;
