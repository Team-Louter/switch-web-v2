import styled, { css, keyframes } from 'styled-components'

import * as token from '@/shared/styles/values/token'

type StatIconKind = 'heart' | 'comment' | 'view'

export const Page = styled.section`
  ${token.flexColumn}
  align-items: center;
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
  max-width: calc(1003px / 0.9);
  zoom: 0.9;

  @container community-page (max-width: 760px) {
    gap: 24px;
  }
`

export const Header = styled.header`
  ${token.flexColumn}
  gap: 16px;
`

export const HeadingRow = styled.div`
  ${token.flexBetween}
  gap: 16px;

  @container community-page (max-width: 600px) {
    align-items: flex-start;
  }
`

export const Heading = styled.h1`
  margin: 0;
  color: ${token.colors.gray.gray100};
  ${token.typography('heading', 'lg', 'semibold')}
  line-height: 1.18;
`

export const HeadingDescription = styled.p`
  margin: 0 0 0 16px;
  color: ${token.colors.gray.gray50};
  ${token.typography('body', 'lg', 'medium')}
  line-height: 1.17;

  @container community-page (max-width: 700px) {
    margin: 8px 0 0;
  }

  @container community-page (max-width: 430px) {
    display: none;
  }
`

export const HeadingGroup = styled.div`
  ${token.flexLeft}
  min-width: 0;

  @container community-page (max-width: 700px) {
    display: block;
  }
`

export const CategoryTabs = styled.div`
  ${token.flexBetween}
  box-sizing: border-box;
  width: min(calc(1000px / 0.9), 100%);
  min-height: 56px;
  padding: 4px;
  overflow-x: auto;
  border-radius: ${token.shapes.xlarge};
  background: ${token.colors.gray.gray0};
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }

  @container community-page (max-width: 930px) {
    justify-content: flex-start;
  }
`

export const CategoryTab = styled.button<{ $active: boolean }>`
  flex: 0 0 116px;
  min-height: 48px;
  border: 0;
  border-radius: ${token.shapes.large};
  color: ${({ $active }) =>
    $active ? token.colors.gray.gray100 : token.colors.gray.gray50};
  background: ${({ $active }) =>
    $active ? token.colors.white : 'transparent'};
  ${token.typography('heading', 'sm', 'medium')}
  line-height: 1;
  cursor: pointer;

  @container community-page (max-width: 600px) {
    flex-basis: 104px;
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
  width: min(calc(1000px / 0.9), 100%);
  min-height: 240px;
  color: ${token.colors.gray.gray50};
  ${token.typography('body', 'lg', 'medium')}
`

export const StatusMessage = styled.p`
  margin: 0;
`

export const PostRow = styled.article`
  display: flex;
  gap: 10px;
  align-items: center;
  box-sizing: border-box;
  width: min(calc(1000px / 0.9), 100%);
  height: 72px;
  padding: 10px;
  overflow: hidden;
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
  width: min(calc(1000px / 0.9), 100%);
  height: 72px;
  padding: 10px;
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
  flex: 0 0 120px;
  height: 32px;

  @container community-page (max-width: 900px) {
    flex-basis: 110px;
  }

  @container community-page (max-width: 600px) {
    display: none;
  }
`

export const SkeletonDate = styled.span`
  ${skeletonSurface}
  flex: 0 0 156px;
  height: 20px;
  margin: 0 10px;

  @container community-page (max-width: 900px) {
    flex-basis: 142px;
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
  flex: 0 0 80px;
  height: 100%;
  overflow: hidden;

  @container community-page (max-width: 430px) {
    flex-basis: 72px;
  }
`

export const PostCategory = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  min-width: 80px;
  min-height: 29px;
  padding: 6px 12px;
  border-radius: ${token.shapes.small};
  color: ${token.colors.gray.gray100};
  background: ${token.colors.primary.primary40};
  ${token.typography('body', 'sm', 'bold')}
  line-height: 1.2;
  white-space: nowrap;

  @container community-page (max-width: 430px) {
    min-width: 72px;
    padding-inline: 8px;
    font-size: ${token.fontSize.caption.lg};
  }
`

export const PinnedIcon = styled.img`
  flex: 0 0 28px;
  width: 28px;
  height: 28px;

  @container community-page (max-width: 430px) {
    width: 22px;
    height: 22px;
  }
`

export const PostTitle = styled.p<{ $pinned: boolean }>`
  display: flex;
  flex: 1 1 0;
  min-width: 0;
  align-items: center;
  box-sizing: border-box;
  height: 100%;
  overflow: hidden;
  margin: 0;
  padding: 12px 0;
  color: ${token.colors.gray.gray100};
  ${token.typography('body', 'lg', 'semibold')}
  line-height: 1.2;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const Author = styled.div`
  ${token.flexCenter}
  flex: 0 0 120px;
  gap: 8px;
  box-sizing: border-box;
  height: 100%;
  padding: 12px 4px;
  overflow: hidden;

  @container community-page (max-width: 900px) {
    flex-basis: 110px;
  }

  @container community-page (max-width: 600px) {
    display: none;
  }
`

export const AuthorImage = styled.img`
  flex: 0 0 auto;
  width: 32px;
  height: 32px;
  border: 1px solid ${token.colors.gray.gray10};
  border-radius: ${token.shapes.circle};
  object-fit: cover;
`

export const AuthorName = styled.p`
  flex: 0 0 72px;
  overflow: hidden;
  margin: 0;
  color: ${token.colors.gray.gray80};
  ${token.typography('body', 'lg', 'medium')}
  line-height: 1.2;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const Date = styled.time`
  ${token.flexCenter}
  flex: 0 0 176px;
  box-sizing: border-box;
  height: 100%;
  padding: 10px;
  color: ${token.colors.gray.gray80};
  ${token.typography('body', 'lg', 'medium')}
  line-height: 1.2;
  white-space: nowrap;

  @container community-page (max-width: 900px) {
    flex-basis: 150px;
    padding-inline: 4px;
  }

  @container community-page (max-width: 760px) {
    display: none;
  }
`

export const Stats = styled.div`
  ${token.flexCenter}
  flex: 0 0 214px;
  gap: 12px;
  box-sizing: border-box;
  height: 100%;
  padding: 12px 15.5px;
  overflow: hidden;

  @container community-page (max-width: 900px) {
    flex-basis: 174px;
    gap: 8px;
    padding-inline: 8px;
  }

  @container community-page (max-width: 600px) {
    flex-basis: 150px;
    padding-inline: 4px;
  }

  @container community-page (max-width: 430px) {
    flex-basis: 128px;
    gap: 4px;
  }

  @container community-page (max-width: 300px) {
    display: none;
  }
`

export const Stat = styled.span`
  ${token.flexLeft}
  flex: 0 0 53px;
  gap: 4px;
  width: 53px;
  color: ${token.colors.gray.gray80};
  ${token.typography('body', 'lg', 'medium')}
  line-height: 1;

  @container community-page (max-width: 600px) {
    flex: 1 1 0;
    width: auto;
  }

  @container community-page (max-width: 430px) {
    gap: 2px;
    font-size: ${token.fontSize.body.sm};
  }
`

export const StatIcon = styled.img<{ $kind: StatIconKind }>`
  flex: 0 0 auto;
  width: 24px;
  height: 24px;
  object-fit: none;

  @container community-page (max-width: 600px) {
    width: 20px;
    height: 20px;
  }
`

export const Pagination = styled.nav`
  ${token.flexCenter}
  gap: 12px;

  @container community-page (max-width: 430px) {
    gap: 6px;
  }
`

export const PageButton = styled.button<{ $active: boolean }>`
  ${token.flexCenter}
  box-sizing: border-box;
  width: 36px;
  height: 36px;
  padding: 7px 12px;
  border: 0;
  border-radius: ${token.shapes.large};
  color: ${token.colors.gray.gray100};
  background: ${({ $active }) =>
    $active ? token.colors.primary.primary30 : 'transparent'};
  ${token.typography('heading', 'sm', 'semibold')}
  line-height: 1;
  cursor: pointer;

  &:disabled {
    cursor: default;
  }
`
