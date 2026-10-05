import styled, { css, keyframes } from 'styled-components'

import * as token from '@/shared/styles/values/token'
import DecoSvg from '../assets/deco1.svg?react'

type PeriodState = 'past' | 'current' | 'future'

export const PageContainer = styled.section`
  width: 100%;
  height: 100vh;
  padding: clamp(20px, 2vw, 30px);
  overflow: hidden;
  background: ${token.colors.white};
  @media (max-width: 768px) { height: auto; min-height: calc(100dvh - 60px); padding: 20px 16px 48px; overflow: visible; }
`

const learningContentReveal = keyframes`
  from {
    opacity: 0;
    transform: translateY(8px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
`

export const ScrollArea = styled.div<{ $loaded: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 28px;
  width: 100%;
  height: 100%;
  min-height: 0;
  padding-right: clamp(20px, 2vw, 30px);
  overflow-y: auto;
  /* 배치 추가 위치는 useLayoutEffect에서 보정하므로 브라우저의 중복 보정을 막는다. */
  overflow-anchor: none;
  scrollbar-color: ${token.colors.gray.gray30} transparent;
  scrollbar-gutter: stable;
  scrollbar-width: thin;
  animation: ${({ $loaded }) =>
    $loaded &&
    css`${learningContentReveal} 420ms cubic-bezier(0.22, 1, 0.36, 1) both`};

  &::-webkit-scrollbar {
    width: 14px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    border: 2px solid transparent;
    border-radius: ${token.shapes.circle};
    background: ${token.colors.gray.gray30};
    background-clip: padding-box;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: ${token.colors.gray.gray40};
    background-clip: padding-box;
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
  @media (max-width: 768px) { height: auto; padding-right: 0; overflow: visible; scrollbar-gutter: auto; }
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
  border-radius: ${token.shapes.xsmall};
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

export const SkeletonList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 28px;
  width: 100%;
`

export const SkeletonColumn = styled.div`
  ${token.flexColumn};
  width: 100%;
  flex: 0 0 auto;
  container-type: inline-size;
  container-name: learning-week;
`

export const SkeletonMonthRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`

export const SkeletonMonth = styled.span<{ $isMentor: boolean }>`
  ${skeletonSurface};
  display: block;
  width: ${({ $isMentor }) => ($isMentor ? '120px' : '56px')};
  height: 25px;
`

export const SkeletonNow = styled.span`
  ${skeletonSurface};
  display: block;
  width: 32px;
  height: 18px;
  margin-right: auto;
  margin-left: 10px;
`

export const SkeletonHeaderAction = styled.span`
  ${skeletonSurface};
  display: block;
  width: 180px;
  height: 18px;
  margin-right: 16px;
`

export const SkeletonCard = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  gap: 30px;
  width: 100%;
  height: 170px;
  flex: 0 0 auto;
  margin-top: 3px;
  padding: 16px 25px;
  overflow: hidden;
  border: 2px solid ${token.colors.gray.gray10};
  border-radius: ${token.shapes.xlarge};
  border-top-left-radius: 0;
  background-color: ${token.colors.white};

  @container learning-week (max-width: 980px) {
    height: auto;
    min-height: 0;
    gap: 20px;
    padding: 18px 20px;
  }

  @media (max-width: 768px) {
    height: auto;
    min-height: 300px;
    flex-direction: column;
    gap: 16px;
    padding: 18px;
  }
`

export const SkeletonProgressContent = styled.div`
  ${token.flexColumn};
  width: 100px;
  height: 100%;

  @media (max-width: 768px) {
    display: grid;
    grid-template-columns: 1fr auto;
    width: 100%;
    height: auto;
    align-items: center;
    align-content: center;
    justify-content: stretch;
    gap: 6px 12px;
  }
`

export const SkeletonProgressLabel = styled.span`
  ${skeletonSurface};
  display: block;
  width: 42px;
  height: 18px;
`

export const SkeletonProgressRate = styled.span`
  ${skeletonSurface};
  display: block;
  width: 58px;
  height: 30px;
  margin-top: 4px;
`

export const SkeletonProgressBar = styled.span`
  ${skeletonSurface};
  display: block;
  width: 100px;
  height: 8px;
  margin-top: 6px;
  border-radius: ${token.shapes.circle};

  @media (max-width: 768px) {
    grid-column: 1 / -1;
    width: 100%;
  }
`

export const SkeletonStatus = styled.span`
  ${skeletonSurface};
  display: block;
  width: 62px;
  height: 16px;
  margin-top: auto;

  @media (max-width: 768px) {
    grid-column: 1 / -1;
    margin-top: 0;
  }
`

export const SkeletonDiaryContent = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  gap: 16px;
  min-width: 0;
  padding: 16px;
  overflow: hidden;
  border: 2px solid ${token.colors.gray.gray10};
  border-radius: ${token.shapes.small};

  @container learning-week (max-width: 980px) {
    min-height: 0;
    flex-direction: column;
    gap: 14px;
    overflow: hidden;
  }

  @media (max-width: 768px) {
    min-height: 0;
    flex-direction: column;
    gap: 20px;
    padding: 14px;
    overflow: visible;
  }
`

export const SkeletonWeekGrid = styled.div`
  display: flex;
  flex: 1 1 auto;
  flex-flow: column wrap;
  align-content: flex-start;
  height: 100%;
  gap: 10px 16px;

  @container learning-week (max-width: 980px) {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
    width: 100%;
    height: auto;
    gap: 10px 12px;
  }

  @media (max-width: 768px) {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    width: 100%;
    height: auto;
    gap: 10px;
  }
`

export const SkeletonWeek = styled.span`
  ${skeletonSurface};
  display: block;
  width: 130px;
  height: 25px;
  flex: 0 0 25px;

  @container learning-week (max-width: 980px) {
    width: 100%;
    height: 34px;
    flex-basis: auto;
  }

  @media (max-width: 768px) {
    width: 100%;
    height: 40px;
    flex-basis: auto;
  }
`

export const SkeletonButtonContent = styled.div<{ $isMentor: boolean }>`
  display: flex;
  width: ${({ $isMentor }) => ($isMentor ? '200px' : '150px')};
  height: 100%;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;
  margin-left: auto;

  @container learning-week (max-width: 980px) {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    grid-template-areas: 'name week button';
    width: 100%;
    height: auto;
    align-items: center;
    gap: 12px;
    margin-left: 0;
  }

  @media (max-width: 768px) {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    grid-template-areas:
      'name button'
      'week button';
    width: 100%;
    height: auto;
    gap: 6px 12px;
    margin-left: 0;
  }
`

export const SkeletonName = styled.span`
  ${skeletonSurface};
  display: block;
  width: 72px;
  height: 16px;
  @container learning-week (max-width: 980px) { grid-area: name; }
  @media (max-width: 768px) { grid-area: name; }
`

export const SkeletonWeekTitle = styled.span<{ $isMentor: boolean }>`
  ${skeletonSurface};
  display: block;
  width: ${({ $isMentor }) => ($isMentor ? '190px' : '140px')};
  height: 24px;
  @container learning-week (max-width: 980px) { grid-area: week; width: min(100%, 240px); }
  @media (max-width: 768px) { grid-area: week; width: min(100%, 190px); }
`

export const SkeletonWriteButton = styled.span`
  ${skeletonSurface};
  display: block;
  width: 92px;
  height: 27px;
  border-radius: ${token.shapes.xsmall};
  @container learning-week (max-width: 980px) { grid-area: button; }
  @media (max-width: 768px) { grid-area: button; height: 100%; min-height: 48px; }
`

export const Column = styled.div<{ $state: PeriodState }>`
  ${token.flexColumn};
  width: 100%;
  flex: 0 0 auto;
  /* Keep the history in the scroll flow while deferring off-screen layout and paint. */
  content-visibility: auto;
  contain-intrinsic-size: 0 200px;
  container-type: inline-size;
  container-name: learning-week;
  opacity: ${({ $state }) => ($state === 'future' ? 0.35 : 1)};
  transition: opacity 200ms ease;
`;

export const ProgressContent = styled.div`
  ${token.flexColumn};
  width: 100px;
  height: 100%;
  @media (max-width: 768px) {
    display: grid;
    grid-template-columns: 1fr auto;
    width: 100%;
    height: auto;
    gap: 6px 12px;

    > *:nth-child(3) {
      grid-column: 1 / -1;
      width: 100%;
    }
  }
`

export const Month = styled.span`
  ${token.typography('heading', 'md', 'semibold')}
`;

export const MonthRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  @media (max-width: 600px) { align-items: flex-start; gap: 10px; }
`;

export const MonthHeading = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const Now = styled.span`
  ${token.typography('body', 'sm', 'medium')};
  color: ${token.colors.primary.text};
`;

export const TotalStudyButton = styled.button<{
  $hasTotalStudy: boolean
  $isFuture: boolean
}>`
  ${token.typography('caption', 'lg', 'semibold')};
  display: inline-flex;
  align-items: center;
  align-self: flex-end;
  gap: 5px;
  border: 0;
  color: ${({ $hasTotalStudy, $isFuture }) =>
    $isFuture
      ? token.colors.gray.gray50
      : $hasTotalStudy
      ? token.colors.success.success20
      : token.colors.primary.text};
  background: transparent;
  cursor: pointer;
  margin-right: 16px;
  @media (max-width: 600px) { margin-right: 0; text-align: right; }

  svg {
    flex: 0 0 auto;
  }

  &:focus-visible {
    border-radius: ${token.shapes.xsmall};
    outline: 2px solid ${token.colors.primary.primary50};
    outline-offset: 2px;
  }
`;

export const Card = styled.div<{ $state: PeriodState }>`
  background-color: white;
  border: 2px solid
    ${({ $state }) =>
      $state === 'current'
        ? token.colors.primary.primary50
        : token.colors.gray.gray10};
  width: 100%;
  height: 170px;
  border-radius: ${token.shapes.xlarge};
  border-top-left-radius: 0;
  padding: 16px 25px;
  margin-top: 3px;
  display: flex;
  flex-direction: row;
  gap: 30px;
  position: relative;
  @container learning-week (max-width: 980px) {
    height: auto;
    min-height: 0;
    gap: 20px;
    padding: 18px 20px;
  }
  @media (max-width: 768px) { height: auto; min-height: 300px; flex-direction: column; gap: 16px; padding: 18px; }
`;

export const SubmitLabel = styled.span`
  ${token.typography('body', 'sm', 'semibold')};
  color: ${token.colors.gray.gray50};
`;

export const SubmitRate = styled.span`
  ${token.typography('heading', 'md', 'semibold')};
  color: ${token.colors.gray.gray70};
  margin-bottom: 5px;
`;

export const Status = styled.span`
  ${token.typography('caption', 'lg', 'medium')};
  color: ${token.colors.primary.text};
  margin-top: auto;
  @media (max-width: 768px) { margin-top: 0; align-self: end; }
`;

export const DiaryContent = styled.div`
  position: relative;
  overflow: hidden;
  border: 2px solid ${token.colors.gray.gray10};
  flex: 1;
  border-radius: ${token.shapes.small};
  padding: 16px;
  display: flex;
  flex-direction: row;
  @container learning-week (max-width: 980px) {
    min-height: 0;
    flex-direction: column;
    gap: 14px;
  }
  @media (max-width: 768px) {
    min-height: 0;
    flex-direction: column;
    gap: 20px;
    padding: 14px;
    overflow: visible;
  }
`;

export const DecoImg = styled(DecoSvg)`
  position: absolute;
  top: 0;
  right: 170px;
  width: auto;
  height: 100%;
  color: ${({ color }) => color ?? '#CCA700'};
  object-fit: contain;
  pointer-events: none;
  @container learning-week (max-width: 980px) { display: none; }
  @media (max-width: 768px) { display: none; }
`;

export const ButtonContent = styled.div`
  width: 150px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-left: auto;
  align-items: flex-end;
  z-index: 1;
  @container learning-week (max-width: 980px) {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    grid-template-areas: 'name week button';
    width: 100% !important;
    height: auto;
    align-items: center;
    gap: 12px;
    margin-left: 0;
  }
  @media (max-width: 768px) {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    grid-template-areas:
      'name button'
      'week button';
    width: 100% !important;
    height: auto;
    align-items: center;
    align-content: center;
    justify-content: stretch;
    gap: 6px 12px;
    margin-left: 0;
  }
`;

export const Name = styled.span`
  ${token.typography('caption', 'lg', 'semibold')};
  color: ${token.colors.gray.gray70};
  @container learning-week (max-width: 980px) { grid-area: name; }
  @media (max-width: 768px) { grid-area: name; }
`;

export const Week = styled.span`
  ${token.typography('heading', 'md', 'semibold')};
  color: ${token.colors.gray.gray70};
  @container learning-week (max-width: 980px) {
    grid-area: week;
    min-width: 0;
    ${token.typography('body', 'md', 'semibold')};
    text-align: right;
    overflow-wrap: anywhere;
  }
  @media (max-width: 768px) {
    grid-area: week;
    min-width: 0;
    ${token.typography('body', 'md', 'semibold')};
    overflow-wrap: anywhere;
    text-align: left;
    justify-self: start;
  }
`;

export const WriteButton = styled.button`
  ${token.typography('caption', 'lg', 'medium')};
  color: ${token.colors.white};
  background-color: ${token.colors.gray.gray70};
  border-radius: ${token.shapes.xsmall};
  padding: 5px 30px;
  cursor: pointer;

  @container learning-week (max-width: 980px) {
    grid-area: button;
    padding-inline: 20px;
    white-space: nowrap;
  }

  @media (max-width: 768px) {
    grid-area: button;
    align-self: stretch;
    padding-inline: 18px;
    white-space: nowrap;
  }

  &:not(:disabled):hover {
    background-color: ${token.colors.gray.gray80};
  }

  &:disabled {
    background-color: ${token.colors.gray.gray50};
    cursor: not-allowed;
  }
`;

export const DecoImg2 = styled.img`
  position: absolute;
  top: 30px;
  right: 0px;
  @container learning-week (max-width: 980px) { display: none; }
  @media (max-width: 768px) { display: none; }
`;
