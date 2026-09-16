import styled, { keyframes } from 'styled-components'

import * as token from '@/shared/styles/values/token'
import { myPagePalette as color } from './myPagePalette'

const shimmer = keyframes`
  0% { background-position: 100% 0; }
  100% { background-position: -100% 0; }
`

export const Page = styled.section`
  ${token.flexColumn}
  align-items: flex-start;
  justify-content: flex-start;
  box-sizing: border-box;
  width: 100%;
  height: 100dvh;
  min-height: 100dvh;
  padding: clamp(20px, 2vw, 30px) clamp(20px, 2vw, 30px)
    clamp(20px, 2vw, 30px) 0;
  overflow: hidden;
  background: ${token.colors.white};
`

export const Content = styled.div`
  ${token.flexColumn}
  flex: 1 1 0;
  width: 100%;
  min-height: 0;
`

export const Card = styled.div`
  ${token.flexColumn}
  flex: 1 1 0;
  min-height: 0;
  box-sizing: border-box;
  width: 100%;
  padding: 16px 0;
  overflow: hidden;
  border: 0.5px solid ${color.lightLine};
  border-radius: 12px;
  background: ${token.colors.white};
  box-shadow: 0 2px 6px rgb(0 0 0 / 8%);
  zoom: 0.9;
`

export const CardTop = styled.section`
  position: relative;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  padding: 48px 64px 32px;
`

export const QuickStats = styled.div`
  position: absolute;
  top: 12px;
  right: 16px;
  display: flex;
  align-items: center;
  gap: 14px;
`

export const QuickStat = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: ${color.coolText};
  line-height: 1;
  white-space: nowrap;
  ${token.typography('caption', 'sm', 'medium')}
`

export const QuickStatIcon = styled.span<{
  $kind: 'point' | 'badge'
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 12px;
  height: 12px;
  color: ${({ $kind }) =>
    $kind === 'point' ? color.gold : color.coolText};

  svg {
    width: 12px;
    height: 12px;
  }
`

export const QuickStatValue = styled.span`
  font-variant-numeric: tabular-nums;
`

export const ProfileGroup = styled.div`
  display: flex;
  align-items: center;
  flex: 0 0 auto;
  gap: 24px;
`

export const ProfileImageWrapper = styled.div<{
  $hasCustomBorder: boolean
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 116px;
  width: 116px;
  height: 116px;
  border: ${({ $hasCustomBorder }) =>
    $hasCustomBorder ? '0' : `4px solid ${color.avatarBorder}`};
  border-radius: ${token.shapes.circle};
  background: ${token.colors.white};
  box-shadow: 0 2px 6px rgb(0 0 0 / 8%);
`

export const ProfileInfo = styled.div`
  ${token.flexColumn}
  align-items: flex-start;
  gap: 8px;
  min-width: 0;
  max-width: 220px;
`

export const ProfileTitle = styled.span`
  max-width: 100%;
  overflow: hidden;
  color: ${color.gold};
  line-height: 1;
  text-overflow: ellipsis;
  white-space: nowrap;
  ${token.typography('caption', 'sm', 'medium')}
`

export const ProfileName = styled.h1`
  margin: 0;
  color: ${color.text};
  line-height: 1;
  ${token.typography('heading', 'lg', 'bold')}
`

export const ProfileSubInfo = styled.span`
  color: ${color.text};
  line-height: 1.2;
  ${token.typography('body', 'sm', 'medium')}
`

export const EditButton = styled.button`
  padding: 5px 14px;
  border: 1px solid ${color.buttonBorder};
  border-radius: 4px;
  color: ${color.text};
  background: ${token.colors.white};
  line-height: 1;
  white-space: nowrap;
  ${token.typography('body', 'sm', 'bold')}

  &:hover {
    background: ${token.colors.gray.gray0};
  }
`

export const StatsGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 40px;
  margin-left: 112px;
`

export const StatItem = styled.div`
  ${token.flexColumn}
  align-items: flex-start;
  gap: 4px;
`

export const StatValue = styled.span`
  color: ${color.text};
  line-height: 1;
  ${token.typography('heading', 'md', 'bold')}
`

export const StatLabel = styled.span`
  min-width: 80px;
  margin-top: 8px;
  color: ${color.text};
  line-height: 1.2;
  white-space: nowrap;
  ${token.typography('body', 'sm', 'medium')}
`

export const ActionGroup = styled.div`
  ${token.flexColumn}
  align-items: flex-end;
  gap: 12px;
  margin-left: auto;
  align-self: flex-end;
  padding-bottom: 4px;
`

export const SocialRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
`

export const SocialLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: ${color.socialText};
  text-decoration: none;
  ${token.typography('body', 'sm', 'semibold')}

  &:hover {
    color: ${color.text};
  }
`

export const SocialIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  img {
    width: 18px;
    height: 18px;
  }
`

export const ButtonRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

export const ActionButton = styled.button<{
  $danger?: boolean
  $variant?: 'admin' | 'mentor'
}>`
  padding: 6px 18px;
  border: ${({ $variant }) =>
    $variant === 'admin' ? 'none' : `1px solid ${color.line}`};
  border-radius: 4px;
  color: ${({ $danger, $variant }) =>
    $variant === 'admin'
      ? color.yellow
      : $danger
        ? color.danger
        : color.mutedText};
  background: ${({ $variant }) =>
    $variant === 'admin' ? '#2D2D2D' : token.colors.white};
  line-height: 1;
  white-space: nowrap;
  ${token.typography('body', 'sm', 'bold')}

  &:hover {
    background: ${({ $danger, $variant }) =>
      $variant === 'admin'
        ? '#1A1A1A'
        : $danger
          ? '#FFF0F0'
          : '#F3F4F6'};
  }
`

export const Divider = styled.hr`
  height: 2px;
  margin: 0 32px;
  border: 0;
  background: ${color.lightLine};
`

export const InfoSection = styled.section`
  ${token.flexColumn}
  gap: 24px;
  padding: 32px 48px 64px;
`

export const InfoRow = styled.div`
  display: flex;
  align-items: center;
`

export const InfoLabel = styled.span`
  margin-right: 16px;
  color: ${color.text};
  line-height: 1.2;
  ${token.typography('body', 'lg', 'medium')}
`

export const InfoValue = styled.span<{ $accent?: boolean }>`
  color: ${({ $accent }) =>
    $accent ? color.gold : color.coolText};
  line-height: 1.2;
  font-weight: ${({ $accent }) => ($accent ? 600 : 400)};
  ${token.typography('heading', 'sm', 'medium')}
`

export const ActivitySection = styled.section`
  ${token.flexColumn}
  flex: 1 1 0;
  min-height: 0;
  width: 100%;
`

export const TabContent = styled.div`
  flex: 1 1 0;
  min-height: 0;
  padding: 8px 32px 32px;
  overflow-y: auto;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`

export const PostList = styled.div`
  ${token.flexColumn}
  width: 100%;
`

export const EmptyMessage = styled.div`
  ${token.flexCenter}
  min-height: 220px;
  color: ${color.coolText};
  text-align: center;
  ${token.typography('body', 'md', 'medium')}
`

export const LoadMoreTrigger = styled.div`
  width: 100%;
  height: 1px;
`

export const SkeletonBlock = styled.span<{
  $height: string
  $width: string
}>`
  display: block;
  flex: 0 0 auto;
  width: ${({ $width }) => $width};
  height: ${({ $height }) => $height};
  border-radius: ${token.shapes.xsmall};
  background: linear-gradient(
    90deg,
    ${token.colors.gray.gray0} 25%,
    ${token.colors.gray.gray10} 50%,
    ${token.colors.gray.gray0} 75%
  );
  background-size: 200% 100%;
  animation: ${shimmer} 1.2s ease-in-out infinite;
`

export const SkeletonCircle = styled.span`
  display: block;
  flex: 0 0 116px;
  width: 116px;
  height: 116px;
  border-radius: ${token.shapes.circle};
  background: linear-gradient(
    90deg,
    ${token.colors.gray.gray0} 25%,
    ${token.colors.gray.gray10} 50%,
    ${token.colors.gray.gray0} 75%
  );
  background-size: 200% 100%;
  animation: ${shimmer} 1.2s ease-in-out infinite;
`

export const SkeletonPostItem = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  box-sizing: border-box;
  min-height: 56px;
  padding: 15px 28px;
  border-bottom: 1px solid ${color.line};
`

export const SkeletonMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-left: auto;
`
