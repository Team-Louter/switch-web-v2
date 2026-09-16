import styled from 'styled-components'

import * as token from '@/shared/styles/values/token'
import { myPagePalette as color } from '../myPagePalette'

export const Row = styled.article`
  ${token.flexColumn}
  align-items: flex-start;
  justify-content: center;
  box-sizing: border-box;
  width: 100%;
  min-height: 56px;
  overflow: hidden;
  border-bottom: 1px solid ${color.line};
  background: ${token.colors.white};
  cursor: pointer;
  transition: background-color 150ms ease;

  &:hover {
    background: #F5F5F5;
  }

  &:focus-visible {
    outline: 2px solid ${color.yellow};
    outline-offset: -2px;
  }
`

export const MainLine = styled.div<{ $hasComment: boolean }>`
  display: flex;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  min-height: ${({ $hasComment }) => ($hasComment ? '48px' : '55px')};
  gap: 16px;
  padding: ${({ $hasComment }) =>
    $hasComment ? '10px 28px 2px' : '10px 28px'};
`

export const CategoryBadge = styled.span`
  ${token.flexCenter}
  flex: 0 0 auto;
  box-sizing: border-box;
  padding: 2px 10px;
  border-radius: 50px;
  color: ${color.categoryText};
  background: ${color.categoryBackground};
  line-height: 1;
  white-space: nowrap;
  ${token.typography('caption', 'md', 'medium')}
`

export const Title = styled.strong`
  flex: 1 1 0;
  min-width: 0;
  box-sizing: border-box;
  overflow: hidden;
  color: ${color.text};
  line-height: 1.2;
  text-overflow: ellipsis;
  white-space: nowrap;
  ${token.typography('body', 'sm', 'semibold')}
`

export const DateText = styled.span`
  ${token.flexCenter}
  flex: 0 0 auto;
  color: ${color.metricGray};
  line-height: 1.2;
  white-space: nowrap;
  ${token.typography('caption', 'lg', 'medium')}
`

export const Metrics = styled.div`
  display: flex;
  align-items: center;
  flex: 0 0 auto;
  gap: 20px;
`

export const Metric = styled.span<{ $tone?: 'red' | 'yellow' }>`
  ${token.flexLeft}
  justify-content: flex-start;
  min-width: 0;
  gap: 3px;
  color: ${({ $tone }) =>
    $tone === 'red'
      ? color.red
      : $tone === 'yellow'
        ? color.yellow
        : color.metricGray};
  font-variant-numeric: tabular-nums;
  line-height: 1;
  white-space: nowrap;
  ${token.typography('caption', 'lg', 'medium')}
`

export const MetricIcon = styled.img`
  flex: 0 0 auto;
  object-fit: contain;
`

export const CommentPreview = styled.div`
  box-sizing: border-box;
  width: 100%;
  min-height: 16px;
  padding: 0 28px 8px 110px;
  color: ${color.coolText};
  line-height: 1;
  ${token.typography('caption', 'lg', 'medium')}
`

export const CommentText = styled.span`
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`
