import styled, { css, keyframes } from 'styled-components';

import * as token from '@/shared/styles/values/token';

export const Page = styled.section`
  ${token.flexColumn}
  align-items: flex-start;
  justify-content: flex-start;
  box-sizing: border-box;
  min-height: 100dvh;
  padding: clamp(20px, 2vw, 30px);
  container-name: community-page;
  container-type: inline-size;
  background: ${token.colors.white};

  @media (max-width: 430px) {
    padding: 16px;
  }
`;

export const Content = styled.div`
  ${token.flexColumn}
  gap: 28px;
  width: 100%;

  @container community-page (max-width: 760px) {
    gap: 24px;
  }
`;

export const Header = styled.header`
  ${token.flexColumn}
  position: sticky;
  top: clamp(20px, 2vw, 30px);
  z-index: 10;
  gap: 10px;
  width: 100%;
  background: ${token.colors.white};

  &::before {
    position: absolute;
    top: -30px;
    right: 0;
    left: 0;
    height: 30px;
    background: ${token.colors.white};
    content: '';
  }

  > * {
    position: relative;
  }
`;

export const TabActionRow = styled.div`
  ${token.flexLeft}
  gap: 16px;
  min-width: 0;

  > button {
    flex: 0 0 auto;
  }

  @container community-page (max-width: 900px) {
    align-items: flex-start;
    gap: 10px;
  }

  @container community-page (max-width: 600px) {
    gap: 8px;
  }
`;

export const PostList = styled.section`
  overflow: hidden;
  width: 100%;
  background: ${token.colors.white};
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
`;

export const SkeletonRow = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  height: 56px;
  padding: 6px 10px;
  border-bottom: 1px solid ${token.colors.gray.gray10};

  @container community-page (max-width: 430px) {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 72px;
    height: 108px;
    padding: 10px 8px;
  }
`;

export const SkeletonCategory = styled.span`
  ${skeletonSurface}
  flex: 0 0 72px;
  height: 26px;

  @container community-page (max-width: 430px) {
    grid-column: 2;
    grid-row: 1;
    flex-basis: 72px;
  }
`;

export const SkeletonTitle = styled.span`
  ${skeletonSurface}
  flex: 1 1 0;
  min-width: 0;
  height: 20px;

  @container community-page (max-width: 430px) {
    grid-column: 1;
    grid-row: 1;
  }
`;

export const SkeletonAuthor = styled.span`
  ${skeletonSurface}
  flex: 0 0 180px;
  height: 28px;

  @container community-page (max-width: 900px) {
    flex-basis: 140px;
  }

  @container community-page (max-width: 600px) {
    flex: 0 1 auto;
    height: auto;
    padding: 0;

  }

  @container community-page (max-width: 430px) {
    grid-column: 1;
    grid-row: 2;
    justify-content: flex-start;
  }
`;

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
`;

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
    grid-column: 1 / -1;
    grid-row: 3;
    width: 120px;
    margin: 0;
  }

  @container community-page (max-width: 300px) {
    display: none;
  }
`;
