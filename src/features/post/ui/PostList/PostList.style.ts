import styled from 'styled-components'

import * as token from '@/shared/styles/values/token'

export const List = styled.ul`
  ${token.flexColumnStart}
  width: 100%;
  overflow: hidden;
`

export const Row = styled.li`
  ${token.flexLeft}
  gap: 10px;
  box-sizing: border-box;
  width: 100%;
  height: 72px;
  padding: 10px;
  overflow: hidden;
  background: ${token.colors.white};
  cursor: pointer;
  transition: background-color 120ms ease;

  &:hover {
    background: ${token.colors.gray.gray0};
  }
`

export const PinBox = styled.span`
  ${token.flexCenter}
  flex: 0 0 auto;
  width: 28px;
  height: 28px;
  color: ${token.colors.warning.warning20};
`

export const Title = styled.p`
  flex: 1 1 0;
  min-width: 0;
  overflow: hidden;
  color: ${token.colors.gray.gray90};
  text-overflow: ellipsis;
  white-space: nowrap;
  ${token.typography('body', 'lg', 'semibold')}
`

export const Author = styled.div`
  ${token.flexCenter}
  flex: 0 0 120px;
  gap: 8px;
  overflow: hidden;
`

export const Avatar = styled.span`
  ${token.flexCenter}
  flex: 0 0 auto;
  width: 32px;
  height: 32px;
  overflow: hidden;
  border: 1px solid ${token.colors.gray.gray10};
  border-radius: ${token.shapes.circle};
  background: ${token.colors.white};

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`

export const AuthorName = styled.span`
  flex: 1 1 0;
  min-width: 0;
  overflow: hidden;
  color: ${token.colors.gray.gray70};
  text-overflow: ellipsis;
  white-space: nowrap;
  ${token.typography('body', 'lg', 'medium')}
`

export const CreatedAt = styled.span`
  ${token.flexCenter}
  flex: 0 0 176px;
  color: ${token.colors.gray.gray70};
  white-space: nowrap;
  ${token.typography('body', 'lg', 'medium')}
`

export const Stats = styled.div`
  ${token.flexCenter}
  flex: 0 0 214px;
  gap: 12px;
`

export const Stat = styled.span<{ $active?: boolean }>`
  ${token.flexLeft}
  flex: 0 0 53px;
  gap: 4px;
  color: ${token.colors.gray.gray70};
  ${token.typography('body', 'lg', 'medium')}

  svg {
    flex: 0 0 auto;
  }
`

export const IconBox = styled.span<{ $color: string }>`
  ${token.flexCenter}
  flex: 0 0 auto;
  width: 24px;
  height: 24px;
  color: ${({ $color }) => $color};
`

export const EmptyText = styled.p`
  ${token.flexCenter}
  width: 100%;
  padding: 80px 0;
  color: ${token.colors.gray.gray40};
  ${token.typography('body', 'lg', 'medium')}
`
