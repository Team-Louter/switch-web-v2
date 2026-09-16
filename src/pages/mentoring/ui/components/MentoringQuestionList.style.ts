import styled from 'styled-components'

import { contentReveal } from '@/shared/styles/animations'
import * as token from '@/shared/styles/values/token'

export const List = styled.div`
  ${token.flexColumn}
  width: 100%;
  gap: 3px;
  animation: ${contentReveal} 360ms ease-out both;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`

export const QuestionItem = styled.div<{
  $selected: boolean
}>`
  ${token.flexBetween}
  position: relative;
  box-sizing: border-box;
  width: 100%;
  min-height: 72px;
  gap: 10px;
  padding: 11px 10px 11px 12px;
  border: 0;
  border-radius: ${token.shapes.small};
  background: ${({ $selected }) =>
    $selected ? token.colors.white : 'transparent'};
  box-shadow: ${({ $selected }) =>
    $selected
      ? `inset 3px 0 0 ${token.colors.primary.primary50}, ${token.elevations.black_1}`
      : 'none'};
  cursor: pointer;
  transition:
    background-color 120ms ease,
    box-shadow 120ms ease;

  &:hover {
    background: ${({ $selected }) =>
      $selected ? token.colors.white : token.colors.gray.gray10};
  }

  &:focus-visible {
    outline: 2px solid ${token.colors.primary.primary60};
    outline-offset: 2px;
  }
`

export const QuestionBody = styled.div`
  ${token.flexColumnStart}
  min-width: 0;
  flex: 1 1 auto;
  gap: 9px;
`

export const QuestionHeader = styled.div`
  min-width: 0;
`

export const QuestionTitle = styled.span`
  min-width: 0;
  max-width: 225px;
  overflow: hidden;
  display: block;
  color: ${token.colors.gray.gray90};
  text-overflow: ellipsis;
  white-space: nowrap;
  ${token.typography('body', 'sm', 'semibold')}
`

export const QuestionDate = styled.span`
  flex-shrink: 0;
  color: ${token.colors.gray.gray40};
  white-space: nowrap;
  ${token.typography('caption', 'sm', 'regular')}
`

export const StatusRow = styled.div`
  ${token.flexRow}
  align-items: center;
  width: 100%;
  min-width: 0;
  gap: 4px;
`

export const StatusBadge = styled.span<{
  $color: string
  $isDone?: boolean
}>`
  ${token.flexRow}
  align-items: center;
  gap: 5px;
  color: ${({ $color, $isDone }) =>
    $isDone ? $color : token.colors.gray.gray60};
  white-space: nowrap;
  ${token.typography('caption', 'lg', 'medium')}

  &::before {
    width: 6px;
    height: 6px;
    flex: 0 0 auto;
    border-radius: ${token.shapes.circle};
    background: ${({ $color }) => $color};
    content: '';
    display: ${({ $isDone }) => ($isDone ? 'none' : 'block')};
  }

  svg {
    width: 13px;
    height: 13px;
    flex: 0 0 auto;
    stroke-width: 3;
  }
`

export const QuestionActions = styled.div`
  position: relative;
  flex-shrink: 0;
`

export const MenuButton = styled.button`
  ${token.flexCenter}
  width: 24px;
  height: 32px;
  padding: 0;
  border: 0;
  border-radius: ${token.shapes.xsmall};
  background: transparent;
  color: ${token.colors.gray.gray50};
  cursor: pointer;

  svg {
    width: 20px;
    height: 20px;
  }

  &:hover {
    background: ${token.colors.gray.gray10};
    color: ${token.colors.gray.gray80};
  }
`

export const EmptyText = styled.p`
  margin: 0;
  padding: 20px 0;
  color: ${token.colors.gray.gray50};
  text-align: center;
  ${token.typography('body', 'sm', 'medium')}
`
