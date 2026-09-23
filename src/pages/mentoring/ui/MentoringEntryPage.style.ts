import styled, { css, keyframes } from 'styled-components'

import * as token from '@/shared/styles/values/token'

export const Page = styled.section`
  box-sizing: border-box;
  width: 100%;
  min-height: 100dvh;
  padding: clamp(20px, 2vw, 30px) clamp(20px, 2vw, 30px)
    clamp(20px, 2vw, 30px) 0;
  overflow-y: auto;
  background: ${token.colors.white};
`

export const Container = styled.div`
  display: grid;
  grid-template-columns: minmax(260px, 320px) minmax(0, 1fr);
  gap: 20px;
  width: 100%;
  height: calc(100dvh - clamp(40px, 4vw, 60px));
  min-height: 640px;
  margin: 0 auto;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    height: auto;
    min-height: 0;
  }
`

export const LeftArea = styled.div`
  ${token.flexColumn}
  box-sizing: border-box;
  min-width: 0;
  min-height: 0;
  gap: 0;
  padding: 0;
  overflow: hidden;
  border: 1px solid ${token.colors.gray.gray10};
  border-radius: ${token.shapes.xlarge};
  background: ${token.colors.gray.gray0};
  ${token.elevation('black_1')}

  @media (max-width: 900px) {
    min-height: 560px;
  }
`

const ListContainer = styled.section`
  ${token.flexColumnStart}
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  min-height: 0;
  gap: 12px;
  padding: 20px 16px;
  overflow: hidden;
`

export const RoomContainer = styled(ListContainer)`
  flex: 1 1 0;
`

export const QuestionContainer = styled(ListContainer)`
  flex: 1 1 0;
  border-top: 1px solid ${token.colors.gray.gray10};

  @media (max-width: 900px) {
    min-height: 300px;
  }
`

export const SectionHeader = styled.div`
  ${token.flexBetween}
  width: 100%;
  min-height: 32px;
  flex-shrink: 0;
`

export const SectionHeading = styled.div`
  ${token.flexRow}
  align-items: center;
  gap: 7px;
  min-width: 0;
`

export const SectionTitle = styled.h2`
  margin: 0;
  color: ${token.colors.gray.gray90};
  line-height: 1;
  ${token.typography('body', 'md', 'semibold')}
`

export const SectionCount = styled.span`
  ${token.flexCenter}
  min-width: 22px;
  height: 22px;
  padding: 0 7px;
  border-radius: ${token.shapes.circle};
  background: ${token.colors.white};
  color: ${token.colors.gray.gray50};
  line-height: 1;
  ${token.typography('caption', 'md', 'semibold')}
`

export const AddButton = styled.button`
  ${token.flexCenter}
  box-sizing: border-box;
  height: 32px;
  gap: 5px;
  padding: 0 10px;
  border: 0;
  border-radius: ${token.shapes.small};
  background: ${token.colors.gray.gray90};
  color: ${token.colors.white};
  cursor: pointer;
  ${token.typography('caption', 'lg', 'semibold')}

  svg {
    width: 16px;
    height: 16px;
  }

  &:hover,
  &:focus-visible {
    background: ${token.colors.gray.gray100};
  }

  &:focus-visible {
    outline: 2px solid ${token.colors.primary.primary30};
    outline-offset: 2px;
  }
`

export const DashboardButton = styled.button`
  display: flex;
  box-sizing: border-box;
  align-items: center;
  justify-content: space-between;
  flex: 0 0 auto;
  width: 100%;
  min-height: 44px;
  gap: 12px;
  padding: 0 14px;
  border: 0;
  border-radius: ${token.shapes.small};
  background: ${token.colors.primary.primary50};
  color: ${token.colors.gray.gray100};
  cursor: pointer;
  ${token.typography('body', 'sm', 'semibold')}
  transition: background-color 120ms ease;

  svg {
    flex: 0 0 auto;
    width: 16px;
    height: 16px;
  }

  &:hover {
    background: ${token.colors.primary.primary60};
  }

  &:focus-visible {
    outline: 2px solid ${token.colors.primary.primary30};
    outline-offset: 2px;
  }
`

const skeletonShimmer = keyframes`
  from {
    background-position: 100% 0;
  }

  to {
    background-position: -100% 0;
  }
`

const skeletonSurface = css`
  border-radius: ${token.shapes.xsmall};
  background: linear-gradient(
    90deg,
    ${token.colors.gray.gray0} 20%,
    ${token.colors.gray.gray10} 50%,
    ${token.colors.gray.gray0} 80%
  );
  background-size: 200% 100%;
  animation: ${skeletonShimmer} 1.4s ease-in-out infinite;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`

export const SkeletonCount = styled.span`
  ${skeletonSurface}
  display: block;
  width: 22px;
  height: 22px;
  border-radius: ${token.shapes.circle};
`

export const SkeletonAction = styled.span`
  ${skeletonSurface}
  display: block;
  width: 74px;
  height: 32px;
  border-radius: ${token.shapes.small};
`

export const SkeletonList = styled.div`
  ${token.flexColumnStart}
  width: 100%;
  gap: 3px;
`

export const SkeletonRoomItem = styled.div`
  ${token.flexRow}
  box-sizing: border-box;
  align-items: center;
  width: 100%;
  min-height: 54px;
  gap: 10px;
  padding: 9px 10px 9px 12px;
`

export const SkeletonRoomAvatar = styled.span`
  ${skeletonSurface}
  display: block;
  flex: 0 0 35px;
  width: 35px;
  height: 35px;
  border-radius: ${token.shapes.circle};
`

export const SkeletonRoomName = styled.span`
  ${skeletonSurface}
  display: block;
  width: min(150px, 60%);
  height: 15px;
`

export const SkeletonMenu = styled.span`
  ${skeletonSurface}
  display: block;
  flex: 0 0 20px;
  width: 20px;
  height: 24px;
  margin-left: auto;
`

export const SkeletonQuestionItem = styled.div`
  ${token.flexRow}
  box-sizing: border-box;
  align-items: flex-start;
  width: 100%;
  min-height: 72px;
  gap: 10px;
  padding: 11px 10px 11px 12px;
`

export const SkeletonQuestionBody = styled.div`
  ${token.flexColumnStart}
  flex: 1 1 auto;
  min-width: 0;
  gap: 9px;
`

export const SkeletonQuestionTitle = styled.span`
  ${skeletonSurface}
  display: block;
  width: min(190px, 85%);
  height: 16px;
`

export const SkeletonQuestionMeta = styled.div`
  ${token.flexRow}
  align-items: center;
  width: 100%;
  gap: 8px;
`

export const SkeletonQuestionStatus = styled.span`
  ${skeletonSurface}
  display: block;
  width: 48px;
  height: 12px;
`

export const SkeletonQuestionDate = styled.span`
  ${skeletonSurface}
  display: block;
  width: 84px;
  height: 11px;
`

export const SkeletonDetail = styled.div`
  ${token.flexColumnStart}
  width: 100%;
  height: 100%;
  min-height: 0;
  flex: 1 1 0;
`

export const SkeletonDetailHeader = styled.div`
  ${token.flexColumnStart}
  width: 100%;
  gap: 8px;
  padding-bottom: 16px;
  border-bottom: 1px solid ${token.colors.gray.gray10};
`

export const SkeletonStatus = styled.span`
  ${skeletonSurface}
  display: block;
  width: 64px;
  height: 16px;
`

export const SkeletonQuestionInfo = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  grid-template-rows: auto auto;
  column-gap: 12px;
  row-gap: 4px;
  width: 100%;
  min-width: 0;
`

export const SkeletonRoomLabel = styled.span`
  ${skeletonSurface}
  display: block;
  grid-column: 1;
  grid-row: 1;
  width: 128px;
  height: 12px;
`

export const SkeletonDetailTitle = styled.span`
  ${skeletonSurface}
  display: block;
  grid-column: 1;
  grid-row: 2;
  width: min(190px, 80%);
  height: 23px;
`

export const SkeletonDetailAction = styled.span`
  ${skeletonSurface}
  display: block;
  grid-column: 2;
  grid-row: 1 / span 2;
  align-self: center;
  width: 64px;
  height: 32px;
  border-radius: ${token.shapes.small};
`

export const SkeletonCreatedAt = styled.span`
  ${skeletonSurface}
  display: block;
  width: 220px;
  height: 12px;
  margin: 12px 0 16px;
`

export const SkeletonChat = styled.div`
  ${token.flexColumn}
  width: 100%;
  min-height: 0;
  flex: 1 1 0;
  justify-content: space-between;
  padding: 0 4px;
`

export const SkeletonMessageList = styled.div`
  ${token.flexColumnStart}
  width: 100%;
  flex: 1 1 0;
  gap: 16px;
`

export const SkeletonMessageGroup = styled.div`
  ${token.flexRow}
  align-items: flex-start;
  width: 100%;
  gap: 6px;
`

export const SkeletonMessageAvatar = styled.span`
  ${skeletonSurface}
  display: block;
  flex: 0 0 32px;
  width: 32px;
  height: 32px;
  border-radius: ${token.shapes.circle};
`

export const SkeletonMessageBody = styled.div`
  ${token.flexColumnStart}
  gap: 6px;
`

export const SkeletonSenderName = styled.span`
  ${skeletonSurface}
  display: block;
  width: 52px;
  height: 14px;
`

export const SkeletonBubble = styled.span<{ $width: string }>`
  ${skeletonSurface}
  display: block;
  width: ${({ $width }) => $width};
  height: 40px;
  border-radius: ${token.shapes.medium};
`

export const SkeletonMessageTime = styled.span`
  ${skeletonSurface}
  display: block;
  width: 80px;
  height: 11px;
`

export const SkeletonComposer = styled.div`
  box-sizing: border-box;
  width: 100%;
  height: 84px;
  flex-shrink: 0;
  margin-top: 16px;
  overflow: hidden;
  border: 1px solid ${token.colors.gray.gray20};
  border-radius: ${token.shapes.medium};
  background: ${token.colors.white};
`

export const SkeletonComposerField = styled.span`
  ${skeletonSurface}
  display: block;
  width: 120px;
  height: 14px;
  margin: 14px 16px;
`

export const SkeletonComposerToolbar = styled.div`
  ${token.flexBetween}
  height: 35px;
  padding: 0 12px;
  border-top: 1px solid ${token.colors.gray.gray10};
`

export const SkeletonComposerTools = styled.div`
  ${token.flexRow}
  gap: 4px;
`

export const SkeletonTool = styled.span`
  ${skeletonSurface}
  display: block;
  width: 24px;
  height: 24px;
  border-radius: ${token.shapes.small};
`

export const SkeletonComposerCount = styled.span`
  ${skeletonSurface}
  display: block;
  width: 38px;
  height: 12px;
`

export const ListScroll = styled.div<{ $flushToEnd?: boolean }>`
  box-sizing: border-box;
  width: ${({ $flushToEnd }) =>
    $flushToEnd ? 'calc(100% + 16px)' : '100%'};
  min-height: 0;
  flex: 1 1 0;
  margin-right: ${({ $flushToEnd }) => ($flushToEnd ? '-16px' : '0')};
  padding-right: ${({ $flushToEnd }) => ($flushToEnd ? '16px' : '0')};
  overflow-y: auto;
  overscroll-behavior: contain;
  scrollbar-color: ${token.colors.gray.gray30} transparent;
  scrollbar-width: thin;

  &::-webkit-scrollbar {
    width: 8px;
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
`

export const RightContainer = styled.section`
  ${token.flexColumn}
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  min-height: 0;
  gap: 16px;
  padding: 20px 24px 24px;
  overflow: hidden;
  border: 1px solid ${token.colors.gray.gray10};
  border-radius: ${token.shapes.xlarge};
  background: ${token.colors.white};
  ${token.elevation('black_1')}

  @media (max-width: 900px) {
    min-height: 620px;
  }
`

export const DetailWrapper = styled.div`
  ${token.flexColumn}
  width: 100%;
  min-height: 0;
  flex: 1 1 0;
  overflow: hidden;
`

export const DetailEmpty = styled.div`
  ${token.flexCenter}
  flex: 1 1 0;
  width: 100%;
  min-height: 180px;
  color: ${token.colors.gray.gray50};
  text-align: center;
  ${token.typography('body', 'sm', 'medium')}
`
