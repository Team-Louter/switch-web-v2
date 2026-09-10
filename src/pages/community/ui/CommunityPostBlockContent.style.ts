import styled, { keyframes } from 'styled-components';

import { tokens as token } from '@/shared/styles';

const shimmer = keyframes`
  from { background-position: 200% 0; }
  to { background-position: -200% 0; }
`;

export const Content = styled.section`
  width: 100%;

  > p {
    margin: 0;
    padding: 3px 0;
  }
  > h1,
  > h2,
  > h3,
  > h4,
  > h5,
  > h6 {
    margin: 0;
    padding: 12px 0 3px;
    white-space: pre-wrap;
  }
`;

export const Figure = styled.figure<{ $width?: number }>`
  width: ${({ $width }) =>
    $width === undefined ? '100%' : `min(100%, ${$width}px)`};
  margin: 0;
  padding: 3px 0;

  figcaption {
    margin-top: 8px;
    color: ${token.colors.gray.gray60};
    white-space: pre-wrap;
  }
`;

export const ImageSurface = styled.div<{ $isLoading: boolean }>`
  position: relative;
  overflow: hidden;
  border-radius: 8px;
  aspect-ratio: ${({ $isLoading }) => ($isLoading ? '16 / 9' : 'auto')};
  background: ${({ $isLoading }) =>
    $isLoading ? token.colors.gray.gray10 : 'transparent'};

  &::after {
    position: absolute;
    inset: 0;
    content: '';
    pointer-events: none;
    opacity: ${({ $isLoading }) => ($isLoading ? 1 : 0)};
    background: linear-gradient(
      90deg,
      transparent 25%,
      ${token.colors.gray.gray0} 50%,
      transparent 75%
    );
    background-size: 200% 100%;
    animation: ${shimmer} 1.8s ease-in-out infinite;
    animation-play-state: ${({ $isLoading }) =>
      $isLoading ? 'running' : 'paused'};
  }

  img {
    display: block;
    max-width: 100%;
    height: auto;
    opacity: ${({ $isLoading }) => ($isLoading ? 0 : 1)};
    transition: opacity 220ms ease-out;
  }

  @media (prefers-reduced-motion: reduce) {
    &::after {
      animation: none;
    }
    img {
      transition: none;
    }
  }
`;

export const ImageError = styled.div`
  display: grid;
  place-items: center;
  min-height: 120px;
  padding: 24px;
  color: ${token.colors.gray.gray60};
  background: ${token.colors.gray.gray10};
  font-size: 14px;
`;

export const LinkCard = styled.div`
  width: min(100%, 640px);
  box-sizing: border-box;
  margin: 12px 0;
  overflow: hidden;
  border: 1px solid ${token.colors.gray.gray20};
  border-left: 4px solid ${token.colors.primary.primary50};
  border-radius: 8px;
  background: ${token.colors.gray.gray0};
`;

export const LinkDetails = styled.a`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 18px 20px;
  text-decoration: none;
  overflow-wrap: anywhere;

  &:hover {
    background: ${token.colors.gray.gray10};
  }
  &:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: -3px;
  }
`;

export const LinkProvider = styled.span`
  color: ${token.colors.gray.gray60};
  font-size: 13px;
`;

export const LinkTitle = styled.strong`
  color: ${token.colors.gray.gray100};
  font-size: 17px;
`;

export const LinkAddress = styled.span`
  color: ${token.colors.gray.gray60};
  font-size: 13px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const VideoEmbed = styled.div`
  position: relative;
  aspect-ratio: 16 / 9;
  margin: 0 16px 16px;
  overflow: hidden;
  border-radius: 6px;
  background: ${token.colors.gray.gray100};

  iframe {
    display: block;
    width: 100%;
    height: 100%;
    border: 0;
  }
`;

export const PlayButton = styled.button`
  position: absolute;
  inset: 0;
  width: 100%;
  padding: 0;
  border: 0;
  cursor: pointer;
  background: transparent;

  ${Figure} {
    height: 100%;
    padding: 0;
  }
  ${ImageSurface} {
    height: 100%;
  }
  ${ImageSurface} img {
    width: 100%;
    height: 100%;
    max-height: none;
    object-fit: cover;
    object-position: center;
  }
  &:focus-visible {
    outline: 3px solid ${token.colors.gray.gray0};
    outline-offset: -4px;
  }
`;

export const PlayIcon = styled.span`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: grid;
  place-items: center;
  width: 64px;
  height: 44px;
  border-radius: 12px;
  color: ${token.colors.gray.gray0};
  background: ${token.colors.gray.gray100};
  font-size: 22px;
  pointer-events: none;
`;

export const LoadingSkeleton = styled.div`
  display: grid;
  gap: 10px;
  width: 100%;
  padding: 3px 0;
`;

export const SkeletonLine = styled.span<{ $width: string }>`
  width: ${({ $width }) => $width};
  height: 18px;
  border-radius: 4px;
  background: linear-gradient(90deg, #f3f2f1 25%, #e8e7e3 50%, #f3f2f1 75%);
  background-size: 200% 100%;
  animation: ${shimmer} 1.4s ease-in-out infinite;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;
