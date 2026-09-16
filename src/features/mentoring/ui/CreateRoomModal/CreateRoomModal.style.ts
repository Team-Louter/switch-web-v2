import styled, { css, keyframes } from 'styled-components'

import * as token from '@/shared/styles/values/token'

const backdropEnter = keyframes`
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
`

const contentEnter = keyframes`
  from {
    opacity: 0;
    transform: translateY(12px) scale(0.98);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`

const spinner = keyframes`
  to {
    transform: rotate(360deg);
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

export const Overlay = styled.div`
  ${token.flexCenter}
  position: fixed;
  inset: 0;
  z-index: 1000;
  box-sizing: border-box;
  overflow-y: auto;
  padding: 12px;
  background-color: rgb(0 0 0 / 40%);

  animation: ${backdropEnter} 180ms ease-out both;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`

export const Container = styled.div`
  ${token.flexColumn}
  width: min(100%, 37.5rem);
  height: min(90dvh, 46.875rem);
  min-height: min(32rem, 90dvh);
  box-sizing: border-box;
  gap: clamp(16px, 2vw, 20px);
  overflow: hidden;
  padding: clamp(16px, 3vw, 30px);
  border-radius: ${token.shapes.xlarge};
  background-color: ${token.colors.white};
  box-shadow: 0 16px 48px rgb(0 0 0 / 20%);

  animation: ${contentEnter} 220ms cubic-bezier(0.22, 1, 0.36, 1) both;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }

  @media (max-width: 40rem) {
    width: calc(100vw - 24px);
    height: calc(100dvh - 24px);
    min-height: 0;
  }
`

export const Header = styled.div`
  display: grid;
  grid-template-columns: 20px minmax(0, 1fr) 20px;
  align-items: center;
  width: 100%;
  flex-shrink: 0;
`

export const HeaderSpacer = styled.span`
  width: 20px;
  height: 20px;
`

export const Title = styled.h2`
  ${token.typography('body', 'lg', 'semibold')}
  margin: 0;
  color: ${token.colors.gray.gray100};
  text-align: center;
`

export const CloseButton = styled.button`
  ${token.flexCenter}
  width: 20px;
  height: 20px;
  padding: 0;
  border: 0;
  background: transparent;
  color: ${token.colors.gray.gray60};
  cursor: pointer;

  svg {
    width: 20px;
    height: 20px;
  }

  &:hover {
    color: ${token.colors.gray.gray100};
  }
`

export const RoomName = styled.input`
  ${token.typography('body', 'sm', 'regular')}
  width: 100%;
  min-height: 48px;
  box-sizing: border-box;
  padding: 14px 20px;
  border: 1px solid ${token.colors.gray.gray20};
  border-radius: ${token.shapes.medium};
  background-color: ${token.colors.white};
  color: ${token.colors.gray.gray90};

  &::placeholder {
    color: ${token.colors.gray.gray40};
  }

  &:focus {
    outline: 2px solid ${token.colors.primary.primary50};
    outline-offset: -1px;
  }
`

export const MemberList = styled.div`
  ${token.flexColumn}
  width: 100%;
  min-height: 0;
  flex: 1 1 auto;
  overflow: hidden;
  border: 1px solid ${token.colors.gray.gray20};
  border-radius: ${token.shapes.medium};
  background-color: ${token.colors.white};
`

export const SearchField = styled.div`
  ${token.flexRow}
  align-items: center;
  width: 100%;
  min-height: 48px;
  box-sizing: border-box;
  gap: 8px;
  padding: 8px 16px;
  border-bottom: 1px solid ${token.colors.gray.gray10};
  color: ${token.colors.gray.gray50};

  svg {
    width: 18px;
    height: 18px;
    flex-shrink: 0;
  }
`

export const SearchInput = styled.input`
  ${token.typography('body', 'sm', 'regular')}
  width: 100%;
  min-width: 0;
  padding: 4px 0;
  border: 0;
  background-color: transparent;
  color: ${token.colors.gray.gray80};

  &::placeholder {
    color: ${token.colors.gray.gray40};
  }

  &:focus {
    outline: none;
  }
`

export const ClearSearchButton = styled.button`
  ${token.flexCenter}
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  padding: 0;
  border: 0;
  background: transparent;
  color: ${token.colors.gray.gray50};
  cursor: pointer;

  svg {
    width: 16px;
    height: 16px;
  }
`

export const MemberListBody = styled.div`
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
`

export const MemberSkeletonList = styled.div`
  ${token.flexColumn}
  width: 100%;
`

export const MemberSkeletonRow = styled.div`
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto auto;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  min-height: 64px;
  gap: 12px;
  padding: 10px 16px;
  border-top: 1px solid ${token.colors.gray.gray10};
`

export const MemberSkeletonAvatar = styled.span`
  ${skeletonSurface}
  display: block;
  width: 40px;
  height: 40px;
  border-radius: ${token.shapes.circle};
`

export const MemberSkeletonInfo = styled.span`
  ${token.flexColumn}
  min-width: 0;
  gap: 6px;
`

export const MemberSkeletonLabel = styled.span`
  ${skeletonSurface}
  display: block;
  width: 72px;
  height: 14px;
`

export const MemberSkeletonMeta = styled.span`
  ${skeletonSurface}
  display: block;
  width: 112px;
  height: 11px;
`

export const MemberSkeletonRole = styled.span`
  ${skeletonSurface}
  display: block;
  width: 76px;
  height: 12px;

  @media (max-width: 36rem) {
    display: none;
  }
`

export const MemberSkeletonAction = styled.span`
  ${skeletonSurface}
  display: block;
  width: 22px;
  height: 22px;
  border-radius: ${token.shapes.xsmall};
`

export const GradeGroup = styled.div`
  width: 100%;
  border-bottom: 1px solid ${token.colors.gray.gray10};
`

export const GradeRow = styled.div`
  ${token.flexBetween}
  width: 100%;
  min-height: 48px;
  box-sizing: border-box;
  gap: 12px;
  padding: 10px 16px;
  background-color: ${token.colors.white};
`

export const GradeLabel = styled.button`
  ${token.typography('body', 'md', 'semibold')}
  ${token.flexLeft}
  flex: 1 1 auto;
  min-width: 0;
  padding: 0;
  border: 0;
  background: transparent;
  color: ${token.colors.gray.gray80};
  text-align: left;
  cursor: pointer;
`

export const GradeActions = styled.div`
  ${token.flexRow}
  align-items: center;
  flex-shrink: 0;
  gap: 12px;
`

export const CaretButton = styled.button`
  ${token.flexCenter}
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  padding: 0;
  border: 0;
  background: transparent;
  color: ${token.colors.gray.gray50};
  cursor: pointer;

  svg {
    width: 18px;
    height: 18px;
  }
`

export const MemberRow = styled.div`
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto auto;
  align-items: center;
  width: 100%;
  box-sizing: border-box;
  gap: 12px;
  padding: 10px 16px;
  border-top: 1px solid ${token.colors.gray.gray10};
  background-color: ${token.colors.white};
`

export const MemberInfo = styled.div`
  ${token.flexColumn}
  min-width: 0;
  gap: 2px;
`

export const MemberName = styled.span`
  ${token.typography('body', 'sm', 'semibold')}
  overflow: hidden;
  color: ${token.colors.gray.gray80};
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const MemberMeta = styled.span`
  ${token.typography('caption', 'sm', 'regular')}
  overflow-wrap: anywhere;
  color: ${token.colors.gray.gray50};
`

export const RoleText = styled.span`
  ${token.typography('caption', 'sm', 'regular')}
  flex-shrink: 0;
  color: ${token.colors.gray.gray50};
  white-space: nowrap;

  @media (max-width: 36rem) {
    display: none;
  }
`

export const CheckBox = styled.button<{ $isChecked: boolean }>`
  ${token.flexCenter}
  width: 22px;
  height: 22px;
  flex-shrink: 0;
  padding: 0;
  border: ${({ $isChecked }) =>
    $isChecked ? '0' : `1.5px solid ${token.colors.gray.gray20}`};
  border-radius: ${token.shapes.xsmall};
  background-color: ${({ $isChecked }) =>
    $isChecked ? token.colors.primary.primary50 : 'transparent'};
  color: ${token.colors.gray.gray100};
  cursor: pointer;

  svg {
    width: 18px;
    height: 18px;
  }
`

export const SelectionRow = styled.div`
  ${token.flexBetween}
  width: 100%;
  box-sizing: border-box;
  flex-shrink: 0;
  gap: 12px;
  padding: 10px 16px;
  border-top: 1px solid ${token.colors.gray.gray10};
  background-color: ${token.colors.gray.gray0};
`

export const SelectionCount = styled.span`
  ${token.typography('caption', 'md', 'regular')}
  color: ${token.colors.gray.gray60};
`

export const ClearButton = styled.button`
  ${token.typography('caption', 'md', 'regular')}
  padding: 0;
  border: 0;
  background: transparent;
  color: ${token.colors.gray.gray60};
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`

export const EmptyText = styled.p`
  ${token.typography('body', 'sm', 'regular')}
  width: 100%;
  box-sizing: border-box;
  margin: 0;
  padding: 24px 16px;
  color: ${token.colors.gray.gray50};
  text-align: center;
`

export const DoneButton = styled.button`
  ${token.flexCenter}
  ${token.typography('body', 'sm', 'semibold')}
  width: 100%;
  min-height: 44px;
  box-sizing: border-box;
  gap: 8px;
  padding: 10px 20px;
  border: 0;
  border-radius: ${token.shapes.medium};
  background-color: ${token.colors.gray.gray100};
  color: ${token.colors.white};
  cursor: pointer;
  transition: background-color 120ms ease, opacity 120ms ease;

  &:hover:not(:disabled) {
    background-color: ${token.colors.gray.gray80};
  }

  &:disabled {
    background-color: ${token.colors.gray.gray20};
    color: ${token.colors.gray.gray50};
    cursor: not-allowed;
  }
`

export const SubmitSpinner = styled.span`
  display: inline-flex;
  width: 16px;
  height: 16px;
  align-items: center;
  justify-content: center;
  animation: ${spinner} 700ms linear infinite;

  svg {
    width: 16px;
    height: 16px;
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`
