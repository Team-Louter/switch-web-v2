import styled, { css, keyframes } from 'styled-components'

import * as token from '@/shared/styles/values/token'
import { Button } from '@/shared/ui'

type StatIconKind = 'heart' | 'comment' | 'view'

export const Page = styled.section`
  ${token.flexColumn}
  align-items: flex-start;
  justify-content: flex-start;
  box-sizing: border-box;
  min-height: 100dvh;
  padding: clamp(20px, 2vw, 30px) clamp(20px, 2vw, 30px)
    clamp(20px, 2vw, 30px) 0;
  container-name: community-page;
  container-type: inline-size;
  background: ${token.colors.white};
`

export const Content = styled.div`
  ${token.flexColumn}
  gap: 28px;
  width: 100%;

  @container community-page (max-width: 760px) {
    gap: 24px;
  }
`

export const Header = styled.header`
  ${token.flexColumn}
  gap: 10px;
`

export const TabActionRow = styled.div`
  ${token.flexLeft}
  gap: 16px;
  min-width: 0;

  > button {
    flex: 0 0 auto;
  }

  @container community-page (max-width: 600px) {
    gap: 8px;
  }
`

export const WriteButton = styled(Button)`
  gap: 6px;
  color: ${token.colors.gray.gray100};
  ${token.typography('body', 'sm', 'bold')}

  svg {
    flex: 0 0 auto;
    color: currentColor;
  }
`

export const CategoryTabs = styled.div`
  display: flex;
  justify-content: flex-start;
  box-sizing: border-box;
  flex: 1 1 0;
  min-width: 0;
  min-height: 44px;
  padding: 0 4px;
  overflow-x: auto;
  border-bottom: 1px solid ${token.colors.gray.gray10};
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }

`

export const CategoryTab = styled.button<{ $active: boolean }>`
  position: relative;
  flex: 1 0 112px;
  min-height: 44px;
  border: 0;
  color: ${({ $active }) =>
    $active ? token.colors.gray.gray100 : token.colors.gray.gray50};
  background: transparent;
  ${token.typography('body', 'md', 'medium')}
  line-height: 1;
  cursor: pointer;

  &::after {
    position: absolute;
    right: 12px;
    bottom: -1px;
    left: 12px;
    height: 3px;
    background: ${({ $active }) =>
      $active ? token.colors.primary.primary40 : 'transparent'};
    content: '';
  }

  @container community-page (max-width: 600px) {
    flex-basis: 96px;
  }
`

export const PostList = styled.section`
  overflow: hidden;
  width: 100%;
  background: ${token.colors.white};
`

export const StatusState = styled.div`
  ${token.flexColumnCenter}
  gap: 16px;
  width: 100%;
  min-height: 240px;
  color: ${token.colors.gray.gray50};
  ${token.typography('body', 'lg', 'medium')}
`

export const StatusMessage = styled.p`
  margin: 0;
`

export const EmptyState = styled.div`
  ${token.flexColumnCenter}
  gap: 6px;
  box-sizing: border-box;
  min-height: calc(100dvh - 204px);
  padding: 24px;
  border-bottom: 1px solid ${token.colors.gray.gray10};
`

export const EmptyIcon = styled.div`
  ${token.flexCenter}
  width: 32px;
  height: 32px;
  margin-bottom: 2px;
  border-radius: ${token.shapes.circle};
  color: ${token.colors.gray.gray40};
  background: ${token.colors.gray.gray0};
`

export const EmptyTitle = styled.p`
  margin: 0;
  color: ${token.colors.gray.gray60};
  ${token.typography('body', 'sm', 'semibold')}
`

export const EmptyDescription = styled.p`
  margin: 0;
  color: ${token.colors.gray.gray40};
  ${token.typography('caption', 'lg', 'regular')}
`

export const PostRow = styled.article`
  display: flex;
  gap: 10px;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  height: 56px;
  padding: 6px 10px;
  overflow: hidden;
  border-bottom: 1px solid ${token.colors.gray.gray10};
  background: ${token.colors.white};
  cursor: pointer;
  transition: background-color 120ms ease;

  &:hover {
    background: ${token.colors.gray.gray0};
  }

  &:focus-visible {
    outline: 2px solid ${token.colors.primary.primary50};
    outline-offset: -2px;
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
  border-radius: ${token.shapes.small};
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

export const SkeletonRow = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  height: 56px;
  padding: 6px 10px;
  border-bottom: 1px solid ${token.colors.gray.gray10};
`

export const SkeletonCategory = styled.span`
  ${skeletonSurface}
  flex: 0 0 80px;
  height: 29px;

  @container community-page (max-width: 430px) {
    flex-basis: 72px;
  }
`

export const SkeletonTitle = styled.span`
  ${skeletonSurface}
  flex: 1 1 0;
  min-width: 0;
  height: 20px;
`

export const SkeletonAuthor = styled.span`
  ${skeletonSurface}
  flex: 0 0 180px;
  height: 28px;

  @container community-page (max-width: 900px) {
    flex-basis: 140px;
  }

  @container community-page (max-width: 600px) {
    display: none;
  }
`

export const SkeletonDate = styled.span`
  ${skeletonSurface}
  flex: 0 0 88px;
  height: 20px;
  margin: 0 10px;

  @container community-page (max-width: 900px) {
    flex-basis: 76px;
    margin-inline: 4px;
  }

  @container community-page (max-width: 760px) {
    display: none;
  }
`

export const SkeletonStats = styled.span`
  ${skeletonSurface}
  flex: 0 0 183px;
  height: 24px;
  margin: 0 15.5px;

  @container community-page (max-width: 900px) {
    flex-basis: 158px;
    margin-inline: 8px;
  }

  @container community-page (max-width: 600px) {
    flex-basis: 142px;
    margin-inline: 4px;
  }

  @container community-page (max-width: 430px) {
    flex-basis: 120px;
  }

  @container community-page (max-width: 300px) {
    display: none;
  }
`

export const CategoryCell = styled.div`
  ${token.flexCenter}
  flex: 0 0 96px;
  height: 100%;
  overflow: hidden;

  @container community-page (max-width: 430px) {
    flex-basis: 84px;
  }
`

export const PostCategory = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  min-height: 26px;
  padding: 3px 10px;
  border: 1px solid ${token.colors.primary.text};
  border-radius: 999px;
  color: ${token.colors.primary.text};
  background: transparent;
  ${token.typography('caption', 'lg', 'semibold')}
  line-height: 1;
  white-space: nowrap;
`

export const PinnedIcon = styled.img`
  flex: 0 0 20px;
  width: 20px;
  height: 20px;

  @container community-page (max-width: 430px) {
    width: 18px;
    height: 18px;
  }
`

export const PostTitle = styled.p<{ $pinned: boolean }>`
  display: flex;
  flex: 1 1 0;
  gap: 4px;
  min-width: 0;
  align-items: center;
  box-sizing: border-box;
  height: 100%;
  overflow: hidden;
  margin: 0;
  padding: 8px 0;
  color: ${token.colors.gray.gray100};
  ${({ $pinned }) =>
    token.typography('body', 'md', $pinned ? 'bold' : 'medium')}
  line-height: 1.2;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const PostTitleText = styled.span`
  flex: 0 1 auto;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const ImageAttachmentIcon = styled.img`
  flex: 0 0 auto;
  width: 14px;
  height: 14px;
`

export const Author = styled.div`
  ${token.flexCenter}
  flex: 0 0 180px;
  gap: 8px;
  box-sizing: border-box;
  height: 100%;
  padding: 6px 4px;
  overflow: hidden;

  @container community-page (max-width: 900px) {
    flex-basis: 140px;
  }

  @container community-page (max-width: 600px) {
    display: none;
  }
`

export const AuthorImage = styled.img`
  flex: 0 0 auto;
  width: 28px;
  height: 28px;
  border: 1px solid ${token.colors.gray.gray10};
  border-radius: ${token.shapes.circle};
  object-fit: cover;
`

export const AuthorName = styled.p<{ $pinned: boolean }>`
  flex: 0 0 136px;
  overflow: hidden;
  margin: 0;
  color: ${token.colors.gray.gray80};
  ${({ $pinned }) =>
    token.typography('body', 'sm', $pinned ? 'bold' : 'medium')}
  line-height: 1.2;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const Date = styled.time`
  ${token.flexCenter}
  flex: 0 0 88px;
  box-sizing: border-box;
  height: 100%;
  padding: 6px;
  color: ${token.colors.gray.gray80};
  ${token.typography('body', 'sm', 'medium')}
  line-height: 1.2;
  white-space: nowrap;

  @container community-page (max-width: 900px) {
    flex-basis: 76px;
    padding-inline: 4px;
  }

  @container community-page (max-width: 760px) {
    display: none;
  }
`

export const Stats = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  flex: 0 0 180px;
  box-sizing: border-box;
  height: 100%;
  padding: 8px 12px;
  overflow: hidden;

  @container community-page (max-width: 900px) {
    flex-basis: 150px;
    padding-inline: 8px;
  }

  @container community-page (max-width: 600px) {
    flex-basis: 130px;
    padding-inline: 4px;
  }

  @container community-page (max-width: 430px) {
    flex-basis: 114px;
  }

  @container community-page (max-width: 300px) {
    display: none;
  }
`

export const Stat = styled.span`
  ${token.flexLeft}
  justify-content: flex-start;
  min-width: 0;
  gap: 3px;
  color: ${token.colors.gray.gray80};
  ${token.typography('body', 'sm', 'medium')}
  font-variant-numeric: tabular-nums;
  line-height: 1;

  @container community-page (max-width: 600px) {
    gap: 2px;
  }

  @container community-page (max-width: 430px) {
    gap: 2px;
    font-size: ${token.fontSize.body.sm};
  }
`

export const StatValue = styled.span`
  min-width: 3ch;
`

export const StatIcon = styled.img<{ $kind: StatIconKind }>`
  flex: 0 0 auto;
  width: ${({ $kind }) => ($kind === 'comment' ? '13px' : '16px')};
  height: ${({ $kind }) => ($kind === 'comment' ? '13px' : '16px')};
  object-fit: contain;

  @container community-page (max-width: 600px) {
    width: ${({ $kind }) => ($kind === 'comment' ? '12px' : '14px')};
    height: ${({ $kind }) => ($kind === 'comment' ? '12px' : '14px')};
  }
`

export const Pagination = styled.nav`
  ${token.flexCenter}
  gap: 8px;

  @container community-page (max-width: 430px) {
    gap: 6px;
  }
`

export const PageButton = styled.button<{ $active: boolean }>`
  ${token.flexCenter}
  box-sizing: border-box;
  width: 28px;
  height: 28px;
  padding: 4px;
  border: 0;
  border-radius: 8px;
  color: ${token.colors.gray.gray100};
  background: ${({ $active }) =>
    $active ? token.colors.primary.primary20 : 'transparent'};
  ${token.typography('body', 'sm', 'medium')}
  line-height: 1;
  cursor: pointer;

  &:disabled {
    cursor: default;
  }
`
