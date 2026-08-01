import styled from 'styled-components'

import * as token from '@/shared/styles/values/token'

export const Container = styled.div`
  position: relative;
  width: 100%;
`

export const Trigger = styled.button`
  ${token.typography('body', 'sm', 'medium')};
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  border: 1px solid ${token.colors.gray.gray10};
  border-radius: ${token.shapes.xsmall};
  background-color: ${token.colors.white};
  color: ${token.colors.gray.gray70};
  cursor: pointer;

  svg {
    width: 20px;
    height: 20px;
  }
`

export const OptionList = styled.div`
  position: absolute;
  top: 49px;
  right: 0;
  left: 0;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 16px;
  border: 1px solid ${token.colors.gray.gray10};
  border-radius: ${token.shapes.xsmall};
  background-color: ${token.colors.white};
`

export const Option = styled.button<{ $isSelected: boolean }>`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  border: 1px solid
    ${({ $isSelected }) =>
      $isSelected
        ? token.colors.primary.primary50
        : token.colors.gray.gray10};
  border-radius: ${token.shapes.small};
  background-color: ${({ $isSelected }) =>
    $isSelected ? token.colors.primary.primary20 : token.colors.white};
  cursor: pointer;
`

export const OptionTitle = styled.span<{ $isSelected: boolean }>`
  ${({ $isSelected }) =>
    $isSelected ? token.typography('caption', 'lg', 'semibold') : token.typography('caption', 'lg', 'medium')};
  color: ${({ $isSelected }) =>
    $isSelected ? token.colors.gray.gray90 : token.colors.gray.gray70};
`

export const OptionDate = styled.span<{ $isSelected: boolean }>`
  ${token.typography('body', 'sm', 'medium')};
  color: ${({ $isSelected }) =>
    $isSelected ? token.colors.gray.gray70 : token.colors.gray.gray40};
`
