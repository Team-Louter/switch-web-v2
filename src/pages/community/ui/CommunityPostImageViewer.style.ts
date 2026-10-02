import styled from 'styled-components';

import { tokens as token } from '@/shared/styles';

export const CloseButton = styled.button`
  display: flex;
  position: fixed;
  top: 20px;
  right: 20px;
  width: 40px;
  height: 40px;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: 0;
  border-radius: ${token.shapes.small};
  color: ${token.colors.white};
  background: rgba(255, 255, 255, 0.12);
  cursor: pointer;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }

  &:focus-visible {
    outline: 2px solid ${token.colors.primary.primary60};
    outline-offset: 2px;
  }
`;

export const Image = styled.img<{ $aspectRatio: number }>`
  display: block;
  width: min(560px, calc(100vw - 40px), calc(min(420px, calc(100dvh - 80px)) * ${({ $aspectRatio }) => $aspectRatio}));
  height: auto;
  max-height: min(420px, calc(100dvh - 80px));
  border-radius: ${token.shapes.small};
  object-fit: contain;
`;

export const ErrorMessage = styled.p`
  padding: 20px;
  color: ${token.colors.white};
  ${token.typography('body', 'md', 'medium')}
`;
