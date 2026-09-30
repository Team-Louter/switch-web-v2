import styled from 'styled-components';

import * as token from '@/shared/styles/values/token';

export const PreviewLink = styled.a`
  display: flex;
  width: fit-content;
  max-width: min(100%, 360px);
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
  margin-top: 10px;
  color: inherit;
  text-decoration: none;

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
  ${token.typography('body', 'sm', 'medium')}
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
