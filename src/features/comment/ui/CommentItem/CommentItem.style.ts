import styled from 'styled-components'

import * as token from '@/shared/styles/values/token'

export const Item = styled.li`
  ${token.flexColumnStart}
  width: 100%;
`

export const Body = styled.div`
  ${token.flexLeft}
  align-items: flex-start;
  gap: 6px;
  box-sizing: border-box;
  width: 100%;
  min-height: 80px;
  padding: 9px 0;
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

export const Content = styled.div`
  ${token.flexColumnStart}
  flex: 1 1 0;
  gap: 8px;
  min-width: 0;
`

export const MetaRow = styled.div`
  ${token.flexLeft}
  gap: 28px;
  width: 100%;
`

export const Meta = styled.div`
  ${token.flexLeft}
  gap: 8px;
  padding: 4px 0;
`

export const AuthorName = styled.span`
  color: ${token.colors.gray.gray70};
  white-space: nowrap;
  ${token.typography('heading', 'sm', 'semibold')}
`

export const Dot = styled.span`
  flex: 0 0 auto;
  width: 4px;
  height: 4px;
  border-radius: ${token.shapes.circle};
  background: ${token.colors.gray.gray30};
`

export const CreatedAt = styled.span`
  color: ${token.colors.gray.gray40};
  white-space: nowrap;
  ${token.typography('body', 'md', 'regular')}
`

export const MenuWrap = styled.div`
  position: relative;
  flex: 0 0 auto;
`

export const MenuButton = styled.button`
  ${token.flexCenter}
  width: 24px;
  height: 24px;
  color: ${token.colors.gray.gray80};
`

export const Menu = styled.div`
  ${token.flexColumnStart}
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  z-index: 10;
  min-width: 120px;
  padding: 6px;
  border-radius: ${token.shapes.small};
  background: ${token.colors.white};
  ${token.elevation('black_3')}
`

export const MenuItem = styled.button`
  ${token.flexLeft}
  width: 100%;
  padding: 8px 10px;
  border-radius: ${token.shapes.xsmall};
  color: ${token.colors.gray.gray80};
  white-space: nowrap;
  ${token.typography('body', 'md', 'medium')}

  &:hover {
    background: ${token.colors.gray.gray0};
  }
`

export const Text = styled.p<{ $deleted?: boolean }>`
  width: 100%;
  color: ${({ $deleted }) =>
    $deleted ? token.colors.gray.gray40 : token.colors.gray.gray70};
  word-break: break-word;
  white-space: pre-wrap;
  ${token.typography('body', 'lg', 'medium')}
`

export const ReplyList = styled.ul`
  ${token.flexColumnStart}
  position: relative;
  width: 100%;
  padding-left: 34px;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 12px;
    width: 1px;
    background: ${token.colors.gray.gray20};
  }
`

export const ReplyForm = styled.form`
  ${token.flexLeft}
  gap: 12px;
  box-sizing: border-box;
  width: 100%;
  margin-bottom: 8px;
  padding: 10px 16px;
  border-radius: ${token.shapes.medium};
  background: ${token.colors.gray.gray0};
`

export const ReplyInput = styled.input`
  flex: 1 1 0;
  min-width: 0;
  border: 0;
  background: transparent;
  color: ${token.colors.gray.gray90};
  ${token.typography('body', 'md', 'medium')}

  &::placeholder {
    color: ${token.colors.gray.gray40};
  }

  &:focus {
    outline: none;
  }
`

export const ReplySubmit = styled.button`
  ${token.flexCenter}
  flex: 0 0 auto;
  color: ${token.colors.gray.gray60};

  &:disabled {
    cursor: not-allowed;
    color: ${token.colors.gray.gray30};
  }
`
