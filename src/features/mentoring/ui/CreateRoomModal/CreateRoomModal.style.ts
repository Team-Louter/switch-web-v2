import styled from 'styled-components'

import * as token from '@/shared/styles/values/token'

export const MemberSection = styled.div`
  ${token.flexColumnStart}
  width: 100%;
  gap: 8px;
`

export const SearchField = styled.div`
  ${token.flexBetween}
  width: 100%;
  height: 44px;
  gap: 8px;
  padding: 10px 12px;
  border-radius: ${token.shapes.small};
  background-color: ${token.colors.gray.gray0};
  color: ${token.colors.gray.gray50};

  svg {
    width: 24px;
    height: 24px;
    flex-shrink: 0;
  }
`

export const SearchInput = styled.input`
  ${token.typography('body', 'md', 'medium')}
  width: 100%;
  border: 0;
  background-color: transparent;
  color: ${token.colors.gray.gray80};

  &::placeholder {
    color: ${token.colors.gray.gray30};
  }

  &:focus {
    outline: none;
  }
`

export const MemberList = styled.div`
  ${token.flexColumnStart}
  width: 100%;
  max-height: 220px;
  overflow-y: auto;
  border-radius: ${token.shapes.small};
  background-color: ${token.colors.gray.gray0};
`

export const GradeGroup = styled.div`
  ${token.flexColumnStart}
  width: 100%;
`

export const GradeRow = styled.div`
  ${token.flexBetween}
  width: 100%;
  height: 44px;
  flex-shrink: 0;
  gap: 8px;
  padding: 10px 12px;
`

export const GradeLabel = styled.button`
  ${token.typography('body', 'md', 'semibold')}
  ${token.flexLeft}
  flex: 1 1 0;
  min-width: 0;
  padding: 0;
  border: 0;
  background-color: transparent;
  color: ${token.colors.gray.gray80};
  cursor: pointer;
`

export const CaretButton = styled.button`
  ${token.flexCenter}
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  padding: 0;
  border: 0;
  background-color: transparent;
  color: ${token.colors.gray.gray50};
  cursor: pointer;

  svg {
    width: 18px;
    height: 18px;
  }
`

export const MemberRow = styled.div`
  ${token.flexBetween}
  width: 100%;
  height: 44px;
  flex-shrink: 0;
  gap: 8px;
  padding: 10px 12px;
`

export const MemberInfo = styled.div`
  ${token.flexLeft}
  gap: 8px;
  min-width: 0;
`

export const MemberName = styled.span`
  ${token.typography('body', 'md', 'medium')}
  overflow: hidden;
  color: ${token.colors.gray.gray80};
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const CheckBox = styled.button<{ $isChecked: boolean }>`
  ${token.flexCenter}
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  padding: 0;
  border: ${({ $isChecked }) =>
    $isChecked ? '0' : `1.6px solid ${token.colors.gray.gray40}`};
  border-radius: ${token.shapes.xsmall};
  background-color: ${({ $isChecked }) =>
    $isChecked ? token.colors.primary.primary50 : 'transparent'};
  color: ${token.colors.gray.gray100};
  cursor: pointer;

  svg {
    width: 18px;
    height: 18px;
  }
`

export const SelectionRow = styled.div`
  ${token.flexBetween}
  width: 100%;
`

export const SelectionCount = styled.span`
  ${token.typography('caption', 'md', 'medium')}
  color: ${token.colors.gray.gray50};
`

export const ClearButton = styled.button`
  ${token.typography('caption', 'md', 'semibold')}
  padding: 0;
  border: 0;
  background-color: transparent;
  color: ${token.colors.primary.text};
  cursor: pointer;
`

export const EmptyText = styled.p`
  ${token.typography('body', 'sm', 'medium')}
  width: 100%;
  margin: 0;
  padding: 14px 12px;
  color: ${token.colors.gray.gray40};
`
