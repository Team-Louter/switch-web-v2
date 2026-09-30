import styled, { keyframes } from 'styled-components';

import { tokens as token } from '@/shared/styles';

export const Picker = styled.section`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  min-height: 0;
  height: min(480px, calc(100dvh - 100px));
`;

export const Header = styled.header`
  ${token.flexBetween}
  flex-shrink: 0;
  gap: 16px;
`;

export const Title = styled.h2`
  margin: 0;
  color: ${token.colors.gray.gray100};
  ${token.typography('heading', 'sm', 'semibold')}
`;

export const IconButton = styled.button`
  ${token.flexCenter}
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  padding: 0;
  border: 0;
  border-radius: ${token.shapes.small};
  color: ${token.colors.gray.gray60};
  background: transparent;
  cursor: pointer;

  &:hover {
    background: ${token.colors.gray.gray0};
  }

  &:focus-visible {
    outline: 2px solid ${token.colors.primary.primary50};
  }

  &:disabled {
    cursor: default;
    opacity: 0.5;
  }
`;

export const SearchField = styled.div`
  ${token.flexRow}
  flex-shrink: 0;
  padding: 4px 8px;
  border: 1px solid ${token.colors.gray.gray20};
  border-radius: ${token.shapes.medium};

  &:focus-within {
    border-color: ${token.colors.primary.primary50};
  }
`;

export const SearchInput = styled.input`
  flex: 1;
  min-width: 0;
  padding: 8px;
  border: 0;
  outline: none;
  color: ${token.colors.gray.gray100};
  background: transparent;
  ${token.typography('body', 'md', 'regular')}

  &::placeholder {
    color: ${token.colors.gray.gray40};
  }

  &::-webkit-search-cancel-button {
    appearance: none;
  }
`;

export const ResultsHeader = styled.p`
  flex-shrink: 0;
  margin: 0;
  color: ${token.colors.gray.gray60};
  ${token.typography('body', 'sm', 'medium')}
`;

export const Results = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overscroll-behavior: contain;
`;

export const Grid = styled.div`
  display: grid;
  flex-shrink: 0;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;

  @media (max-width: 480px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

export const GifButton = styled.button`
  position: relative;
  aspect-ratio: 1;
  min-width: 0;
  overflow: hidden;
  padding: 0;
  border: 2px solid transparent;
  border-radius: ${token.shapes.small};
  background: ${token.colors.gray.gray0};
  cursor: pointer;

  &:hover,
  &:focus-visible {
    border-color: ${token.colors.primary.primary50};
    outline: none;
  }

  &:disabled {
    border-color: transparent;
    cursor: default;
  }
`;

const skeletonShimmer = keyframes`
  from { background-position: 200% 0; }
  to { background-position: -200% 0; }
`;

export const GifSkeleton = styled.span`
  display: block;
  width: 100%;
  aspect-ratio: 1;
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

export const ImageSkeleton = styled(GifSkeleton)`
  position: absolute;
  inset: 0;
`;

export const ImageError = styled.span`
  ${token.flexCenter}
  position: absolute;
  inset: 0;
  padding: 8px;
  color: ${token.colors.gray.gray60};
  ${token.typography('caption', 'sm', 'medium')}
`;

export const GifImage = styled.img<{ $loaded: boolean }>`
  display: block;
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: ${({ $loaded }) => ($loaded ? 1 : 0)};
`;

export const Status = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 32px 12px;
  color: ${token.colors.gray.gray60};
  ${token.typography('body', 'sm', 'regular')}
  text-align: center;
`;

export const MoreButton = styled.button`
  align-self: center;
  flex-shrink: 0;
  padding: 10px 20px;
  border: 1px solid ${token.colors.gray.gray20};
  border-radius: ${token.shapes.medium};
  color: ${token.colors.gray.gray70};
  background: ${token.colors.white};
  ${token.typography('body', 'sm', 'medium')}
  cursor: pointer;

  &:hover {
    background: ${token.colors.gray.gray0};
  }

  &:focus-visible {
    outline: 2px solid ${token.colors.primary.primary50};
  }

  &:disabled {
    cursor: default;
    opacity: 0.5;
  }
`;

export const Attribution = styled.p`
  flex-shrink: 0;
  margin: 0;
  color: ${token.colors.gray.gray40};
  ${token.typography('caption', 'sm', 'medium')}
  text-align: right;
`;
