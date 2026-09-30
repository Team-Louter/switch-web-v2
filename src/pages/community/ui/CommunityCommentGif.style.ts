import styled from 'styled-components';

import { tokens as token } from '@/shared/styles';

export const GifButton = styled.button`
  display: grid;
  place-items: center;
  flex: 0 0 32px;
  width: 32px;
  height: 32px;
  padding: 0;
  border: 0;
  border-radius: ${token.shapes.small};
  background: transparent;
  cursor: pointer;

  &:hover:not(:disabled) {
    background: ${token.colors.gray.gray10};
  }
  &:focus-visible {
    outline: 2px solid ${token.colors.primary.primary50};
    outline-offset: 2px;
  }
  &:disabled {
    cursor: not-allowed;
    opacity: 0.45;
  }
`;

export const GifIcon = styled.img`
  width: 24px;
  height: 24px;
`;

export const Attachment = styled.div`
  position: relative;
  align-self: flex-start;
  width: fit-content;
  max-width: 100%;
  overflow: hidden;
  border: 1px solid ${token.colors.gray.gray20};
  border-radius: ${token.shapes.small};
  background: ${token.colors.white};
`;

export const PreviewImage = styled.img`
  display: block;
  width: auto;
  height: 120px;
  max-width: 100%;
  object-fit: contain;
`;

export const RemoveButton = styled.button`
  position: absolute;
  top: 6px;
  right: 6px;
  display: grid;
  place-items: center;
  width: 24px;
  height: 24px;
  padding: 0;
  border: 0;
  border-radius: ${token.shapes.circle};
  color: ${token.colors.white};
  background: rgba(0, 0, 0, 0.6);
  cursor: pointer;

  &:focus-visible {
    outline: 2px solid ${token.colors.primary.primary50};
    outline-offset: 2px;
  }
  &:disabled {
    cursor: not-allowed;
    opacity: 0.45;
  }
`;

export const GifBadge = styled.span`
  position: absolute;
  left: 6px;
  bottom: 6px;
  padding: 2px 5px;
  border-radius: 4px;
  color: ${token.colors.white};
  background: rgba(0, 0, 0, 0.6);
  ${token.typography('body', 'sm', 'semibold')}
`;

export const ImageError = styled.p`
  max-width: 180px;
  margin: 0;
  padding: 32px 28px 24px 12px;
  color: ${token.colors.gray.gray60};
  ${token.typography('body', 'sm', 'medium')}
`;
