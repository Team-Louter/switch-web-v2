import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdOutlineRemoveRedEye } from 'react-icons/md';
import { getHotPosts, getRecentHomePost } from '@/entities/post';
import type { Post, RecentHomePost } from '@/entities/post';
import { useUserStore, formatProfileClassInfo } from '@/entities/profile';
import { UserName } from '@/entities/user';
import { getRankingList } from '@/entities/typing';
import type { Ranking, TypingProblemType } from '@/entities/typing';
import { getNameStyleKey } from '@/shared/styles';
import medal1stIcon from '../../assets/medal-1st.svg';
import medal2ndIcon from '../../assets/medal-2nd.svg';
import heartFilledIcon from '../../assets/heart-filled.svg';
import heartOutlineIcon from '../../assets/heart-outline.svg';
import { DEFAULT_TYPING_RANKING_TAB, TYPING_RANKING_TABS } from '../../lib/typingRankingTab';
import * as S from './HomeSidebar.style';

export function HomeSidebar() {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const equippedItems = user?.equippedItems;
  const profileNameColor = equippedItems?.nameColor;
  const profileNameStyleKey = getNameStyleKey(
    profileNameColor?.styleKey ??
      profileNameColor?.valueColor ??
      profileNameColor?.value_color ??
      profileNameColor?.valueText ??
      profileNameColor?.itemName,
  );
  const profileBorder = equippedItems?.border;
  const profileBorderImageUrl = profileBorder?.valueImageUrl ??
    profileBorder?.imageUrl ??
    profileBorder?.itemImageUrl ??
    profileBorder?.originalImageUrl ??
    profileBorder?.previewImageUrl ??
    profileBorder?.thumbnailUrl;
  const hasCustomBorder = Boolean(profileBorderImageUrl?.trim());
  const profileTitle = equippedItems?.title;
  const profileTitleText = profileTitle?.valueText ?? profileTitle?.itemName;
  const [recent, setRecent] = useState<RecentHomePost | null>(null);
  const [popular, setPopular] = useState<Post[]>([]);
  const [rankings, setRankings] = useState<Ranking[]>([]);
  const [myRanking, setMyRanking] = useState<Ranking | null>(null);
  const [rankingType, setRankingType] = useState<TypingProblemType>(DEFAULT_TYPING_RANKING_TAB);
  const [recentStatus, setRecentStatus] = useState('불러오는 중입니다.');
  const [popularStatus, setPopularStatus] = useState('불러오는 중입니다.');
  const [rankingStatus, setRankingStatus] = useState('불러오는 중입니다.');
  const [isRecentLoading, setIsRecentLoading] = useState(true);
  const [isPopularLoading, setIsPopularLoading] = useState(true);
  const [isRankingLoading, setIsRankingLoading] = useState(true);
  const topRankings = rankings.slice(0, 2);
  const isMyRankingInTop = myRanking !== null && topRankings.some((ranking) => ranking.userId === myRanking.userId);

  useEffect(() => {
    let cancelled = false;
    getRecentHomePost()
      .then((post) => {
        if (cancelled) return;
        setRecent(post);
        setRecentStatus('작성한 게시글이 없습니다.');
      })
      .catch(() => {
        if (!cancelled) setRecentStatus('최근 글을 불러오지 못했습니다.');
      })
      .finally(() => {
        if (!cancelled) setIsRecentLoading(false);
      });
    getHotPosts()
      .then((posts) => {
        if (cancelled) return;
        setPopular(posts);
        setPopularStatus('인기글이 없습니다.');
      })
      .catch(() => {
        if (!cancelled) setPopularStatus('인기글을 불러오지 못했습니다.');
      })
      .finally(() => {
        if (!cancelled) setIsPopularLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    getRankingList(rankingType)
      .then((response) => {
        if (cancelled) return;
        setRankings(response.topRankings);
        setMyRanking(response.myRanking);
        setRankingStatus('랭킹이 없습니다.');
      })
      .catch(() => {
        if (!cancelled) setRankingStatus('랭킹을 불러오지 못했습니다.');
      })
      .finally(() => {
        if (!cancelled) setIsRankingLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [rankingType]);

  function handleRankingTypeChange(type: TypingProblemType) {
    if (type === rankingType) return;
    setIsRankingLoading(true);
    setRankingType(type);
  }

  return (
    <S.Sidebar>
      <S.ProfileCard>
        <S.ProfileHeader>
          {user ? <S.Identity>
            {user.profileImageUrl ? <S.SidebarProfileAvatar
              alt={`${user.userName} 프로필`}
              $hasBorder={hasCustomBorder}
              equippedItems={equippedItems}
              imageUrl={user.profileImageUrl}
              size={60}
            /> : <S.AvatarFallback>{user.userName.slice(0, 1)}</S.AvatarFallback>}
            <div>
              {profileTitleText && <S.ProfileTitle>{profileTitleText}</S.ProfileTitle>}
              <S.Name><UserName styleKey={profileNameStyleKey}>{user.userName}</UserName></S.Name>
              <S.ClassInfo>{formatProfileClassInfo(user)}</S.ClassInfo>
            </div>
          </S.Identity> : <S.ProfileSkeleton aria-label="프로필 불러오는 중"><S.ProfileAvatarSkeleton /><S.ProfileTextSkeleton><S.ProfileNameSkeleton /><S.ProfileClassSkeleton /></S.ProfileTextSkeleton></S.ProfileSkeleton>}
          <S.ProfileButton type="button" onClick={() => navigate('/my')}>MY 프로필</S.ProfileButton>
        </S.ProfileHeader>
        <S.Title>내가 최근에 쓴 글</S.Title>
        {isRecentLoading ? <PostSkeleton label="최근 글 불러오는 중" /> : recent ? (
          <PostItem post={recent} />
        ) : (
          <S.Message role="status">{recentStatus}</S.Message>
        )}
      </S.ProfileCard>
      <S.PopularCard>
        <S.RankingSection>
          <S.PanelHeader>
            <S.PanelTitle>타자 랭킹</S.PanelTitle>
            <S.RankingTabs>
              {TYPING_RANKING_TABS.map(({ id, label }) => (
                <S.RankingTab key={id} type="button" $active={rankingType === id} onClick={() => handleRankingTypeChange(id)}>
                  {label}
                </S.RankingTab>
              ))}
            </S.RankingTabs>
          </S.PanelHeader>
          <S.RankingContent>
            {isRankingLoading ? <S.RankingSkeleton aria-label="랭킹 불러오는 중"><S.RankingSkeletonLine /><S.RankingSkeletonLine /></S.RankingSkeleton> : topRankings.length || myRanking || rankingStatus === '랭킹이 없습니다.' ? (
              <S.RankingList>
                {topRankings.map((ranking) => <RankingItem key={ranking.userId} ranking={ranking} isMine={ranking.userId === myRanking?.userId} />)}
                {!isMyRankingInTop && <RankingItem
                  key={myRanking ? `my-ranking-${myRanking.userId}` : 'my-ranking-unranked'}
                  ranking={myRanking}
                  isMine
                  fallbackUserName={user?.userName}
                />}
              </S.RankingList>
            ) : (
              <S.RankingEmpty role="status">{rankingStatus}</S.RankingEmpty>
            )}
          </S.RankingContent>
        </S.RankingSection>
        <S.PostSection>
          <S.PanelTitle>실시간 인기글</S.PanelTitle>
          {isPopularLoading ? <><PostSkeleton label="인기글 불러오는 중" /><PostSkeleton /></> : popular.length ? popular.slice(0, 2).map((post) => <PostItem key={post.postId} post={post} />) : <S.CompactMessage role="status">{popularStatus}</S.CompactMessage>}
        </S.PostSection>
      </S.PopularCard>
    </S.Sidebar>
  );
}

interface RankingItemProps {
  ranking: Ranking | null;
  isMine?: boolean;
  fallbackUserName?: string;
}

function RankingItem({ ranking, isMine = false, fallbackUserName }: RankingItemProps) {
  const medal = ranking?.rank === 1 ? medal1stIcon : ranking?.rank === 2 ? medal2ndIcon : null;
  const userName = ranking?.userName ?? fallbackUserName ?? '나';
  const rank = ranking?.rank ?? '-';
  const averageSpeed = ranking ? Math.round(ranking.averageSpeed) : 0;

  return (
    <S.RankingItem>
      <S.RankingUser>
        {medal ? <S.MedalIcon src={medal} alt={`${rank}위`} /> : <S.RankNumber>{rank}</S.RankNumber>}
        <span>{userName}</span>
        {isMine && <S.MyRankingBadge>내 랭킹</S.MyRankingBadge>}
      </S.RankingUser>
      <S.RankingSpeed>{averageSpeed}타</S.RankingSpeed>
    </S.RankingItem>
  );
}

function PostItem({ post }: { post: RecentHomePost | Post }) {
  const navigate = useNavigate();
  return (
    <S.Post type="button" onClick={() => navigate(`/community/${post.postId}`)}>
      <S.PostTitle>{post.postTitle}</S.PostTitle>
      <S.PostStats>
        <S.Views>
          <MdOutlineRemoveRedEye aria-hidden="true" />
          <span>{post.viewers.toLocaleString()}</span>
        </S.Views>
        <S.Likes>
          <S.HeartIcon src={post.isHearted ? heartFilledIcon : heartOutlineIcon} alt="" />
          <span>{(post.likeCount ?? 0).toLocaleString()}</span>
        </S.Likes>
      </S.PostStats>
    </S.Post>
  );
}

function PostSkeleton({ label }: { label?: string }) {
  return (
    <S.PostSkeleton aria-label={label}>
      <S.PostTitleSkeleton />
      <S.PostStatsSkeleton>
        <S.PostViewsSkeleton />
        <S.PostLikeSkeleton />
      </S.PostStatsSkeleton>
    </S.PostSkeleton>
  );
}
