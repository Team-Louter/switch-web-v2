import styled from 'styled-components'

import * as token from '@/shared/styles/values/token'

export const TabList = styled.div`
  ${token.flexBetween}
  align-items: stretch;
  box-sizing: border-box;
  width: 100%;
  padding: 4px;
  overflow: hidden;
  border-radius: ${token.shapes.xlarge};
  background: ${token.colors.gray.gray0};
`

export const Tab = styled.button<{ $active: boolean }>`
  ${token.flexCenter}
  flex: 0 1 116px;
  padding: 12px;
  overflow: hidden;
  border-radius: ${token.shapes.large};
  background: ${({ $active }) => ($active ? token.colors.white : 'transparent')};
  color: ${({ $active }) =>
    $active ? token.colors.gray.gray90 : token.colors.gray.gray50};
  line-height: 1;
  white-space: nowrap;
  transition:
    background-color 120ms ease,
    color 120ms ease;
  ${({ $active }) =>
    $active
      ? token.typography('heading', 'sm', 'medium')
      : token.typography('heading', 'sm', 'regular')}

  &:hover {
    color: ${token.colors.gray.gray90};
  }
`
