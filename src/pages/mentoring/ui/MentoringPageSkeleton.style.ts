import styled, { css, keyframes } from 'styled-components'

import * as token from '@/shared/styles/values/token'

const shimmer = keyframes`
  to {
    background-position: -200% 0;
  }
`

const skeletonSurface = css`
  background: linear-gradient(
    90deg,
    ${token.colors.gray.gray0} 20%,
    ${token.colors.gray.gray10} 50%,
    ${token.colors.gray.gray0} 80%
  );
  background-size: 200% 100%;
  animation: ${shimmer} 1.4s ease-in-out infinite;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`

export const PageSkeleton = styled.div`
  ${token.flexColumnStart}
  width: 100%;
  gap: 28px;

  @media (max-width: 640px) {
    gap: 22px;
  }
`

export const DashboardSkeletonHeader = styled.header`
  ${token.flexColumnStart}
  gap: 24px;
  width: 100%;
  min-height: 96px;
  padding-top: 4px;
  zoom: 0.9;
`

export const SkeletonBlock = styled.span<{
  $height: string
  $shape?: 'pill' | 'circle'
  $width: string
}>`
  ${skeletonSurface}
  display: block;
  flex: 0 0 auto;
  width: ${({ $width }) => $width};
  height: ${({ $height }) => $height};
  max-width: 100%;
  border-radius: ${({ $shape }) =>
    $shape === 'circle' ? token.shapes.circle : $shape === 'pill' ? token.shapes.circle : token.shapes.small};
`

export const OverviewSkeletonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  width: 100%;

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
  }
`

export const OverviewSkeletonCard = styled.div`
  ${token.flexColumnStart}
  gap: 12px;
  min-width: 0;
  min-height: 192px;
  padding: 18px 20px;
  border: 1px solid ${token.colors.gray.gray10};
  border-radius: ${token.shapes.large};
  background: ${token.colors.white};
  ${token.elevation('black_1')}

  @media (max-width: 640px) {
    padding: 18px 16px;
  }
`

export const OverviewSkeletonTitle = styled.span<{ $width: string }>`
  ${skeletonSurface}
  display: block;
  width: ${({ $width }) => $width};
  height: 16px;
  border-radius: ${token.shapes.small};
`

export const OverviewSkeletonContent = styled.div`
  display: grid;
  grid-template-columns: 108px minmax(0, 1fr);
  align-items: center;
  gap: 18px;
  width: 100%;
  flex: 1 1 auto;

  @media (max-width: 420px) {
    grid-template-columns: 88px minmax(0, 1fr);
    gap: 12px;
  }
`

export const OverviewSkeletonDonut = styled.span`
  ${skeletonSurface}
  position: relative;
  display: block;
  width: 108px;
  aspect-ratio: 1;
  border-radius: ${token.shapes.circle};

  &::after {
    position: absolute;
    inset: 12px;
    border-radius: inherit;
    background: ${token.colors.white};
    content: '';
  }

  @media (max-width: 420px) {
    width: 88px;

    &::after {
      inset: 10px;
    }
  }
`

export const OverviewSkeletonLegend = styled.div`
  ${token.flexColumnStart}
  width: 100%;
`

export const OverviewSkeletonLegendRow = styled.div`
  ${token.flexBetween}
  gap: 8px;
  width: 100%;
  min-height: 32px;
  padding: 6px 0;
  border-bottom: 1px solid ${token.colors.gray.gray10};

  &:last-child {
    border-bottom: 0;
  }
`

export const DetailPageSkeleton = styled.div`
  ${token.flexColumnStart}
  width: 100%;
  gap: 28px;

  @media (max-width: 640px) {
    gap: 22px;
  }
`

export const SkeletonAvatar = styled.span<{ $size?: 'small' | 'medium' | 'lg' }>`
  ${skeletonSurface}
  display: block;
  flex: 0 0
    ${({ $size }) =>
      $size === 'lg' ? '52px' : $size === 'medium' ? '34px' : $size === 'small' ? '28px' : '42px'};
  width: ${({ $size }) =>
    $size === 'lg' ? '52px' : $size === 'medium' ? '34px' : $size === 'small' ? '28px' : '42px'};
  height: ${({ $size }) =>
    $size === 'lg' ? '52px' : $size === 'medium' ? '34px' : $size === 'small' ? '28px' : '42px'};
  border-radius: ${token.shapes.circle};
`

export const SkeletonIdentity = styled.div`
  ${token.flexCenter}
  min-width: 0;
  gap: 10px;
`

export const SkeletonIdentityLines = styled.div`
  ${token.flexColumnStart}
  min-width: 0;
  gap: 6px;
`

export const TableSkeletonRows = styled.div`
  ${token.flexColumnStart}
  width: 100%;
  gap: 0;
`

export const TableSkeletonRow = styled.div<{ $columns: 'mentor' | 'question' }>`
  display: grid;
  grid-template-columns: ${({ $columns }) =>
    $columns === 'question'
      ? 'minmax(280px, 1.8fr) repeat(4, minmax(110px, 1fr))'
      : 'minmax(210px, 1.55fr) repeat(4, minmax(88px, 1fr))'};
  align-items: center;
  width: 100%;
  min-width: ${({ $columns }) => ($columns === 'question' ? '792px' : '634px')};
  min-height: 72px;
  gap: 12px;
  padding: 12px 22px;
  border-bottom: 1px solid ${token.colors.gray.gray10};

  &:last-child {
    border-bottom: 0;
  }

  @media (max-width: 640px) {
    min-height: 68px;
    padding: 10px 12px;
  }
`

export const SkeletonSearch = styled.span`
  ${skeletonSurface}
  display: block;
  width: 100%;
  box-sizing: border-box;
  height: 42px;
  border: 1px solid ${token.colors.gray.gray10};
  border-radius: ${token.shapes.small};
`

export const SkeletonFilterGroup = styled.div`
  ${token.flexLeft}
  flex-wrap: wrap;
  gap: 8px;
`

export const SkeletonFilter = styled.span<{ $width: string }>`
  ${skeletonSurface}
  display: block;
  width: ${({ $width }) => $width};
  height: 36px;
  border: 1px solid ${token.colors.gray.gray10};
  border-radius: ${token.shapes.small};
`
