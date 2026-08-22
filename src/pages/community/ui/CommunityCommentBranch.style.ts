import styled, { css } from 'styled-components'

import * as token from '@/shared/styles/values/token'

interface CommentMenuItemProps {
  $danger?: boolean
}

interface CommentRowProps {
  $isReply: boolean
}

interface CommentTreeNodeProps {
  $hasNextSibling?: boolean
}

interface RepliesCaretProps {
  $isOpen: boolean
}

interface RepliesToggleRowProps {
  $hasConnector?: boolean
  $isWithinReplies?: boolean
}

export const CommentTreeNode = styled.div<CommentTreeNodeProps>`
  ${token.flexColumn}
  position: relative;
  gap: 12px;
  width: 100%;

  &::before {
    display: ${({ $hasNextSibling }) =>
      $hasNextSibling ? 'block' : 'none'};
    position: absolute;
    z-index: 1;
    top: 32px;
    bottom: -12px;
    left: -16px;
    width: 1px;
    background: ${token.colors.gray.gray10};
    pointer-events: none;
    content: '';
  }
`

export const RepliesToggleRow = styled.div<RepliesToggleRowProps>`
  position: relative;
  align-self: flex-start;
  box-sizing: border-box;
  margin-left: ${({ $isWithinReplies }) =>
    $isWithinReplies ? '-28px' : '20px'};
  padding-left: 28px;

  &::before {
    display: ${({ $hasConnector = true }) =>
      $hasConnector ? 'block' : 'none'};
    position: absolute;
    top: -12px;
    left: 12px;
    box-sizing: border-box;
    width: 16px;
    height: 32px;
    border-bottom: 1px solid ${token.colors.gray.gray10};
    border-left: 1px solid ${token.colors.gray.gray10};
    border-bottom-left-radius: 18px;
    pointer-events: none;
    content: '';
  }
`

export const CommentChildren = styled.div`
  ${token.flexColumn}
  box-sizing: border-box;
  gap: 12px;
  width: calc(100% - 20px);
  margin-left: 20px;
  padding-left: 28px;
`

export const RepliesToggle = styled.button`
  ${token.flexLeft}
  gap: 14px;
  min-height: 48px;
  padding: 10px 20px;
  border: 0;
  border-radius: 999px;
  color: ${token.colors.gray.gray80};
  background: transparent;
  ${token.typography('body', 'md', 'semibold')}
  line-height: 1;
  cursor: pointer;
  transition: background-color 160ms ease;

  &:hover {
    background: ${token.colors.gray.gray20};
  }

  &:focus-visible {
    outline: 2px solid ${token.colors.primary.primary50};
    outline-offset: 2px;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`

export const RepliesCaret = styled.span<RepliesCaretProps>`
  box-sizing: border-box;
  width: 10px;
  height: 10px;
  margin-top: ${({ $isOpen }) => ($isOpen ? '4px' : '-3px')};
  border-right: 2px solid currentColor;
  border-bottom: 2px solid currentColor;
  transform: ${({ $isOpen }) =>
    $isOpen ? 'rotate(225deg)' : 'rotate(45deg)'};
  transition: transform 160ms ease;

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`

export const CommentRow = styled.article<CommentRowProps>`
  ${token.flexLeft}
  position: relative;
  align-items: stretch;
  gap: 12px;
  width: 100%;
  min-height: 0;

  &::before {
    display: none;
    position: absolute;
    z-index: 1;
    top: 48px;
    bottom: -12px;
    left: 32px;
    width: 1px;
    background: ${token.colors.gray.gray10};
    pointer-events: none;
    content: '';
  }

  &:has(+ ${CommentChildren})::before,
  &:has(+ ${RepliesToggleRow})::before {
    display: block;
  }

  &::after {
    display: ${({ $isReply }) => ($isReply ? 'block' : 'none')};
    position: absolute;
    z-index: 1;
    top: 0;
    left: -16px;
    width: 16px;
    height: 32px;
    border-bottom: 1px solid ${token.colors.gray.gray10};
    border-left: 1px solid ${token.colors.gray.gray10};
    border-bottom-left-radius: 18px;
    pointer-events: none;
    content: '';
  }
`

export const CommentItem = styled.div`
  ${token.flexLeft}
  flex: 1 1 0;
  gap: 12px;
  align-items: flex-start;
  box-sizing: border-box;
  width: 100%;
  max-width: none;
  min-width: 0;
  padding: 16px;
  border: 0;
  border-radius: ${token.shapes.medium};
  background: ${token.colors.white};
`

export const CommentAuthorImage = styled.img`
  flex: 0 0 32px;
  width: 32px;
  height: 32px;
  border: 1px solid ${token.colors.gray.gray10};
  border-radius: ${token.shapes.circle};
  object-fit: cover;
`

export const CommentContent = styled.div`
  ${token.flexColumn}
  flex: 1 1 0;
  gap: 8px;
  min-width: 0;
`

export const CommentHeader = styled.div`
  ${token.flexBetween}
  gap: 12px;
  width: 100%;
  min-height: 32px;

  @container community-detail (max-width: 430px) {
    gap: 8px;
  }
`

export const CommentMeta = styled.div`
  ${token.flexLeft}
  flex: 1 1 0;
  gap: 8px;
  padding: 4px 0;

  @container community-detail (max-width: 430px) {
    flex: 1 1 0;
    flex-wrap: wrap;
    min-width: 0;
  }
`

export const CommentAuthor = styled.span`
  color: #404040;
  ${token.typography('heading', 'sm', 'semibold')}
  line-height: 1.2;
  white-space: nowrap;
`

export const CommentMetaDot = styled.span`
  width: 4px;
  height: 4px;
  border-radius: ${token.shapes.circle};
  background: ${token.colors.gray.gray40};
`

export const CommentDate = styled.time`
  color: ${token.colors.gray.gray40};
  ${token.typography('body', 'md', 'regular')}
  line-height: 1;
  white-space: nowrap;
`

export const CommentMenu = styled.div`
  position: relative;
  flex: 0 0 auto;
`

export const CommentMenuButton = styled.button`
  ${token.flexCenter}
  box-sizing: border-box;
  width: 32px;
  height: 32px;
  padding: 0;
  border: 0;
  border-radius: ${token.shapes.small};
  background: transparent;
  cursor: pointer;
  transition: background-color 160ms ease;

  &:hover:not(:disabled) {
    background: ${token.colors.gray.gray0};
  }

  &:focus-visible {
    outline: 2px solid ${token.colors.primary.primary50};
    outline-offset: 2px;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`

export const CommentMenuIcon = styled.img`
  width: 20px;
  height: 20px;
  object-fit: contain;
  transform: rotate(90deg);
`

export const CommentMenuPanel = styled.div`
  ${token.flexColumn}
  position: absolute;
  z-index: 4;
  top: calc(100% + 6px);
  right: 0;
  box-sizing: border-box;
  min-width: 120px;
  padding: 8px;
  border: 1px solid ${token.colors.gray.gray10};
  border-radius: ${token.shapes.large};
  background: ${token.colors.white};
  box-shadow: 0 6px 18px rgb(0 0 0 / 8%);
`

export const CommentMenuItem = styled.button<CommentMenuItemProps>`
  width: 100%;
  min-height: 40px;
  padding: 8px 12px;
  border: 0;
  border-radius: ${token.shapes.small};
  color: ${token.colors.gray.gray100};
  background: transparent;
  ${token.typography('body', 'sm', 'semibold')}
  text-align: left;
  cursor: pointer;

  &:hover:not(:disabled) {
    background: ${token.colors.gray.gray0};
  }

  &:focus-visible {
    outline: 2px solid ${token.colors.primary.primary50};
    outline-offset: -2px;
  }

  &:disabled {
    cursor: wait;
    opacity: 0.6;
  }

  ${({ $danger }) =>
    $danger &&
    css`
      color: ${token.colors.danger.danger20};
    `}
`

export const CommentMenuDivider = styled.span`
  width: 100%;
  height: 1px;
  margin: 4px 0;
  background: ${token.colors.gray.gray10};
`

export const CommentText = styled.p`
  margin: 0;
  color: #404040;
  ${token.typography('body', 'lg', 'medium')}
  line-height: 1.5;
  overflow-wrap: anywhere;
`

export const CommentEditForm = styled.div`
  ${token.flexColumn}
  gap: 8px;
  width: 100%;
`

export const CommentEditInput = styled.input`
  box-sizing: border-box;
  width: 100%;
  min-height: 44px;
  padding: 10px 12px;
  border: 1px solid ${token.colors.gray.gray20};
  border-radius: ${token.shapes.small};
  outline: 0;
  color: ${token.colors.gray.gray100};
  background: ${token.colors.white};
  ${token.typography('body', 'md', 'medium')}
  line-height: 1.5;

  &:focus {
    border-color: ${token.colors.primary.primary50};
  }
`

export const CommentEditActions = styled.div`
  ${token.flexLeft}
  align-self: flex-end;
  gap: 8px;
`

export const CommentEditButton = styled.button`
  min-width: 56px;
  height: 32px;
  padding: 0 12px;
  border: 0;
  border-radius: ${token.shapes.small};
  color: ${token.colors.gray.gray100};
  background: ${token.colors.gray.gray0};
  ${token.typography('body', 'sm', 'semibold')}
  cursor: pointer;

  &:hover:not(:disabled) {
    background: ${token.colors.gray.gray10};
  }

  &:focus-visible {
    outline: 2px solid ${token.colors.primary.primary50};
    outline-offset: 2px;
  }

  &:disabled {
    cursor: wait;
    opacity: 0.6;
  }
`

export const CommentEditSaveButton = styled(CommentEditButton)`
  color: ${token.colors.gray.gray100};
  background: ${token.colors.primary.primary50};

  &:hover:not(:disabled) {
    background: ${token.colors.primary.primary40};
  }
`

export const ReplyActionButton = styled.button`
  align-self: flex-start;
  padding: 4px 0;
  border: 0;
  color: ${token.colors.gray.gray70};
  background: transparent;
  ${token.typography('body', 'sm', 'semibold')}
  line-height: 1;
  cursor: pointer;

  &:hover {
    color: ${token.colors.gray.gray100};
    text-decoration: underline;
  }

  &:focus-visible {
    outline: 2px solid ${token.colors.primary.primary50};
    outline-offset: 2px;
  }
`

export const ReplyComposer = styled.div`
  display: grid;
  grid-template-columns: 32px minmax(0, 1fr);
  gap: 12px;
  width: 100%;
  margin-top: 4px;
`

export const ReplyComposerAvatar = styled.img`
  width: 32px;
  height: 32px;
  border-radius: ${token.shapes.circle};
  object-fit: cover;
`

export const ReplyComposerBody = styled.div`
  ${token.flexColumn}
  gap: 8px;
  min-width: 0;
`

export const ReplyComposerInput = styled.input`
  box-sizing: border-box;
  width: 100%;
  min-height: 48px;
  padding: 0;
  border: 0;
  border-bottom: 2px solid ${token.colors.gray.gray80};
  outline: 0;
  color: ${token.colors.gray.gray100};
  background: transparent;
  ${token.typography('body', 'lg', 'medium')}
  line-height: 1.5;

  &::placeholder {
    color: ${token.colors.gray.gray40};
  }
`

export const ReplyComposerFooter = styled.div`
  ${token.flexBetween}
  gap: 16px;
  min-height: 44px;
`

export const ReplyComposerTools = styled.div`
  ${token.flexLeft}
  gap: 14px;
  min-width: 0;
`

export const ReplyAnonymousLabel = styled.label`
  ${token.flexLeft}
  gap: 6px;
  color: ${token.colors.gray.gray60};
  ${token.typography('body', 'sm', 'medium')}
  line-height: 1;
  cursor: pointer;
`

export const ReplyAnonymousCheckbox = styled.input`
  appearance: none;
  width: 20px;
  height: 20px;
  margin: 0;
  border: 1.6px solid ${token.colors.gray.gray40};
  border-radius: ${token.shapes.xsmall};
  background: ${token.colors.white};
  cursor: pointer;

  &:checked {
    border-color: ${token.colors.primary.primary50};
    background: ${token.colors.primary.primary50};
    box-shadow: inset 0 0 0 4px ${token.colors.white};
  }
`

export const ReplyComposerActions = styled.div`
  ${token.flexLeft}
  flex: 0 0 auto;
  gap: 12px;
`

export const ReplyCancelButton = styled.button`
  height: 44px;
  padding: 0 12px;
  border: 0;
  color: ${token.colors.gray.gray100};
  background: transparent;
  ${token.typography('body', 'md', 'semibold')}
  line-height: 1;
  cursor: pointer;

  &:disabled {
    color: ${token.colors.gray.gray40};
    cursor: not-allowed;
  }

  &:focus-visible {
    outline: 2px solid ${token.colors.primary.primary50};
    outline-offset: 2px;
  }
`

export const ReplySubmitButton = styled.button`
  min-width: 76px;
  height: 44px;
  padding: 0 20px;
  border: 0;
  border-radius: 999px;
  color: ${token.colors.gray.gray100};
  background: ${token.colors.primary.primary50};
  ${token.typography('body', 'md', 'semibold')}
  line-height: 1;
  cursor: pointer;
  transition:
    color 160ms ease,
    background-color 160ms ease;

  &:disabled {
    color: ${token.colors.gray.gray40};
    background: ${token.colors.gray.gray10};
    cursor: not-allowed;
  }

  &:focus-visible {
    outline: 2px solid ${token.colors.primary.primary50};
    outline-offset: 2px;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`

export const ReplyActionError = styled.p`
  align-self: flex-start;
  margin: 0;
  color: ${token.colors.danger.danger20};
  ${token.typography('body', 'sm', 'medium')}
  line-height: 1.4;
`
