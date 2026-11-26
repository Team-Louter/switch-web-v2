import styled from 'styled-components';

import * as token from '@/shared/styles/values/token';
import { Button } from '@/shared/ui';

export const WriteButton = styled(Button)`
  gap: 6px;
  color: ${token.colors.gray.gray100};
  ${token.typography('body', 'sm', 'bold')}

  svg {
    flex: 0 0 auto;
    color: currentColor;
  }
`;

export const CategoryTabs = styled.div`
  display: flex;
  justify-content: flex-start;
  box-sizing: border-box;
  flex: 1 1 0;
  min-width: 0;
  min-height: 44px;
  padding: 0 4px;
  overflow-x: auto;
  border-bottom: 1px solid ${token.colors.gray.gray10};
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }

  @container community-page (max-width: 900px) {
    flex-wrap: nowrap;
    padding-inline: 2px;
    overflow: visible;
  }

  @container community-page (max-width: 1020px) {
    display: none;
  }
`;

export const CategoryTab = styled.button<{ $active: boolean }>`
  position: relative;
  flex: 1 0 112px;
  min-height: 44px;
  border: 0;
  color: ${({ $active }) =>
    $active ? token.colors.gray.gray100 : token.colors.gray.gray60};
  background: transparent;
  ${token.typography('body', 'md', 'medium')}
  line-height: 1;
  cursor: pointer;

  &::after {
    position: absolute;
    right: 12px;
    bottom: -1px;
    left: 12px;
    height: 3px;
    background: ${({ $active }) =>
      $active ? token.colors.primary.primary40 : 'transparent'};
    content: '';
  }

  @container community-page (max-width: 900px) {
    flex: 1 1 auto;
    min-width: 0;
    padding-inline: 2px;
    font-size: 13px;
    white-space: nowrap;

    &::after {
      right: 4px;
      left: 4px;
      height: 2px;
    }
  }

  @container community-page (max-width: 1020px) {
    display: none;
  }
`;

export const MobileCategoryMenu = styled.div`
  position: relative;
  display: none;
  flex: 1 1 0;
  min-width: 0;

  @container community-page (max-width: 1020px) {
    display: block;
  }
`;

export const MobileCategoryButton = styled.button`
  display: flex;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  min-height: 44px;
  padding: 0 8px;
  border: 0;
  border-bottom: 1px solid ${token.colors.gray.gray10};
  color: ${token.colors.gray.gray100};
  background: transparent;
  ${token.typography('body', 'sm', 'semibold')}
  line-height: 1;
  cursor: pointer;

  &:focus-visible {
    outline: 2px solid ${token.colors.primary.primary50};
    outline-offset: -2px;
  }
`;

export const MobileCategoryButtonLabel = styled.span`
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 8px;

  svg {
    flex: 0 0 auto;
    color: ${token.colors.gray.gray80};
  }

  span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

export const MobileCategoryPanel = styled.div<{ $open: boolean }>`
  position: absolute;
  z-index: 20;
  top: calc(100% + 6px);
  right: auto;
  left: 0;
  width: 162px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  padding: 6px;
  border: 1px solid ${token.colors.gray.gray10};
  border-radius: ${token.shapes.medium};
  background: ${token.colors.white};
  box-shadow: 0 8px 20px rgb(0 0 0 / 12%);
  opacity: ${({ $open }) => ($open ? 1 : 0)};
  pointer-events: ${({ $open }) => ($open ? 'auto' : 'none')};
  transform: ${({ $open }) =>
    $open ? 'translateY(0)' : 'translateY(-8px)'};
  transition:
    opacity 180ms ease,
    transform 180ms ease,
    visibility 180ms ease;
  visibility: ${({ $open }) => ($open ? 'visible' : 'hidden')};

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

export const MobileCategoryOption = styled.button<{ $active: boolean }>`
  width: 100%;
  min-width: 0;
  min-height: 36px;
  padding: 8px;
  overflow: hidden;
  border: 0;
  border-radius: ${token.shapes.small};
  color: ${({ $active }) =>
    $active ? token.colors.gray.gray100 : token.colors.gray.gray60};
  background: ${({ $active }) =>
    $active ? token.colors.primary.primary10 : 'transparent'};
  ${token.typography('body', 'sm', 'medium')}
  font-weight: ${({ $active }) =>
    $active ? token.fontWeight.semibold : token.fontWeight.medium};
  text-align: left;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;

  &:hover {
    background: ${({ $active }) =>
      $active ? token.colors.primary.primary10 : token.colors.gray.gray0};
  }

  &:focus-visible {
    outline: 2px solid ${token.colors.primary.primary50};
    outline-offset: -2px;
  }
`;
