import styled from 'styled-components';

import { tokens as token } from '@/shared/styles';

export const Preview = styled.div`
  display: flex;
  width: fit-content;
  max-width: min(100%, 360px);
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
  margin-top: 10px;
`;

export const PreviewButton = styled.button`
  display: block;
  max-width: 100%;
  padding: 0;
  border: 0;
  border-radius: ${token.shapes.small};
  background: transparent;
  cursor: zoom-in;

  &:focus-visible {
    outline: 2px solid ${token.colors.primary.primary60};
    outline-offset: 3px;
  }
`;

export const PreviewImage = styled.img`
  display: block;
  max-width: 100%;
  max-height: 320px;
  border-radius: ${token.shapes.small};
  object-fit: contain;
  background: ${token.colors.gray.gray0};
`;

export const Attribution = styled.span`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  color: ${token.colors.gray.gray60};
  overflow-wrap: anywhere;
  ${token.typography('body', 'sm', 'medium')}
`;

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

export const ExpandedImage = styled.img<{ $aspectRatio: number }>`
  display: block;
  width: min(720px, calc(100vw - 40px), calc(min(560px, calc(100dvh - 80px)) * ${({ $aspectRatio }) => $aspectRatio}));
  height: auto;
  max-height: min(560px, calc(100dvh - 80px));
  border-radius: ${token.shapes.small};
  object-fit: contain;
`;

export const FallbackLink = styled.a`
  display: inline-block;
  max-width: 100%;
  margin-top: 10px;
  color: ${token.colors.primary.primary80};
  text-decoration: underline;
  text-underline-offset: 2px;
  overflow-wrap: anywhere;
  ${token.typography('body', 'md', 'medium')}
`;
