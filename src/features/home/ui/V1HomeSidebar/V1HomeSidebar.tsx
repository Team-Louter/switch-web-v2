import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdOutlineRemoveRedEye } from 'react-icons/md';
import { getHotPosts, getRecentHomePost } from '@/entities/post';
import type { RecentHomePost } from '@/entities/post';
import { useUserStore, formatProfileClassInfo } from '@/entities/profile';
import { getRankingList } from '@/entities/typing';
import type { Ranking, TypingProblemType } from '@/entities/typing';
import medal1stIcon from '../../assets/medal-1st.svg';
import medal2ndIcon from '../../assets/medal-2nd.svg';
import { DEFAULT_TYPING_RANKING_TAB, TYPING_RANKING_TABS } from '../../lib/typingRankingTab';
import * as S from './V1HomeSidebar.style';

export function V1HomeSidebar() {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const [recent, setRecent] = useState<RecentHomePost | null>(null);
  const [popular, setPopular] = useState<RecentHomePost[]>([]);
  const [rankings, setRankings] = useState<Ranking[]>([]);
  const [rankingType, setRankingType] = useState<TypingProblemType>(DEFAULT_TYPING_RANKING_TAB);
  const [recentStatus, setRecentStatus] = useState('불러오는 중입니다.');
  const [popularStatus, setPopularStatus] = useState('불러오는 중입니다.');
  const [rankingStatus, setRankingStatus] = useState('불러오는 중입니다.');
  const [isRecentLoading, setIsRecentLoading] = useState(true);
  const [isPopularLoading, setIsPopularLoading] = useState(true);
  const [isRankingLoading, setIsRankingLoading] = useState(true);

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
            {user.profileImageUrl ? <S.Avatar src={user.profileImageUrl} alt="" /> : <S.AvatarFallback>{user.userName.slice(0, 1)}</S.AvatarFallback>}
            <div>
              <S.Name>{user.userName}</S.Name>
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
            {isRankingLoading ? <S.RankingSkeleton aria-label="랭킹 불러오는 중"><S.RankingSkeletonLine /><S.RankingSkeletonLine /></S.RankingSkeleton> : rankings.length ? (
              <S.RankingList>{rankings.slice(0, 2).map((ranking) => <RankingItem key={ranking.userId} ranking={ranking} />)}</S.RankingList>
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

function RankingItem({ ranking }: { ranking: Ranking }) {
  const medal = ranking.rank === 1 ? medal1stIcon : ranking.rank === 2 ? medal2ndIcon : null;

  return (
    <S.RankingItem>
      <S.RankingUser>
        {medal ? <S.MedalIcon src={medal} alt={`${ranking.rank}위`} /> : <S.RankNumber>{ranking.rank}</S.RankNumber>}
        <span>{ranking.userName}</span>
      </S.RankingUser>
      <S.RankingSpeed>{Math.round(ranking.averageSpeed)}타</S.RankingSpeed>
    </S.RankingItem>
  );
}

function PostItem({ post }: { post: RecentHomePost }) {
  const navigate = useNavigate();
  return (
    <S.Post type="button" onClick={() => navigate(`/community/${post.postId}`)}>
      <S.PostTitle>{post.postTitle}</S.PostTitle>
      <S.Views>
        <MdOutlineRemoveRedEye aria-hidden="true" />
        <span>조회수 {post.viewers.toLocaleString()}</span>
      </S.Views>
    </S.Post>
  );
}

function PostSkeleton({ label }: { label?: string }) {
  return (
    <S.PostSkeleton aria-label={label}>
      <S.PostTitleSkeleton />
      <S.PostViewsSkeleton />
    </S.PostSkeleton>
  );
}
