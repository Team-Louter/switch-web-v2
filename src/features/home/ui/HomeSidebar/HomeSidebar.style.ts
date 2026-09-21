import styled, { css, keyframes } from 'styled-components';

import { ProfileAvatar } from '@/shared/ui';
import * as token from '@/shared/styles/values/token';

const shimmer = keyframes`
  from { background-position: 100% 0; }
  to { background-position: -100% 0; }
`;

const cardEnter = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const SkeletonSurface = styled.div`
  background: linear-gradient(90deg, #edf0f3 25%, #f7f8f9 37%, #edf0f3 63%);
  background-size: 400% 100%;
  animation: ${shimmer} 1.35s ease-in-out infinite;
`;

// v1 카드의 고정 기준 크기. 홈 캔버스에서 달력과 함께 동일 배율로 축소한다.
export const Sidebar = styled.aside`
  display: flex;
  flex-direction: column;
  gap: 4%;
  width: 360px;
  height: 740px;
  animation: ${cardEnter} 420ms ease-out both;
`;
const Card = styled.section`
  background: #fff;
  border: 1px solid #eee;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgb(0 0 0 / 8%);
`;
export const ProfileCard = styled(Card)`
  height: 35%;
  padding-bottom: 4px;
  flex-shrink: 0;
`;
export const PopularCard = styled(Card)`
  height: 52%;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;
export const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 90%;
  height: 40%;
  margin: 0 auto;
  border-bottom: 2px solid ${token.colors.primary.primary50};
`;
export const Identity = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;
export const SidebarProfileAvatar = styled(ProfileAvatar)<{ $hasBorder: boolean }>`
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
`;
export const AvatarFallback = styled.div`
  display: grid;
  width: 60px;
  height: 60px;
  place-items: center;
  border: 1px solid #e2e4e1;
  border-radius: 50%;
  background: #f3f4f6;
  color: #8b95a1;
  font-size: 1.25rem;
  font-weight: 700;
`;
export const ProfileSkeleton = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;
export const ProfileAvatarSkeleton = styled(SkeletonSurface)`
  width: 60px;
  height: 60px;
  border-radius: 50%;
`;
export const ProfileTextSkeleton = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;
export const ProfileNameSkeleton = styled(SkeletonSurface)`
  width: 74px;
  height: 20px;
  border-radius: 4px;
`;
export const ProfileClassSkeleton = styled(SkeletonSurface)`
  width: 100px;
  height: 14px;
  border-radius: 4px;
`;
export const ProfileTitle = styled.p`
  max-width: 100%;
  margin: 0;
  overflow: hidden;
  color: #ffa20a;
  font-size: 13px;
  font-weight: 600;
  line-height: 1.1;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
export const Name = styled.h3`
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  color: #333;
`;
export const ClassInfo = styled.p`
  font-size: 14px;
  font-weight: 500;
  color: #333;
  white-space: nowrap;
`;
export const ProfileButton = styled.button`
  font-size: 14px;
  font-weight: 700;
  background: #fff;
  border: 1px solid #b8b8b8;
  border-radius: 4px;
  padding: 10px 12px;
  white-space: nowrap;
  transition: transform 160ms ease, box-shadow 160ms ease;

  &:hover { transform: translateY(-1px); box-shadow: 0 2px 4px rgb(0 0 0 / 12%); }
  &:active { transform: translateY(0) scale(.98); }
`;
export const Title = styled.h2`
  font-size: 17px;
  font-weight: 700;
  margin: 20px 20px 10px;
  color: #000;
`;
export const PanelTitle = styled.h2`
  color: #000;
  font-size: 16px;
  font-weight: 700;
`;
export const RankingSection = styled.section`
  flex: 0 0 auto;
  padding: 16px;
`;
export const PostSection = styled.section`
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  min-height: 0;
  padding: 14px 0 14px;
  border-top: 1px solid #eee;

  ${PanelTitle} {
    margin: 0 16px 8px;
  }
`;
export const PanelHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;
export const RankingTabs = styled.div`
  display: flex;
  gap: 4px;
`;
export const RankingTab = styled.button<{ $active: boolean }>`
  height: 22px;
  padding: 0 8px;
  border: 1px solid ${({ $active }) => ($active ? 'transparent' : '#333')};
  border-radius: 12px;
  background: ${({ $active }) => ($active ? token.colors.primary.primary50 : '#fff')};
  color: ${({ $active }) => ($active ? token.colors.primary.foreground : '#333')};
  font-size: 10px;
  font-weight: 500;
  transition: transform 160ms ease, background-color 160ms ease;

  &:hover { transform: translateY(-1px); }
  &:active { transform: translateY(0) scale(.96); }
`;
export const RankingList = styled.ul`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 10px;
`;
export const RankingContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 48px;
  margin-top: 14px;
`;
export const RankingEmpty = styled.p`
  color: #727272;
  font-size: 12px;
`;
export const RankingItem = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #333;
  font-size: 14px;
`;
export const RankingUser = styled.span`
  display: flex;
  align-items: center;
  min-width: 0;
  gap: 4px;
`;
export const MedalIcon = styled.img`
  width: 14px;
  height: 14px;
`;
export const RankNumber = styled.span`
  display: grid;
  width: 14px;
  height: 14px;
  place-items: center;
  color: #777;
  font-size: 11px;
`;
export const RankingSpeed = styled.span`
  flex: 0 0 auto;
  font-size: 14px;
  font-weight: 600;
`;
export const MyRankingBadge = styled.span`
  flex: 0 0 auto;
  padding: 2px 5px;
  border-radius: 4px;
  background: ${token.colors.primary.primary10};
  color: ${token.colors.primary.primary80};
  font-size: 10px;
  font-weight: 700;
  line-height: 1;
`;
export const Post = styled.button`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-evenly;
  width: 90%;
  height: 84px;
  margin: 0 auto 6px;
  padding: 0 16px;
  border-bottom: 2px solid ${token.colors.primary.primary50};
  border-radius: 8px;
  background: #fff;
  text-align: left;
  transition: transform 160ms ease, box-shadow 160ms ease;

  &:hover { transform: translateY(-2px); box-shadow: 0 3px 7px rgb(0 0 0 / 8%); }
  &:active { transform: translateY(0); }
`;
export const PostTitle = styled.span`
  font-size: 16px;
  font-weight: 500;
  color: #333;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
export const Views = styled.span`
  display: flex;
  align-items: center;
  gap: 5px;
  color: #a0a0a0;
  font-size: 13px;
  font-weight: 500;
`;
export const PostStats = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  overflow: visible;
`;
export const Likes = styled(Views)``;
export const HeartIcon = styled.img`
  flex: 0 0 auto;
  width: 13px;
  height: 12px;
  overflow: visible;
`;
export const Message = styled.p`
  padding: 20px;
  color: #727272;
  font-size: 14px;
`;
export const CompactMessage = styled.p`
  padding: 16px;
  color: #727272;
  font-size: 12px;
`;
export const PostSkeleton = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-evenly;
  width: 90%;
  height: 84px;
  margin: 0 auto 6px;
  padding: 0 16px;
  border-radius: 8px;
`;
export const PostTitleSkeleton = styled(SkeletonSurface)`
  width: 58%;
  height: 16px;
  border-radius: 4px;
`;
export const PostStatsSkeleton = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;
export const PostLikeSkeleton = styled(SkeletonSurface)`
  width: 28px;
  height: 13px;
  border-radius: 4px;
`;
export const PostViewsSkeleton = styled(SkeletonSurface)`
  width: 72px;
  height: 13px;
  border-radius: 4px;
`;
export const RankingSkeleton = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  height: 42px;
`;
export const RankingSkeletonLine = styled(SkeletonSurface)`
  width: 100%;
  height: 14px;
  border-radius: 4px;
`;
