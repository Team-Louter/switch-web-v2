import styled, { css, keyframes } from 'styled-components';

import { UserName } from '@/entities/user';
import * as token from '@/shared/styles/values/token';
import { ProfileAvatar } from '@/shared/ui';

import { CommunityTitleBadge } from './CommunityTitleBadge.style';

interface CommentMenuItemProps {
  $danger?: boolean;
}

interface CommentTextProps {
  $isDeleted: boolean;
}

interface CommentItemProps {
  $isTarget: boolean;
}

interface CommentRowProps {
  $isReply: boolean;
  $isFlattened: boolean;
  $hasFlattenedChildren: boolean;
}

interface CommentTreeNodeProps {
  $hasNextSibling?: boolean;
  $isFlattened: boolean;
}

interface CommentChildrenProps {
  $isFlattened: boolean;
  $hasCommonConnector: boolean;
}

interface RepliesCaretProps {
  $isOpen: boolean;
}

interface RepliesToggleRowProps {
  $hasConnector?: boolean;
  $isWithinReplies?: boolean;
}

interface ReplyLoadSkeletonLineProps {
  $width: string;
}

const checkboxCheckmark =
  'url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 16 16%22%3E%3Cpath d=%22m3.25 8.25 2.75 2.75 6.75-6.75%22 fill=%22none%22 stroke=%22white%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22 stroke-width=%222.25%22/%3E%3C/svg%3E")';

const replyLoadShimmer = keyframes`
  from {
    background-position: 200% 0;
  }

  to {
    background-position: -200% 0;
  }
`;

const replyComposerAvatarEnter = keyframes`
  from {
    opacity: 0;
    transform: scale(0.78) rotate(-5deg);
  }

  to {
    opacity: 1;
    transform: scale(1) rotate(0);
  }
`;

const anonymousReplyComposerAvatarEnter = keyframes`
  from {
    opacity: 0;
    transform: scale(0.78) rotate(5deg);
  }

  to {
    opacity: 1;
    transform: scale(1) rotate(0);
  }
`;

const targetCommentHighlight = keyframes`
  0% {
    background: ${token.colors.primary.primary20};
    box-shadow: 0 0 0 4px ${token.colors.primary.primary40};
  }

  55% {
    background: ${token.colors.primary.primary10};
    box-shadow: 0 0 0 3px ${token.colors.primary.primary30};
  }

  100% {
    background: ${token.colors.white};
    box-shadow: 0 0 0 0 transparent;
  }
`;

const replyLoadSkeletonSurface = css`
  border-radius: ${token.shapes.small};
  background: linear-gradient(
    90deg,
    ${token.colors.gray.gray0} 25%,
    ${token.colors.gray.gray10} 50%,
    ${token.colors.gray.gray0} 75%
  );
  background-size: 200% 100%;
  animation: ${replyLoadShimmer} 1.4s ease-in-out infinite;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

export const CommentTreeNode = styled.div<CommentTreeNodeProps>`
  ${token.flexColumn}
  position: relative;
  gap: 12px;
  width: 100%;
  min-width: 0;

  &::before {
    display: ${({ $hasNextSibling, $isFlattened }) =>
      $hasNextSibling && !$isFlattened ? 'block' : 'none'};
    position: absolute;
    z-index: 1;
    top: 0;
    bottom: -12px;
    left: -16px;
    width: 0;
    border-left: 1px solid ${token.colors.gray.gray10};
    pointer-events: none;
    content: '';
  }
`;

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
`;

export const CommentChildren = styled.div<CommentChildrenProps>`
  ${token.flexColumn}
  position: relative;
  box-sizing: border-box;
  gap: 12px;
  width: calc(100% - 20px);
  min-width: 0;
  margin-left: 20px;
  padding-left: 28px;

  ${({ $isFlattened }) =>
    $isFlattened &&
    css`
      width: 100%;
      margin-left: 0;
      padding-left: 0;
    `}

  ${({ $hasCommonConnector }) =>
    $hasCommonConnector &&
    css`
      &::before {
        position: absolute;
        z-index: 0;
        top: -12px;
        bottom: 0;
        left: 12px;
        width: 0;
        border-left: 1px solid ${token.colors.gray.gray10};
        pointer-events: none;
        content: '';
      }

      /* 더보기의 곡선 아래에서는 공통 세로선이 이어지지 않도록 가린다. */
      ${RepliesToggleRow}::before {
        z-index: 2;
      }

      ${RepliesToggleRow}::after {
        position: absolute;
        z-index: 1;
        top: 2px;
        bottom: 0;
        left: 12px;
        width: 1px;
        background: ${token.colors.white};
        pointer-events: none;
        content: '';
      }
    `}

  @container community-detail (max-width: 520px) {
    ${({ $isFlattened }) =>
      !$isFlattened &&
      css`
        width: calc(100% - 12px);
        margin-left: 12px;
        padding-left: 16px;
      `}
  }

  @container community-detail (max-width: 380px) {
    ${({ $isFlattened }) =>
      !$isFlattened &&
      css`
        width: calc(100% - 8px);
        margin-left: 8px;
        padding-left: 12px;
      `}
  }
`;

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

  &:disabled {
    cursor: wait;
    opacity: 0.6;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

export const RepliesCaret = styled.span<RepliesCaretProps>`
  box-sizing: border-box;
  width: 10px;
  height: 10px;
  margin-top: ${({ $isOpen }) => ($isOpen ? '4px' : '-3px')};
  border-right: 2px solid currentColor;
  border-bottom: 2px solid currentColor;
  transform: ${({ $isOpen }) => ($isOpen ? 'rotate(225deg)' : 'rotate(45deg)')};
  transition: transform 160ms ease;

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

export const ReplyLoadSkeleton = styled.div<RepliesToggleRowProps>`
  position: relative;
  align-self: stretch;
  display: grid;
  grid-template-columns: 32px minmax(0, 1fr);
  gap: 12px;
  box-sizing: border-box;
  width: min(360px, calc(100% - 20px));
  min-height: 64px;
  margin-left: ${({ $isWithinReplies }) =>
    $isWithinReplies ? '-28px' : '20px'};
  padding: 16px 0 16px 28px;

  &::before {
    display: ${({ $hasConnector = true }) =>
      $hasConnector ? 'block' : 'none'};
    position: absolute;
    top: -12px;
    left: 12px;
    box-sizing: border-box;
    width: 16px;
    height: 44px;
    border-bottom: 1px solid ${token.colors.gray.gray10};
    border-left: 1px solid ${token.colors.gray.gray10};
    border-bottom-left-radius: 18px;
    pointer-events: none;
    content: '';
  }
`;

export const ReplyLoadSkeletonAvatar = styled.span`
  ${replyLoadSkeletonSurface}
  width: 32px;
  height: 32px;
  border-radius: ${token.shapes.circle};
`;

export const ReplyLoadSkeletonContent = styled.div`
  ${token.flexColumn}
  justify-content: center;
  gap: 8px;
  min-width: 0;
`;

export const ReplyLoadSkeletonLine = styled.span<ReplyLoadSkeletonLineProps>`
  ${replyLoadSkeletonSurface}
  display: block;
  width: ${({ $width }) => $width};
  max-width: 100%;
  height: 12px;
`;

export const CommentRow = styled.article<CommentRowProps>`
  ${token.flexLeft}
  position: relative;
  align-items: stretch;
  gap: 12px;
  width: 100%;
  min-height: 0;
  min-width: 0;
  scroll-margin-top: 24px;

  &::before {
    display: none;
    position: absolute;
    z-index: 1;
    top: ${({ $hasFlattenedChildren }) =>
      $hasFlattenedChildren ? '32px' : '48px'};
    bottom: -12px;
    left: ${({ $hasFlattenedChildren }) =>
      $hasFlattenedChildren ? '-16px' : '32px'};
    width: 0;
    border-left: 1px solid ${token.colors.gray.gray10};
    pointer-events: none;
    content: '';
  }

  &:has(+ ${CommentChildren})::before,
  &:has(+ ${ReplyLoadSkeleton})::before,
  &:has(+ ${RepliesToggleRow})::before {
    display: ${({ $isFlattened }) => ($isFlattened ? 'none' : 'block')};
  }

  &::after {
    display: ${({ $isReply }) => ($isReply ? 'block' : 'none')};
    position: absolute;
    z-index: 2;
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
`;

export const CommentItem = styled.div<CommentItemProps>`
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

  ${({ $isTarget }) =>
    $isTarget &&
    css`
      animation: ${targetCommentHighlight} 1.2s ease-out both;

      @media (prefers-reduced-motion: reduce) {
        animation: none;
      }
    `}

  @container community-detail (max-width: 430px) {
    gap: 8px;
    padding: 12px;
  }
`;

export const CommentAuthorImage = styled(ProfileAvatar)<{
  $hasBorder: boolean;
}>`
  ${({ $hasBorder }) =>
    !$hasBorder &&
    css`
      &::after {
        position: absolute;
        z-index: 2;
        inset: 0;
        border: 1px solid ${token.colors.gray.gray10};
        border-radius: ${token.shapes.circle};
        content: '';
        pointer-events: none;
      }
    `}
`;

export const CommentContent = styled.div`
  ${token.flexColumn}
  flex: 1 1 0;
  gap: 8px;
  min-width: 0;
`;

export const CommentHeader = styled.div`
  ${token.flexBetween}
  gap: 12px;
  width: 100%;
  min-height: 32px;

  @container community-detail (max-width: 430px) {
    gap: 8px;
  }
`;

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
`;

export const CommentAuthor = styled(UserName)`
  display: block;
  flex: 0 1 auto;
  min-width: 0;
  max-width: none;
  overflow: visible;
  color: #404040;
  ${token.typography('heading', 'sm', 'semibold')}
  line-height: 1.2;
  overflow-wrap: anywhere;
  white-space: normal;
`;

export const CommentAuthorTitle = styled(CommunityTitleBadge)`
  gap: 4px;
  max-width: 160px;
  padding: 4px 7px;
`;

export const CommentMetaDot = styled.span`
  flex: 0 0 4px;
  width: 4px;
  height: 4px;
  border-radius: ${token.shapes.circle};
  background: ${token.colors.gray.gray40};
`;

export const CommentDate = styled.time`
  color: ${token.colors.gray.gray70};
  ${token.typography('body', 'md', 'regular')}
  line-height: 1;
  white-space: nowrap;
`;

export const CommentMenu = styled.div`
  position: relative;
  flex: 0 0 auto;
`;

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
`;

export const CommentMenuIcon = styled.img`
  width: 20px;
  height: 20px;
  object-fit: contain;
  transform: rotate(90deg);
`;

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
`;

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
`;

export const CommentMenuDivider = styled.span`
  width: 100%;
  height: 1px;
  margin: 4px 0;
  background: ${token.colors.gray.gray10};
`;

export const CommentText = styled.p<CommentTextProps>`
  margin: 0;
  color: ${({ $isDeleted }) =>
    $isDeleted ? token.colors.gray.gray70 : '#404040'};
  ${token.typography('body', 'lg', 'medium')}
  line-height: 1.5;
  overflow-wrap: anywhere;
`;

export const CommentMention = styled.span`
  margin-right: 6px;
  color: ${token.colors.primary.primary80};
  ${token.typography('body', 'lg', 'semibold')}
  white-space: nowrap;
`;

export const CommentEditForm = styled.div`
  ${token.flexColumn}
  gap: 8px;
  width: 100%;
`;

export const CommentEditInput = styled.textarea`
  box-sizing: border-box;
  width: 100%;
  height: 44px;
  min-height: 44px;
  max-height: 120px;
  padding: 10px 12px;
  border: 1px solid ${token.colors.gray.gray20};
  border-radius: ${token.shapes.small};
  outline: 0;
  color: ${token.colors.gray.gray100};
  background: ${token.colors.white};
  ${token.typography('body', 'md', 'medium')}
  font-family: inherit;
  line-height: 1.5;
  resize: none;
  overflow-y: auto;

  &:focus {
    border-color: ${token.colors.primary.primary50};
  }
`;

export const CommentEditActions = styled.div`
  ${token.flexLeft}
  align-self: flex-end;
  gap: 8px;
`;

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
`;

export const CommentEditSaveButton = styled(CommentEditButton)`
  color: ${token.colors.gray.gray100};
  background: ${token.colors.primary.primary50};

  &:hover:not(:disabled) {
    background: ${token.colors.primary.primary40};
  }
`;

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
`;

export const ReplyComposer = styled.div`
  display: grid;
  grid-template-columns: 32px minmax(0, 1fr);
  gap: 12px;
  width: 100%;
  margin-top: 4px;
`;

export const ReplyComposerAvatar = styled.img<{
  $isAnonymous: boolean;
}>`
  width: 32px;
  height: 32px;
  border-radius: ${token.shapes.circle};
  object-fit: cover;
  animation: ${({ $isAnonymous }) =>
      $isAnonymous
        ? anonymousReplyComposerAvatarEnter
        : replyComposerAvatarEnter}
    180ms cubic-bezier(0.22, 1, 0.36, 1) both;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

export const ReplyComposerBody = styled.div`
  ${token.flexColumn}
  gap: 8px;
  min-width: 0;
`;

export const ReplyComposerInput = styled.textarea`
  box-sizing: border-box;
  width: 100%;
  height: 48px;
  min-height: 48px;
  max-height: 120px;
  padding: 0;
  border: 0;
  border-bottom: 2px solid ${token.colors.gray.gray80};
  outline: 0;
  color: ${token.colors.gray.gray100};
  background: transparent;
  ${token.typography('body', 'lg', 'medium')}
  font-family: inherit;
  line-height: 1.5;
  resize: none;
  overflow-y: auto;

  &::placeholder {
    color: ${token.colors.gray.gray70};
  }
`;

export const ReplyComposerFooter = styled.div`
  ${token.flexBetween}
  gap: 16px;
  min-height: 44px;
`;

export const ReplyComposerTools = styled.div`
  ${token.flexLeft}
  gap: 14px;
  min-width: 0;
`;

export const ReplyAnonymousLabel = styled.label`
  ${token.flexLeft}
  gap: 6px;
  color: ${token.colors.gray.gray60};
  ${token.typography('body', 'sm', 'medium')}
  line-height: 1;
  cursor: pointer;
`;

export const ReplyAnonymousCheckbox = styled.input`
  appearance: none;
  width: 18px;
  height: 18px;
  margin: 0;
  border: 1.5px solid ${token.colors.gray.gray40};
  border-radius: 4px;
  background: ${token.colors.white};
  cursor: pointer;
  transition:
    border-color 120ms ease,
    background-color 120ms ease;

  &:checked {
    border-color: ${token.colors.primary.primary50};
    background: ${token.colors.primary.primary50};
    background-image: ${checkboxCheckmark};
    background-repeat: no-repeat;
    background-position: center;
    background-size: 13px;
  }

  &:focus-visible {
    outline: 2px solid ${token.colors.primary.primary30};
    outline-offset: 2px;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.55;
  }
`;

export const ReplyComposerActions = styled.div`
  ${token.flexLeft}
  flex: 0 0 auto;
  gap: 12px;
`;

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
`;

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
`;

export const ReplyActionError = styled.p`
  align-self: flex-start;
  margin: 0;
  color: ${token.colors.danger.danger20};
  ${token.typography('body', 'sm', 'medium')}
  line-height: 1.4;
`;
