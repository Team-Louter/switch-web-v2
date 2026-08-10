import styled from 'styled-components'

import * as token from '@/shared/styles/values/token'

export const Wrap = styled.div`
  ${token.flexColumnStart}
  gap: 12px;
  width: 100%;
`

export const PillRow = styled.div`
  ${token.flexLeft}
  align-items: flex-start;
  gap: 16px;
`

export const Pill = styled.div`
  ${token.flexLeft}
  gap: 20px;
  padding: 8px 12px;
  overflow: hidden;
  border-radius: ${token.shapes.small};
  background: ${token.colors.gray.gray0};
`

export const StatItem = styled.span`
  ${token.flexLeft}
  gap: 6px;
  color: ${token.colors.gray.gray70};
  ${token.typography('body', 'md', 'semibold')}
`

export const HeartButton = styled.button<{ $active: boolean }>`
  ${token.flexLeft}
  gap: 6px;
  color: ${token.colors.gray.gray70};
  ${token.typography('body', 'md', 'semibold')}

  &:disabled {
    cursor: not-allowed;
  }
`

export const IconBox = styled.span<{ $color: string }>`
  ${token.flexCenter}
  flex: 0 0 auto;
  width: 20px;
  height: 20px;
  color: ${({ $color }) => $color};
`

export const FilePill = styled(Pill)`
  gap: 12px;
  height: 36px;
`

export const FileSummary = styled.span`
  ${token.flexLeft}
  gap: 4px;
  color: ${token.colors.gray.gray70};
  white-space: nowrap;
  ${token.typography('body', 'md', 'medium')}
`

export const FileDivider = styled.span`
  flex: 0 0 auto;
  width: 1px;
  height: 22px;
  background: ${token.colors.gray.gray20};
`

export const FileToggleButton = styled.button<{ $open: boolean }>`
  ${token.flexCenter}
  flex: 0 0 auto;
  width: 20px;
  height: 12px;
  color: ${token.colors.gray.gray30};
  transform: rotate(${({ $open }) => ($open ? '180deg' : '0deg')});
  transition: transform 120ms ease;
`

export const FileList = styled.ul`
  ${token.flexColumnStart}
  gap: 8px;
  padding: 12px 16px;
  border-radius: ${token.shapes.small};
  background: ${token.colors.gray.gray0};
`

export const FileLink = styled.a`
  ${token.flexLeft}
  gap: 6px;
  color: ${token.colors.gray.gray70};
  ${token.typography('body', 'md', 'medium')}

  &:hover {
    color: ${token.colors.gray.gray90};
    text-decoration: underline;
  }
`
