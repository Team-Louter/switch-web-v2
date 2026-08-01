import styled from 'styled-components'

import * as token from '@/shared/styles/values/token'

export const Field = styled.div`
  ${token.flexColumn}
  align-items: flex-start;
  flex: 1 1 0;
  min-width: 0;
  gap: 5px;
`

export const Label = styled.span`
  color: ${token.colors.gray.gray80};
  line-height: 1;
  ${token.typography('body', 'lg', 'medium')}
`

export const DropdownWrap = styled.div`
  position: relative;
  width: 100%;
`

export const DropdownButton = styled.button`
  ${token.flexBetween}
  width: 100%;
  box-sizing: border-box;
  padding: 15px 20px;
  border: 1px solid ${token.colors.gray.gray30};
  border-radius: ${token.shapes.medium};
  background: ${token.colors.white};
`

export const SelectedText = styled.span`
  overflow: hidden;
  color: ${token.colors.gray.gray100};
  line-height: 1;
  text-overflow: ellipsis;
  white-space: nowrap;
  ${token.typography('body', 'lg', 'medium')}
`

export const ArrowSlot = styled.span`
  flex: 0 0 auto;
  width: 15px;
  height: 9px;
  border-radius: 2px;
  background: ${token.colors.gray.gray30};
`

export const OptionList = styled.div`
  ${token.flexColumn}
  position: absolute;
  z-index: 2;
  top: calc(100% + 8px);
  left: 0;
  width: 100%;
  box-sizing: border-box;
  gap: 8px;
  padding: 14px 16px;
  border: 1px solid ${token.colors.gray.gray20};
  border-radius: ${token.shapes.medium};
  background: ${token.colors.white};
`

export const OptionItem = styled.label`
  ${token.flexLeft}
  width: 100%;
  gap: 10px;
  color: ${token.colors.gray.gray80};
  line-height: 1;
  ${token.typography('body', 'md', 'medium')}
`

export const Checkbox = styled.input`
  flex: 0 0 auto;
  width: 16px;
  height: 16px;
  accent-color: ${token.colors.primary.primary50};
`
