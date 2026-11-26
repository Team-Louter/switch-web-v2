import styled from 'styled-components';

import * as token from '@/shared/styles/values/token';

export const LinkSource = styled.a`
  color: ${token.colors.primary.primary80};
  overflow-wrap: anywhere;
  text-decoration: underline;
  text-underline-offset: 2px;

  &:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: 2px;
  }
`;

export const LinkCard = styled.div`
  width: min(100%, 640px);
  box-sizing: border-box;
  margin: 6px 0 12px;
  overflow: hidden;
  border: 1px solid ${token.colors.gray.gray20};
  border-left: 4px solid ${token.colors.primary.primary50};
  border-radius: 8px;
  background: ${token.colors.gray.gray0};
`;

export const LinkDetails = styled.a<{ $layout?: 'large' | 'thumbnail' }>`
  display: flex;
  flex-direction: ${({ $layout }) => $layout === 'thumbnail' ? 'row' : 'column'};
  align-items: ${({ $layout }) => $layout === 'thumbnail' ? 'flex-start' : 'stretch'};
  gap: 16px;
  padding: 18px 20px;
  overflow-wrap: anywhere;

  && {
    text-decoration: none;
  }

  &:hover {
    background: ${token.colors.gray.gray10};
  }
  &:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: -3px;
  }
`;

export const LinkText = styled.div`
  display: flex;
  flex: 1;
  min-width: 0;
  flex-direction: column;
  gap: 8px;
`;

export const LinkDescription = styled.span`
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
  color: ${token.colors.gray.gray80};
  font-size: 14px;
  line-height: 1.5;
`;

export const LinkImage = styled.img<{ $layout: 'large' | 'thumbnail' }>`
  display: block;
  flex-shrink: 0;
  width: ${({ $layout }) => $layout === 'large' ? '100%' : '96px'};
  height: ${({ $layout }) => $layout === 'large' ? 'auto' : '96px'};
  max-height: ${({ $layout }) => $layout === 'large' ? '360px' : '96px'};
  object-fit: contain;
  border-radius: 6px;
  background: ${token.colors.gray.gray10};

  @media (max-width: 480px) {
    width: ${({ $layout }) => $layout === 'large' ? '100%' : '64px'};
    height: ${({ $layout }) => $layout === 'large' ? 'auto' : '64px'};
  }
`;

export const LinkProvider = styled.span`
  color: ${token.colors.gray.gray60};
  font-size: 13px;
`;

export const LinkTitle = styled.strong`
  color: ${token.colors.gray.gray100};
  font-size: 17px;
`;
