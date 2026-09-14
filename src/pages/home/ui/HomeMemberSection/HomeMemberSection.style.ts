import styled, { css, keyframes } from 'styled-components'

import { ProfileAvatar } from '@/shared/ui'

const shimmer = keyframes`
  from { background-position: 100% 0; }
  to { background-position: -100% 0; }
`

const reveal = keyframes`
  from { opacity: 0; transform: translateY(14px); }
  to { opacity: 1; transform: translateY(0); }
`

export const Section = styled.section<{ $visible: boolean }>`
  width: 100%;
  margin: 72px auto 0;
  padding: 64px 0 24px;
  border-top: 1px solid #eee;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transform: translateY(${({ $visible }) => ($visible ? '0' : '20px')});
  transition: opacity 420ms ease-out, transform 420ms ease-out;
`

export const Title = styled.h2`
  margin-bottom: 42px;
  color: #333;
  font-size: 1.625rem;
  font-weight: 700;
  text-align: center;
`

export const FilterList = styled.div`
  display: flex;
  align-items: center;
  width: min(100%, 520px);
  min-height: 40px;
  margin: 0 auto 46px;
  padding: 5px 10px;
  gap: 6px;
  border-radius: 999px;
  background: #fff;
  box-shadow: 0 2px 6px rgb(0 0 0 / 12%);
  overflow-x: auto;
`

export const FilterButton = styled.button<{ $active: boolean }>`
  flex: 0 0 66px;
  height: 28px;
  border: 1px solid ${({ $active }) => ($active ? '#ffd600' : '#eee')};
  border-radius: 999px;
  background: ${({ $active }) => ($active ? '#ffd600' : '#fff')};
  color: #333;
  font-size: .8125rem;
  font-weight: ${({ $active }) => ($active ? 700 : 500)};
  transition: transform 160ms ease, background-color 160ms ease, box-shadow 160ms ease;

  &:hover { transform: translateY(-1px); }
  &:active { transform: translateY(0) scale(.97); }
`

export const MemberList = styled.div<{ $loaded: boolean }>`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: 0 auto;
  overflow-anchor: none;
  animation: ${({ $loaded }) => $loaded && css`${reveal} 360ms ease-out both`};
`

export const LoadMoreTrigger = styled.div`
  width: 100%;
  height: 1px;
`

export const MemberRow = styled.article`
  display: flex;
  align-items: center;
  min-height: 128px;
  padding: 16px 0;
  border-bottom: 2px solid #eee;
`

export const MemberProfileAvatar = styled(ProfileAvatar)<{ $hasBorder: boolean }>`
  ${({ $hasBorder }) => !$hasBorder && css`
    &::after {
      position: absolute;
      z-index: 2;
      inset: 0;
      border: 1px solid #d6d6d6;
      border-radius: 50%;
      content: '';
      pointer-events: none;
    }
  `}
`

export const MemberAvatarFallback = styled.div`
  display: grid;
  width: 96px;
  height: 96px;
  flex: 0 0 auto;
  place-items: center;
  border: 1px solid #d6d6d6;
  border-radius: 50%;
  background: #f3f4f6;
  color: #8b95a1;
  font-size: 2rem;
  font-weight: 700;
`

export const MemberInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  min-height: 96px;
  margin-left: 24px;
`

export const RoleBadge = styled.span<{ $leader: boolean }>`
  display: grid;
  width: 80px;
  height: 23px;
  place-items: center;
  border-radius: 4px;
  background: ${({ $leader }) => ($leader ? '#ffd600' : '#f3f4f6')};
  color: #333;
  font-size: .8125rem;
  font-weight: 500;
`

export const MemberName = styled.h3`
  color: #333;
  font-size: 1.1875rem;
  font-weight: 600;
`

export const SocialLinks = styled.div`
  display: flex;
  gap: 8px;
  color: #536273;
  font-size: 1rem;
`

export const Generation = styled.span`
  color: #99a5b1;
  font-size: .8125rem;
  font-weight: 500;
`

export const GenerationSeparator = styled.span`
  margin: 0 6px;
  color: #c2c8cf;
`

export const GenerationTitle = styled.span`
  color: #ffa20a;
  font-weight: 600;
`

const SkeletonSurface = styled.div`
  background: linear-gradient(90deg, #edf0f3 25%, #f7f8f9 37%, #edf0f3 63%);
  background-size: 400% 100%;
  animation: ${shimmer} 1.35s ease-in-out infinite;
`

export const MemberSkeletonRow = styled.article`
  display: flex;
  align-items: center;
  min-height: 128px;
  padding: 16px 0;
  border-bottom: 2px solid #eee;
`

export const MemberImageSkeleton = styled(SkeletonSurface)`
  width: 96px;
  height: 96px;
  flex: 0 0 auto;
  border-radius: 50%;
`

export const MemberSkeletonInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  min-height: 96px;
  margin-left: 24px;
`

export const SkeletonLine = styled(SkeletonSurface)<{ $width: string; $height: string }>`
  width: ${({ $width }) => $width};
  height: ${({ $height }) => $height};
  border-radius: 5px;
`
