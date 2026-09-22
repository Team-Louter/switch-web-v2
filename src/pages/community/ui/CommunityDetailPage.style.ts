import styled, { css, keyframes } from 'styled-components';

import { UserName } from '@/entities/user';
import * as token from '@/shared/styles/values/token';
import { ProfileAvatar } from '@/shared/ui';

import { CommunityTitleBadge } from './CommunityTitleBadge.style';

interface SkeletonBlockProps {
  $height: number;
  $width?: string;
}

interface AttachmentChevronProps {
  $isOpen: boolean;
}

interface AttachmentPanelProps {
  $isOpen: boolean;
}

interface PostMenuItemProps {
  $danger?: boolean;
}

interface PinnedTitleProps {
  $isPinned: boolean;
}

const checkboxCheckmark =
  'url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 16 16%22%3E%3Cpath d=%22m3.25 8.25 2.75 2.75 6.75-6.75%22 fill=%22none%22 stroke=%22white%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22 stroke-width=%222.25%22/%3E%3C/svg%3E")';

const communityDetailEnter = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const rollingNumberIncrease = keyframes`
  from {
    transform: translateY(0);
  }

  to {
    transform: translateY(var(--rolling-number-offset));
  }
`;

const rollingNumberDecrease = keyframes`
  from {
    transform: translateY(var(--rolling-number-offset));
  }

  to {
    transform: translateY(0);
  }
`;

export const Page = styled.section`
  box-sizing: border-box;
  min-height: 100dvh;
  padding: clamp(32px, 5.1dvh, 50px) 24px;
  container-name: community-detail;
  container-type: inline-size;
  background: ${token.colors.white};
  animation: ${communityDetailEnter} 220ms cubic-bezier(0.22, 1, 0.36, 1) both;

  @media (max-width: 760px) {
    padding-right: 18px;
    padding-left: 18px;
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

export const Content = styled.div`
  ${token.flexColumn}
  gap: 40px;
  width: 100%;
  max-width: calc(1003px / 0.9);
  margin: 0 auto;
  zoom: 0.9;

  @container community-detail (max-width: 700px) {
    gap: 28px;
  }
`;

const skeletonShimmer = keyframes`
  from {
    background-position: 200% 0;
  }

  to {
    background-position: -200% 0;
  }
`;

const skeletonSurface = css`
  background: linear-gradient(
    90deg,
    ${token.colors.gray.gray0} 25%,
    ${token.colors.gray.gray10} 50%,
    ${token.colors.gray.gray0} 75%
  );
  background-size: 200% 100%;
  animation: ${skeletonShimmer} 1.4s ease-in-out infinite;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

export const DetailSkeleton = styled.div`
  ${token.flexColumn}
  gap: 28px;
  width: 100%;
`;

export const SkeletonGroup = styled.div`
  ${token.flexColumn}
  gap: 16px;
  width: 100%;
`;

export const SkeletonMetaRow = styled.div`
  ${token.flexBetween}
  gap: 24px;
  width: 100%;

  @container community-detail (max-width: 700px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
`;

export const SkeletonBlock = styled.span<SkeletonBlockProps>`
  ${skeletonSurface}
  display: block;
  width: ${({ $width = '100%' }) => $width};
  max-width: 100%;
  height: ${({ $height }) => $height}px;
  border-radius: ${token.shapes.small};
`;

export const PageStatus = styled.div`
  ${token.flexColumnCenter}
  gap: 16px;
  width: 100%;
  min-height: 320px;
  color: ${token.colors.gray.gray70};
  ${token.typography('body', 'lg', 'medium')}
`;

export const StatusMessage = styled.p`
  margin: 0;
`;

export const BackButton = styled.button`
  ${token.flexLeft}
  align-self: flex-start;
  gap: 8px;
  height: 21px;
  padding: 0;
  border: 0;
  color: ${token.colors.gray.gray70};
  background: transparent;
  ${token.typography('body', 'lg', 'medium')}
  line-height: 1;
  cursor: pointer;
`;

export const BackIcon = styled.img`
  width: 9.257px;
  height: 16px;
  transform: rotate(180deg);
`;

export const Article = styled.article`
  ${token.flexColumn}
  gap: 28px;
  width: 100%;
`;

export const ArticleHeading = styled.div`
  ${token.flexColumn}
  gap: 20px;
  width: 100%;
`;

export const TitleBlock = styled.div`
  ${token.flexColumn}
  gap: 16px;
  width: 100%;
`;

export const CategoryBadge = styled.span`
  ${token.flexCenter}
  box-sizing: border-box;
  width: 80px;
  min-height: 29px;
  padding: 6px 12px;
  border-radius: ${token.shapes.small};
  color: ${token.colors.gray.gray100};
  background: ${token.colors.primary.primary40};
  ${token.typography('body', 'sm', 'bold')}
  line-height: 1.2;
  white-space: nowrap;
`;

export const TitleRow = styled.div`
  ${token.flexBetween}
  gap: 24px;
  width: 100%;

  @container community-detail (max-width: 700px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
`;

export const Title = styled.h1<PinnedTitleProps>`
  ${token.flexLeft}
  gap: ${({ $isPinned }) => ($isPinned ? '8px' : '0')};
  margin: 0;
  min-width: 0;
  color: ${token.colors.gray.gray100};
  ${token.typography('heading', 'lg', 'semibold')}
  line-height: 1.18;
  overflow-wrap: anywhere;
  transition: gap 220ms cubic-bezier(0.22, 1, 0.36, 1);

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

export const PinnedTitleIcon = styled.img<PinnedTitleProps>`
  flex: 0 0 ${({ $isPinned }) => ($isPinned ? '28px' : '0')};
  width: ${({ $isPinned }) => ($isPinned ? '28px' : '0')};
  height: 28px;
  opacity: ${({ $isPinned }) => ($isPinned ? 1 : 0)};
  transform: ${({ $isPinned }) =>
    $isPinned ? 'scale(1) rotate(0deg)' : 'scale(0.72) rotate(-12deg)'};
  transform-origin: center;
  transition:
    flex-basis 220ms cubic-bezier(0.22, 1, 0.36, 1),
    width 220ms cubic-bezier(0.22, 1, 0.36, 1),
    opacity 140ms ease,
    transform 220ms cubic-bezier(0.22, 1, 0.36, 1);

  @container community-detail (max-width: 700px) {
    flex-basis: ${({ $isPinned }) => ($isPinned ? '22px' : '0')};
    width: ${({ $isPinned }) => ($isPinned ? '22px' : '0')};
    height: 22px;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

export const PostActions = styled.div`
  ${token.flexColumn}
  flex: 0 0 auto;
  align-items: flex-end;
  gap: 6px;

  @container community-detail (max-width: 700px) {
    align-items: flex-start;
  }
`;

export const PostMeta = styled.div`
  ${token.flexLeft}
  flex: 0 1 auto;
  max-width: 100%;
  min-width: 0;
  gap: 12px;
  height: 44px;
`;

export const PostAuthor = styled.div`
  ${token.flexLeft}
  flex: 0 1 auto;
  min-width: 0;
  gap: 8px;
`;

export const PostAuthorImage = styled(ProfileAvatar)<{ $hasBorder: boolean }>`
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

export const PostAuthorName = styled(UserName)`
  display: block;
  flex: 0 1 auto;
  min-width: 0;
  max-width: none;
  overflow: visible;
  color: ${token.colors.gray.gray80};
  ${token.typography('body', 'md', 'medium')}
  line-height: 1.2;
  overflow-wrap: anywhere;
  white-space: normal;
`;

export const PostAuthorTitle = styled(CommunityTitleBadge)`
  gap: 4px;
  max-width: 140px;
  padding: 4px 7px;
`;

export const MetaDot = styled.span`
  width: 4px;
  height: 4px;
  border-radius: ${token.shapes.circle};
  background: ${token.colors.gray.gray40};
`;

export const PostDate = styled.time`
  color: ${token.colors.gray.gray70};
  ${token.typography('body', 'md', 'regular')}
  line-height: 1;
  white-space: nowrap;
`;

export const PostMenu = styled.div`
  position: relative;
  flex: 0 0 auto;
`;

export const PostMenuButton = styled.button`
  ${token.flexCenter}
  box-sizing: border-box;
  width: 34px;
  height: 34px;
  padding: 0;
  border: 0;
  border-radius: ${token.shapes.small};
  background: transparent;
  cursor: pointer;

  &:hover:not(:disabled) {
    background: ${token.colors.gray.gray0};
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

export const PostMenuIcon = styled.img`
  width: 24px;
  height: 24px;
  object-fit: contain;
  transform: rotate(90deg);
`;

export const PostMenuPanel = styled.div`
  ${token.flexColumn}
  position: absolute;
  z-index: 2;
  top: calc(100% + 6px);
  right: 0;
  box-sizing: border-box;
  min-width: 160px;
  padding: 8px;
  border: 1px solid ${token.colors.gray.gray10};
  border-radius: ${token.shapes.large};
  background: ${token.colors.white};
  box-shadow: 0 6px 18px rgb(0 0 0 / 6%);
`;

export const PostMenuItem = styled.button<PostMenuItemProps>`
  width: 100%;
  min-height: 44px;
  padding: 10px 14px;
  border: 0;
  border-radius: ${token.shapes.small};
  color: ${token.colors.gray.gray100};
  background: transparent;
  ${token.typography('body', 'md', 'semibold')}
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

export const PostMenuDivider = styled.span`
  width: 100%;
  height: 1px;
  margin: 4px 0;
  background: ${token.colors.gray.gray10};
`;

export const PinActionError = styled.p`
  margin: 0;
  color: ${token.colors.danger.danger20};
  ${token.typography('body', 'sm', 'medium')}
  line-height: 1.4;
`;

export const Divider = styled.hr`
  width: 100%;
  height: 1px;
  margin: 0;
  border: 0;
  background: ${token.colors.gray.gray10};
`;

export const BodyText = styled.div`
  margin: 0;
  color: ${token.colors.gray.gray100};
  ${token.typography('body', 'lg', 'medium')}
  line-height: 1.4;
  overflow-wrap: anywhere;

  > :first-child {
    margin-top: 0;
  }

  > :last-child {
    margin-bottom: 0;
  }

  .community-post-blocks {
    width: 100%;
    color: inherit;
    background: transparent;
    --bn-colors-editor-text: ${token.colors.gray.gray100};
    --bn-colors-editor-background: transparent;
    --bn-font-family: ${token.fontFamily.system};
  }

  .community-post-blocks .bn-editor {
    min-height: 0;
    padding: 0;
    color: inherit;
    background: transparent;
    font-family: inherit;
    font-size: inherit;
    font-weight: inherit;
    line-height: inherit;
  }

  .community-post-blocks .bn-block-content p,
  .community-post-blocks .bn-block-content h1,
  .community-post-blocks .bn-block-content h2,
  .community-post-blocks .bn-block-content h3,
  .community-post-blocks .bn-block-content h4,
  .community-post-blocks .bn-block-content h5,
  .community-post-blocks .bn-block-content h6 {
    margin: 0;
  }

  .community-post-blocks .bn-block-content[data-content-type='heading'] {
    padding-top: 12px;
    font-weight: ${token.fontWeight.semibold};
    line-height: 1.25;
  }

  .community-post-blocks [data-file-block] .bn-file-block-content-wrapper,
  .community-post-blocks [data-file-block] .bn-visual-media-wrapper {
    position: relative;
    box-sizing: border-box;
    max-width: 100% !important;
  }

  .community-post-blocks
    [data-file-block]
    .bn-visual-media-wrapper[data-media-loading='true'] {
    min-height: 180px;
  }

  .community-post-blocks
    [data-file-block]
    .bn-visual-media-wrapper[data-media-loading='true']::after {
    position: absolute;
    z-index: 1;
    inset: 0;
    border-radius: ${token.shapes.small};
    pointer-events: none;
    content: '';
    ${skeletonSurface}
  }

  .community-post-blocks [data-file-block] .bn-visual-media {
    display: block;
    width: auto !important;
    max-width: 100% !important;
    max-height: 640px;
    height: auto !important;
    object-fit: contain;
  }

  .community-post-blocks [data-content-type='file'] .bn-file-name-with-icon {
    cursor: pointer;
  }

  .community-post-blocks
    .bn-block-outer:not([data-prev-type])
    > .bn-block
    > .bn-block-content[data-content-type='heading'] {
    font-size: ${token.fontSize.heading.lg};
  }

  .community-post-blocks
    .bn-block-outer:not([data-prev-type])
    > .bn-block
    > .bn-block-content[data-content-type='heading'][data-level='2'] {
    font-size: ${token.fontSize.heading.md};
  }

  .community-post-blocks
    .bn-block-outer:not([data-prev-type])
    > .bn-block
    > .bn-block-content[data-content-type='heading'][data-level='3'] {
    font-size: ${token.fontSize.heading.sm};
  }

  .community-post-blocks
    .bn-block-outer:not([data-prev-type])
    > .bn-block
    > .bn-block-content[data-content-type='heading'][data-level='4'] {
    font-size: ${token.fontSize.body.lg};
  }

  .community-post-blocks
    .bn-block-outer:not([data-prev-type])
    > .bn-block
    > .bn-block-content[data-content-type='heading'][data-level='5'],
  .community-post-blocks
    .bn-block-outer:not([data-prev-type])
    > .bn-block
    > .bn-block-content[data-content-type='heading'][data-level='6'] {
    font-size: ${token.fontSize.body.md};
  }

  h1,
  h2,
  h3 {
    margin: 28px 0 12px;
    line-height: 1.3;
  }

  h1 {
    ${token.typography('heading', 'lg', 'semibold')}
  }

  h2 {
    ${token.typography('heading', 'md', 'semibold')}
  }

  h3 {
    ${token.typography('heading', 'sm', 'semibold')}
  }

  p {
    margin: 0 0 12px;
    white-space: pre-wrap;
  }

  ul,
  ol {
    margin: 0 0 16px;
    padding-left: 28px;
  }

  li + li {
    margin-top: 6px;
  }

  blockquote {
    margin: 16px 0;
    padding: 8px 16px;
    border-left: 4px solid ${token.colors.primary.primary50};
    color: ${token.colors.gray.gray70};
    background: ${token.colors.gray.gray0};
  }

  blockquote > :last-child {
    margin-bottom: 0;
  }

  a {
    color: rgb(255, 187, 0);
    text-decoration: underline;
    text-underline-offset: 3px;
  }

  code {
    padding: 2px 5px;
    border-radius: ${token.shapes.xsmall};
    background: ${token.colors.gray.gray0};
    font-family:
      ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 0.9em;
  }

  pre {
    margin: 16px 0;
    padding: 16px;
    overflow-x: auto;
    border-radius: ${token.shapes.small};
    background: ${token.colors.gray.gray0};
  }

  pre code {
    padding: 0;
    background: transparent;
  }

  em {
    display: inline-block;
    font-style: italic;
    transform: skewX(-12deg);
    transform-origin: left center;
  }

  img {
    max-width: 100%;
    max-height: 640px;
    height: auto;
    border-radius: ${token.shapes.small};
    object-fit: contain;
  }

  table {
    display: block;
    max-width: 100%;
    margin: 16px 0;
    overflow-x: auto;
    border-collapse: collapse;
  }

  th,
  td {
    padding: 8px 12px;
    border: 1px solid ${token.colors.gray.gray10};
  }

  th {
    background: ${token.colors.gray.gray0};
    font-weight: ${token.fontWeight.semibold};
  }

  hr {
    height: 1px;
    margin: 24px 0;
    border: 0;
    background: ${token.colors.gray.gray10};
  }
`;

export const Engagement = styled.section`
  ${token.flexColumn}
  gap: 28px;
  width: 100%;
`;

export const EngagementRow = styled.div`
  ${token.flexLeft}
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 16px;
  min-height: 36px;
`;

export const StatGroup = styled.div`
  ${token.flexLeft}
  gap: 20px;
  box-sizing: border-box;
  height: 36px;
  padding: 8px 12px;
  border-radius: ${token.shapes.small};
  background: #f5f5f5;
`;

export const Stat = styled.span`
  ${token.flexLeft}
  gap: 6px;
  color: #404040;
  ${token.typography('body', 'md', 'semibold')}
  line-height: 1;
  white-space: nowrap;
`;

export const HeartButton = styled.button`
  ${token.flexLeft}
  gap: 6px;
  padding: 0;
  border: 0;
  color: #404040;
  background: transparent;
  ${token.typography('body', 'md', 'semibold')}
  line-height: 1;
  cursor: pointer;

  &:disabled {
    cursor: wait;
    opacity: 0.6;
  }
`;

export const RollingNumber = styled.span`
  display: inline-flex;
  height: 1em;
  overflow: hidden;
  font-variant-numeric: tabular-nums;
  line-height: 1;
`;

export const RollingNumberCharacter = styled.span<{
  $isAnimated: boolean;
}>`
  display: inline-block;
  height: 1em;
  min-width: ${({ $isAnimated }) => ($isAnimated ? '0.58em' : 'auto')};
  overflow: hidden;
  vertical-align: top;
`;

export const RollingNumberTrack = styled.span<{
  $animationDelayMs: number;
  $direction: 'increase' | 'decrease';
  $stepCount: number;
}>`
  display: block;
  --rolling-number-offset: ${({ $stepCount }) => `${-($stepCount - 1)}em`};
  animation: ${({ $direction }) =>
      $direction === 'increase' ? rollingNumberIncrease : rollingNumberDecrease}
    850ms cubic-bezier(0.22, 1, 0.36, 1)
    ${({ $animationDelayMs }) => $animationDelayMs}ms both;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

export const RollingNumberValue = styled.span`
  display: block;
  height: 1em;
  line-height: 1;
`;

export const StatIcon = styled.img`
  width: 20px;
  height: 20px;
  object-fit: scale-down;
`;

export const AttachmentArea = styled.div`
  ${token.flexColumn}
  position: relative;
  z-index: 1;
  flex: 0 1 auto;
  width: fit-content;
  gap: 0;
  min-width: 0;
  max-width: min(440px, calc(100vw - 48px));
`;

export const AttachmentToggle = styled.button`
  ${token.flexLeft}
  box-sizing: border-box;
  width: fit-content;
  max-width: 100%;
  height: 36px;
  min-width: 0;
  gap: 12px;
  padding: 8px 12px;
  overflow: hidden;
  border: 0;
  border-radius: ${token.shapes.small};
  color: #404040;
  background: #f5f5f5;
  cursor: pointer;

  &:hover {
    background: ${token.colors.gray.gray10};
  }

  &:focus-visible {
    outline: 2px solid ${token.colors.primary.primary50};
    outline-offset: 2px;
  }
`;

export const AttachmentLabel = styled.span`
  ${token.flexLeft}
  flex: 0 1 auto;
  gap: 4px;
  min-width: 0;
  overflow: hidden;
  ${token.typography('body', 'md', 'medium')}
  line-height: 1;
  white-space: nowrap;
`;

export const AttachmentIcon = styled.img`
  flex: 0 0 20px;
  width: 20px;
  height: 20px;
`;

export const AttachmentText = styled.span`
  flex: 0 0 auto;
`;

export const AttachmentSummaryFileName = styled.span`
  flex: 0 1 auto;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const AttachmentDivider = styled.span`
  flex: 0 0 1px;
  width: 1px;
  height: 22px;
  background: ${token.colors.gray.gray20};
`;

export const AttachmentChevron = styled.img<AttachmentChevronProps>`
  flex: 0 0 20px;
  width: 20px;
  height: 12px;
  object-fit: contain;
  transform: ${({ $isOpen }) => ($isOpen ? 'rotate(0deg)' : 'rotate(180deg)')};
  transition: transform 200ms ease;

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

export const AttachmentPanel = styled.div<AttachmentPanelProps>`
  position: absolute;
  z-index: 3;
  top: calc(100% + 10px);
  left: 0;
  box-sizing: border-box;
  width: max-content;
  min-width: 100%;
  max-width: min(440px, calc(100vw - 48px));
  max-height: ${({ $isOpen }) => ($isOpen ? '360px' : '0')};
  overflow-y: auto;
  padding: ${({ $isOpen }) => ($isOpen ? '8px' : '0 8px')};
  border: 1px solid
    ${({ $isOpen }) => ($isOpen ? token.colors.gray.gray10 : 'transparent')};
  border-radius: ${token.shapes.small};
  background: ${token.colors.white};
  box-shadow: ${({ $isOpen }) =>
    $isOpen ? '0 6px 18px rgb(0 0 0 / 6%)' : 'none'};
  pointer-events: ${({ $isOpen }) => ($isOpen ? 'auto' : 'none')};
  visibility: ${({ $isOpen }) => ($isOpen ? 'visible' : 'hidden')};
  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
  transform: ${({ $isOpen }) =>
    $isOpen ? 'translateY(0)' : 'translateY(-8px)'};
  transition:
    max-height 260ms ease,
    padding 260ms ease,
    opacity 180ms ease,
    transform 260ms ease,
    visibility 0s ${({ $isOpen }) => ($isOpen ? '0s' : '260ms')};

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

export const AttachmentFileList = styled.div`
  ${token.flexColumn}
  gap: 6px;
`;

export const AttachmentFileButton = styled.button`
  ${token.flexLeft}
  box-sizing: border-box;
  width: 100%;
  min-height: 42px;
  gap: 8px;
  padding: 10px 12px;
  border: 1px solid ${token.colors.gray.gray10};
  border-radius: ${token.shapes.small};
  color: ${token.colors.gray.gray80};
  background: ${token.colors.white};
  ${token.typography('body', 'sm', 'medium')}
  text-align: left;
  cursor: pointer;

  &:hover {
    background: ${token.colors.gray.gray0};
  }

  &:focus-visible {
    outline: 2px solid ${token.colors.primary.primary50};
    outline-offset: 2px;
  }
`;

export const AttachmentFileIcon = styled.img`
  flex: 0 0 18px;
  width: 18px;
  height: 18px;
`;

export const AttachmentFileName = styled.span`
  flex: 1 1 auto;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const Comments = styled.section`
  ${token.flexColumn}
  gap: 20px;
  width: 100%;
`;

export const CommentComposer = styled.div`
  ${token.flexColumn}
  align-items: flex-end;
  gap: 12px;
  width: 100%;
`;

export const CommentForm = styled.div`
  ${token.flexColumn}
  gap: 16px;
  width: 100%;
`;

export const CommentHeading = styled.h2`
  margin: 0;
  color: ${token.colors.gray.gray100};
  ${token.typography('heading', 'sm', 'semibold')}
  line-height: 1.2;
`;

export const CommentInputRow = styled.div`
  ${token.flexBetween}
  box-sizing: border-box;
  width: 100%;
  min-height: 52px;
  max-height: 140px;
  padding: 10px 20px;
  overflow: hidden;
  border-radius: ${token.shapes.medium};
  background: ${token.colors.gray.gray0};
`;

export const CommentInput = styled.textarea`
  flex: 1 1 0;
  min-width: 0;
  height: 32px;
  min-height: 32px;
  max-height: 120px;
  padding: 0;
  border: 0;
  outline: 0;
  color: ${token.colors.gray.gray80};
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

export const SendButton = styled.button`
  ${token.flexCenter}
  flex: 0 0 32px;
  width: 32px;
  height: 32px;
  padding: 0;
  border: 0;
  background: transparent;
  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.45;
  }
`;

export const SendIcon = styled.img`
  width: 32px;
  height: 32px;
`;

export const AnonymousLabel = styled.label`
  ${token.flexLeft}
  gap: 8px;
  color: ${token.colors.gray.gray70};
  ${token.typography('body', 'lg', 'medium')}
  line-height: 1;
  cursor: pointer;
`;

export const AnonymousCheckbox = styled.input`
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

export const CommentList = styled.div`
  ${token.flexColumn}
  box-sizing: border-box;
  gap: 12px;
  width: 100%;
  padding: 0;
  overflow: visible;
`;

export const CommentSkeletonList = styled.div`
  ${token.flexColumn}
  gap: 12px;
  width: 100%;
`;

export const CommentSkeletonItem = styled.div`
  display: grid;
  grid-template-columns: 32px minmax(0, 1fr);
  gap: 12px;
  box-sizing: border-box;
  width: 100%;
  padding: 16px;
  border-radius: ${token.shapes.medium};
  background: ${token.colors.white};

  @container community-detail (max-width: 430px) {
    grid-template-columns: 28px minmax(0, 1fr);
    gap: 8px;
    padding: 12px;
  }
`;

export const CommentSkeletonAvatar = styled(SkeletonBlock)`
  flex: 0 0 32px;
  width: 32px;
  height: 32px;
  border-radius: ${token.shapes.circle};

  @container community-detail (max-width: 430px) {
    flex-basis: 28px;
    width: 28px;
    height: 28px;
  }
`;

export const CommentSkeletonContent = styled.div`
  ${token.flexColumn}
  gap: 8px;
  min-width: 0;
`;

export const CommentSkeletonMeta = styled.div`
  ${token.flexLeft}
  gap: 8px;
  width: 100%;
  min-height: 32px;
`;

export const CommentSkeletonAction = styled(SkeletonBlock)`
  width: 72px;
  height: 14px;
  margin: 4px 0;
`;

export const CommentStatus = styled.p`
  margin: 12px 4px;
  color: ${token.colors.gray.gray70};
  ${token.typography('body', 'md', 'medium')}
  line-height: 1.4;
`;

export const ActionError = styled.p`
  align-self: flex-start;
  margin: 0;
  color: ${token.colors.danger.danger20};
  ${token.typography('body', 'sm', 'medium')}
  line-height: 1.4;
`;
