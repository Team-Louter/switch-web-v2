import styled from 'styled-components'

import * as token from '@/shared/styles/values/token'

export const Row = styled.article`
  ${token.flexColumn}
  align-items: flex-start;
  justify-content: center;
  box-sizing: border-box;
  width: 100%;
  min-height: 56px;
  overflow: hidden;
  background: ${token.colors.white};
  cursor: pointer;
  transition: background-color 120ms ease;

  &:hover {
    background: ${token.colors.gray.gray0};
  }

  &:focus-visible {
    outline: 2px solid ${token.colors.primary.primary50};
    outline-offset: -2px;
  }
`

export const MainLine = styled.div<{ $hasComment: boolean }>`
  display: flex;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  min-height: ${({ $hasComment }) => ($hasComment ? '46px' : '56px')};
  gap: 10px;
  padding: ${({ $hasComment }) =>
    $hasComment ? '6px 10px 2px' : '6px 10px'};
`

export const CategoryBadge = styled.span`
  ${token.flexCenter}
  flex: 0 0 80px;
  box-sizing: border-box;
  min-height: 26px;
  padding: 3px 10px;
  border: 1px solid ${token.colors.primary.text};
  border-radius: 999px;
  color: ${token.colors.primary.primary80};
  background: transparent;
  line-height: 1;
  white-space: nowrap;
  ${token.typography('caption', 'lg', 'semibold')}
`

export const Title = styled.strong`
  flex: 1 1 0;
  min-width: 0;
  box-sizing: border-box;
  overflow: hidden;
  color: ${token.colors.gray.gray100};
  line-height: 1.2;
  text-overflow: ellipsis;
  white-space: nowrap;
  ${token.typography('body', 'md', 'medium')}
`

export const Author = styled.div`
  ${token.flexCenter}
  flex: 0 0 120px;
  box-sizing: border-box;
  min-width: 0;
  gap: 8px;
  overflow: hidden;
  padding: 6px 4px;
`

export const AuthorAvatar = styled.img`
  flex: 0 0 auto;
  width: 32px;
  height: 32px;
  overflow: hidden;
  border-radius: ${token.shapes.circle};
  object-fit: cover;
`

export const AuthorName = styled.span`
  flex: 0 0 72px;
  overflow: hidden;
  color: ${token.colors.gray.gray80};
  line-height: 1.2;
  text-overflow: ellipsis;
  white-space: nowrap;
  ${token.typography('body', 'sm', 'medium')}
`

export const DateText = styled.span`
  ${token.flexCenter}
  flex: 0 0 176px;
  box-sizing: border-box;
  padding: 6px 10px;
  color: ${token.colors.gray.gray80};
  line-height: 1.2;
  text-align: center;
  white-space: nowrap;
  ${token.typography('body', 'sm', 'medium')}
`

export const Metrics = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  flex: 0 0 180px;
  box-sizing: border-box;
  overflow: hidden;
  padding: 8px 12px;
`

export const Metric = styled.span`
  ${token.flexLeft}
  justify-content: flex-start;
  min-width: 0;
  gap: 3px;
  color: ${token.colors.gray.gray80};
  font-variant-numeric: tabular-nums;
  line-height: 1;
  white-space: nowrap;
  ${token.typography('body', 'sm', 'medium')}
`

export const MetricIcon = styled.img`
  flex: 0 0 auto;
  width: 16px;
  height: 16px;
  object-fit: contain;
`

export const CommentPreview = styled.div`
  box-sizing: border-box;
  width: 100%;
  min-height: 16px;
  padding: 0 10px 6px 100px;
  color: ${token.colors.gray.gray50};
  line-height: 1;
  ${token.typography('caption', 'lg', 'medium')}
`

export const CommentText = styled.span`
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`
