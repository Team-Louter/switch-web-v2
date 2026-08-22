import styled, { css, keyframes } from 'styled-components'

import * as token from '@/shared/styles/values/token'

interface SkeletonBlockProps {
  $height: number
  $width?: string
}

interface PinPostButtonProps {
  $pinned: boolean
}

export const Page = styled.section`
  box-sizing: border-box;
  min-height: 100dvh;
  padding: clamp(32px, 5.1dvh, 50px) 24px;
  container-name: community-detail;
  container-type: inline-size;
  background: ${token.colors.white};

  @media (max-width: 760px) {
    padding-right: 18px;
    padding-left: 18px;
  }
`

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
`

const skeletonShimmer = keyframes`
  from {
    background-position: 200% 0;
  }

  to {
    background-position: -200% 0;
  }
`

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
`

export const DetailSkeleton = styled.div`
  ${token.flexColumn}
  gap: 28px;
  width: 100%;
`

export const SkeletonGroup = styled.div`
  ${token.flexColumn}
  gap: 16px;
  width: 100%;
`

export const SkeletonMetaRow = styled.div`
  ${token.flexBetween}
  gap: 24px;
  width: 100%;

  @container community-detail (max-width: 700px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
`

export const SkeletonBlock = styled.span<SkeletonBlockProps>`
  ${skeletonSurface}
  display: block;
  width: ${({ $width = '100%' }) => $width};
  max-width: 100%;
  height: ${({ $height }) => $height}px;
  border-radius: ${token.shapes.small};
`

export const PageStatus = styled.div`
  ${token.flexColumnCenter}
  gap: 16px;
  width: 100%;
  min-height: 320px;
  color: ${token.colors.gray.gray50};
  ${token.typography('body', 'lg', 'medium')}
`

export const StatusMessage = styled.p`
  margin: 0;
`

export const BackButton = styled.button`
  ${token.flexLeft}
  align-self: flex-start;
  gap: 8px;
  height: 21px;
  padding: 0;
  border: 0;
  color: ${token.colors.gray.gray50};
  background: transparent;
  ${token.typography('body', 'lg', 'medium')}
  line-height: 1;
  cursor: pointer;
`

export const BackIcon = styled.img`
  width: 9.257px;
  height: 16px;
  transform: rotate(180deg);
`

export const Article = styled.article`
  ${token.flexColumn}
  gap: 28px;
  width: 100%;
`

export const ArticleHeading = styled.div`
  ${token.flexColumn}
  gap: 20px;
  width: 100%;
`

export const TitleBlock = styled.div`
  ${token.flexColumn}
  gap: 16px;
  width: 100%;
`

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
`

export const TitleRow = styled.div`
  ${token.flexBetween}
  gap: 24px;
  width: 100%;

  @container community-detail (max-width: 700px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
`

export const Title = styled.h1`
  margin: 0;
  color: ${token.colors.gray.gray100};
  ${token.typography('heading', 'lg', 'semibold')}
  line-height: 1.18;
  overflow-wrap: anywhere;
`

export const PostActions = styled.div`
  ${token.flexColumn}
  flex: 0 0 auto;
  align-items: flex-end;
  gap: 6px;

  @container community-detail (max-width: 700px) {
    align-items: flex-start;
  }
`

export const PostMeta = styled.div`
  ${token.flexLeft}
  flex: 0 0 auto;
  gap: 12px;
  height: 34px;
`

export const PostAuthor = styled.div`
  ${token.flexLeft}
  gap: 8px;
`

export const PostAuthorImage = styled.img`
  width: 22px;
  height: 22px;
  border: 1px solid ${token.colors.gray.gray10};
  border-radius: ${token.shapes.circle};
  object-fit: cover;
`

export const PostAuthorName = styled.span`
  color: ${token.colors.gray.gray80};
  ${token.typography('body', 'md', 'medium')}
  line-height: 1;
  white-space: nowrap;
`

export const MetaDot = styled.span`
  width: 4px;
  height: 4px;
  border-radius: ${token.shapes.circle};
  background: ${token.colors.gray.gray40};
`

export const PostDate = styled.time`
  color: ${token.colors.gray.gray50};
  ${token.typography('body', 'md', 'regular')}
  line-height: 1;
  white-space: nowrap;
`

export const PinPostButton = styled.button<PinPostButtonProps>`
  ${token.flexCenter}
  box-sizing: border-box;
  min-width: 82px;
  height: 34px;
  padding: 0 12px;
  border: 1px solid
    ${({ $pinned }) =>
      $pinned ? token.colors.primary.primary50 : token.colors.gray.gray30};
  border-radius: ${token.shapes.small};
  color: ${({ $pinned }) =>
    $pinned ? token.colors.primary.primary90 : token.colors.gray.gray70};
  background: ${({ $pinned }) =>
    $pinned ? token.colors.primary.primary10 : token.colors.white};
  ${token.typography('body', 'sm', 'bold')}
  cursor: pointer;

  &:hover:not(:disabled) {
    border-color: ${token.colors.primary.primary50};
    background: ${token.colors.primary.primary0};
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

export const PinActionError = styled.p`
  margin: 0;
  color: ${token.colors.danger.danger20};
  ${token.typography('body', 'sm', 'medium')}
  line-height: 1.4;
`

export const Divider = styled.hr`
  width: 100%;
  height: 1px;
  margin: 0;
  border: 0;
  background: ${token.colors.gray.gray10};
`

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
    box-sizing: border-box;
    max-width: 100% !important;
  }

  .community-post-blocks [data-file-block] .bn-visual-media {
    display: block;
    width: auto !important;
    max-width: 100% !important;
    max-height: 640px;
    height: auto !important;
    object-fit: contain;
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
    color: ${token.colors.primary.primary70};
    text-decoration: underline;
    text-underline-offset: 3px;
  }

  code {
    padding: 2px 5px;
    border-radius: ${token.shapes.xsmall};
    background: ${token.colors.gray.gray0};
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
      monospace;
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
`

export const Engagement = styled.section`
  ${token.flexColumn}
  gap: 28px;
  width: 100%;
`

export const EngagementRow = styled.div`
  ${token.flexLeft}
  flex-wrap: wrap;
  gap: 16px;
  min-height: 36px;
`

export const StatGroup = styled.div`
  ${token.flexLeft}
  gap: 20px;
  box-sizing: border-box;
  height: 36px;
  padding: 8px 12px;
  border-radius: ${token.shapes.small};
  background: #f5f5f5;
`

export const Stat = styled.span`
  ${token.flexLeft}
  gap: 6px;
  color: #404040;
  ${token.typography('body', 'md', 'semibold')}
  line-height: 1;
  white-space: nowrap;
`

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
`

export const StatIcon = styled.img`
  width: 20px;
  height: 20px;
  object-fit: scale-down;
`

export const AttachmentList = styled.div`
  ${token.flexRow}
  flex: 1 1 0;
  flex-wrap: wrap;
  gap: 8px;
  min-width: 0;
`

export const AttachmentButton = styled.button`
  ${token.flexLeft}
  min-width: 0;
  gap: 12px;
  box-sizing: border-box;
  max-width: 100%;
  height: 36px;
  padding: 8px 12px;
  overflow: hidden;
  border: 0;
  border-radius: ${token.shapes.small};
  color: #404040;
  background: #f5f5f5;
  cursor: pointer;
`

export const AttachmentLabel = styled.span`
  ${token.flexLeft}
  gap: 4px;
  min-width: 0;
  overflow: hidden;
  ${token.typography('body', 'md', 'medium')}
  line-height: 1;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const AttachmentIcon = styled.img`
  width: 20px;
  height: 20px;
`

export const AttachmentDivider = styled.span`
  width: 1px;
  height: 22px;
  background: ${token.colors.gray.gray20};
`

export const AttachmentChevron = styled.img`
  width: 20px;
  height: 12px;
  object-fit: contain;
  transform: rotate(180deg);
`

export const Comments = styled.section`
  ${token.flexColumn}
  gap: 20px;
  width: 100%;
`

export const CommentComposer = styled.div`
  ${token.flexColumn}
  align-items: flex-end;
  gap: 12px;
  width: 100%;
`

export const CommentForm = styled.div`
  ${token.flexColumn}
  gap: 16px;
  width: 100%;
`

export const CommentHeading = styled.h2`
  margin: 0;
  color: ${token.colors.gray.gray100};
  ${token.typography('heading', 'sm', 'semibold')}
  line-height: 1.2;
`

export const CommentInputRow = styled.div`
  ${token.flexBetween}
  box-sizing: border-box;
  width: 100%;
  height: 52px;
  padding: 10px 20px;
  overflow: hidden;
  border-radius: ${token.shapes.medium};
  background: ${token.colors.gray.gray0};
`

export const CommentInput = styled.input`
  flex: 1 1 0;
  min-width: 0;
  border: 0;
  outline: 0;
  color: ${token.colors.gray.gray80};
  background: transparent;
  ${token.typography('body', 'lg', 'medium')}
  line-height: 1;

  &::placeholder {
    color: ${token.colors.gray.gray40};
  }
`

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
`

export const SendIcon = styled.img`
  width: 32px;
  height: 32px;
`

export const AnonymousLabel = styled.label`
  ${token.flexLeft}
  gap: 8px;
  color: ${token.colors.gray.gray70};
  ${token.typography('body', 'lg', 'medium')}
  line-height: 1;
  cursor: pointer;
`

export const AnonymousCheckbox = styled.input`
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

export const CommentList = styled.div`
  ${token.flexColumn}
  box-sizing: border-box;
  width: 100%;
  padding: 5px 4px;
  overflow: hidden;
`

export const CommentStatus = styled.p`
  margin: 12px 4px;
  color: ${token.colors.gray.gray50};
  ${token.typography('body', 'md', 'medium')}
  line-height: 1.4;
`

export const ActionError = styled.p`
  align-self: flex-start;
  margin: 0;
  color: ${token.colors.danger.danger20};
  ${token.typography('body', 'sm', 'medium')}
  line-height: 1.4;
`

export const CommentRow = styled.article`
  ${token.flexLeft}
  align-items: center;
  gap: 10px;
  width: 100%;
  min-height: 80px;
`

export const ReplyGuide = styled.span`
  position: relative;
  align-self: stretch;
  flex: 0 0 24px;

  &::after {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 10px;
    width: 4px;
    background: ${token.colors.gray.gray10};
    content: '';
  }
`

export const CommentItem = styled.div`
  display: flex;
  flex: 1 1 521px;
  gap: 6px;
  align-items: flex-start;
  max-width: 521px;
  min-width: 0;
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
  ${token.flexLeft}
  gap: 28px;
  width: 100%;
  min-height: 32px;

  @container community-detail (max-width: 430px) {
    gap: 8px;
  }
`

export const CommentMeta = styled.div`
  ${token.flexLeft}
  flex: 0 0 auto;
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

export const CommentDate = styled.time`
  color: ${token.colors.gray.gray40};
  ${token.typography('body', 'md', 'regular')}
  line-height: 1;
  white-space: nowrap;
`

export const CommentMenuButton = styled.button`
  ${token.flexCenter}
  flex: 0 0 24.01px;
  width: 24.01px;
  height: 24.01px;
  padding: 0;
  border: 0;
  background: transparent;
  cursor: pointer;
`

export const CommentMenuIcon = styled.img`
  width: 24.01px;
  height: 24.01px;
  object-fit: contain;
`

export const CommentText = styled.p`
  margin: 0;
  color: #404040;
  ${token.typography('body', 'lg', 'medium')}
  line-height: 1.17;
  overflow-wrap: anywhere;
`
