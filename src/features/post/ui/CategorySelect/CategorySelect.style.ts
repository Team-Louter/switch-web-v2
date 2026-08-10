import styled from 'styled-components'

import * as token from '@/shared/styles/values/token'

export const Wrap = styled.div`
  position: relative;
  flex: 0 0 auto;
`

export const Trigger = styled.button`
  ${token.flexBetween}
  gap: 20px;
  box-sizing: border-box;
  /* 선택한 카테고리에 따라 너비가 흔들리지 않도록 디자인 기준 너비를 유지한다 */
  min-width: 162px;
  height: 52px;
  padding: 8px 12px;
  overflow: hidden;
  border-radius: ${token.shapes.small};
  background: ${token.colors.gray.gray0};
  color: ${token.colors.gray.gray60};
  white-space: nowrap;
  ${token.typography('body', 'lg', 'medium')}
`

export const CaretBox = styled.span<{ $open: boolean }>`
  ${token.flexCenter}
  flex: 0 0 auto;
  width: 20px;
  height: 12px;
  color: ${token.colors.gray.gray30};
  transform: rotate(${({ $open }) => ($open ? '180deg' : '0deg')});
  transition: transform 120ms ease;
`

export const OptionList = styled.ul`
  ${token.flexColumnStart}
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  z-index: 10;
  min-width: 100%;
  padding: 6px;
  border-radius: ${token.shapes.small};
  background: ${token.colors.white};
  ${token.elevation('black_3')}
`

export const Option = styled.button<{ $selected: boolean }>`
  ${token.flexLeft}
  width: 100%;
  padding: 10px 12px;
  border-radius: ${token.shapes.xsmall};
  background: ${({ $selected }) =>
    $selected ? token.colors.gray.gray0 : 'transparent'};
  color: ${token.colors.gray.gray80};
  white-space: nowrap;
  ${token.typography('body', 'md', 'medium')}

  &:hover {
    background: ${token.colors.gray.gray0};
  }
`
