import styled from 'styled-components'

import { tokens as token } from '@/shared/styles'
import type { CommunityFileKind } from '../model/communityAttachment'

const FILE_COLORS: Record<CommunityFileKind, string> = {
  pdf: token.colors.danger.danger20,
  document: token.colors.info.info20,
  spreadsheet: token.colors.success.success20,
  presentation: token.colors.warning.warning20,
  archive: token.colors.primary.primary70,
  code: token.colors.gray.gray70,
  audio: token.colors.info.info30,
  video: token.colors.danger.danger30,
  file: token.colors.gray.gray50,
}

export const Card = styled.button<{ $compact: boolean }>`
  display: flex;
  align-items: center;
  box-sizing: border-box;
  width: ${({ $compact }) => $compact ? '100%' : 'min(100%, 420px)'};
  min-width: 0;
  gap: ${({ $compact }) => $compact ? '12px' : '16px'};
  padding: ${({ $compact }) => $compact ? '12px' : '18px 20px'};
  margin: 4px 0;
  border: 1px solid ${token.colors.gray.gray10};
  border-radius: 12px;
  background: ${token.colors.gray.gray0};
  text-align: left;
  cursor: pointer;
  transition: background 150ms ease, border-color 150ms ease;

  &:hover {
    border-color: ${token.colors.gray.gray20};
    background: ${token.colors.white};
  }
  &:focus-visible { outline: 2px solid ${token.colors.primary.primary50}; outline-offset: 3px; }
  @media (max-width: 480px) { gap: 12px; padding: 14px; }
  @media (prefers-reduced-motion: reduce) { transition: none; }
`

export const Icon = styled.span<{ $kind: CommunityFileKind; $compact: boolean }>`
  display: flex;
  flex: 0 0 auto;
  color: ${({ $kind }) => FILE_COLORS[$kind]};
  font-size: ${({ $compact }) => $compact ? '32px' : '44px'};
`
export const Details = styled.span`
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
  gap: 5px;
`
export const Name = styled.span`
  overflow: hidden;
  color: ${token.colors.info.info20};
  ${token.typography('body', 'lg', 'medium')}
  line-height: 1.4;
  text-overflow: ellipsis;
  white-space: nowrap;
`
export const Size = styled.span`
  color: ${token.colors.gray.gray60};
  ${token.typography('body', 'sm', 'regular')}
  line-height: 1.4;
`
