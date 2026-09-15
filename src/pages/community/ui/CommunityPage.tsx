import {
  type KeyboardEvent,
  type SyntheticEvent,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';
import { PiNoteBlank, PiPencilSimpleLineBold } from 'react-icons/pi';
import { useNavigate } from 'react-router-dom';

import { getMember } from '@/entities/member';
import {
  formatCommunityCount,
  formatCommunityListRecentDate,
  getPostCategoryLabel,
  getPosts,
  POST_CATEGORY_OPTIONS,
  resolveCommunityAssetUrl,
  type PostCategory,
  type PostResponse,
} from '@/entities/community';
import fallbackProfileImage from '@/shared/assets/sidebar/profile.png';
import eyeIcon from '@/shared/assets/my/eye-icon.svg';
import { getNameStyleKey } from '@/shared/styles';
import { Button } from '@/shared/ui';
import type { ProfileAvatarEquippedItems } from '@/shared/ui';

import commentOutlineIcon from '../assets/svg/comment-outline.svg';
import heartColoredIcon from '../assets/svg/heart-colored.svg';
import heartOutlineIcon from '../assets/svg/heart-outline.svg';
import fileAttachmentIcon from '../assets/svg/file-attachment.svg';
import imageAttachmentIcon from '../assets/svg/image-attachment.svg';
import pinIcon from '../assets/svg/pin-solid.svg';
import {
  Author,
  AuthorImage,
  AuthorName,
  CategoryCell,
  CategoryTab,
  CategoryTabs,
  Content,
  Date,
  EmptyDescription,
  EmptyIcon,
  EmptyState,
  EmptyTitle,
  Header,
  ImageAttachmentIcon,
  Page,
  PageButton,
  Pagination,
  PinnedIcon,
  PostCategory as PostCategoryBadge,
  PostList,
  PostRow,
  PostTitle,
  PostTitleText,
  SkeletonAuthor,
  SkeletonCategory,
  SkeletonDate,
  SkeletonRow,
  SkeletonStats,
  SkeletonTitle,
  Stat,
  StatIcon,
  StatValue,
  Stats,
  StatusMessage,
  StatusState,
  TabActionRow,
  WriteButton,
} from './CommunityPage.style';

interface CategoryTabItem {
  value: PostCategory | null;
  label: string;
}

const CATEGORY_TABS: readonly CategoryTabItem[] = [
  { value: null, label: '전체글' },
  ...POST_CATEGORY_OPTIONS,
];

const MAX_VISIBLE_PAGE_COUNT = 5;
const SKELETON_ROW_COUNT = 16;
const RELATIVE_TIME_REFRESH_INTERVAL_MS = 30_000;

export function CommunityPage() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<PostCategory | null>(
    null,
  );
  const [currentPage, setCurrentPage] = useState(0);
  const [posts, setPosts] = useState<PostResponse[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [currentTime, setCurrentTime] = useState(globalThis.Date.now);
  const [memberEquippedItems, setMemberEquippedItems] = useState<
    Record<number, ProfileAvatarEquippedItems>
  >({});

  const firstVisiblePage = Math.min(
    Math.max(currentPage - Math.floor(MAX_VISIBLE_PAGE_COUNT / 2), 0),
    Math.max(totalPages - MAX_VISIBLE_PAGE_COUNT, 0),
  );
  const visiblePages = Array.from(
    { length: Math.min(totalPages, MAX_VISIBLE_PAGE_COUNT) },
    (_, index) => firstVisiblePage + index,
  );

  const handleCategorySelect = (category: PostCategory | null) => {
    setSelectedCategory(category);
    setCurrentPage(0);
  };

  const handleWritePost = () => {
    navigate('/community/write');
  };

  const handlePostSelect = (postId: number) => {
    navigate(`/community/${postId}`, { viewTransition: true });
  };

  const handlePostKeyDown = (
    event: KeyboardEvent<HTMLElement>,
    postId: number,
  ) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handlePostSelect(postId);
    }
  };

  const handleProfileImageError = (event: SyntheticEvent<HTMLImageElement>) => {
    event.currentTarget.onerror = null;
    event.currentTarget.src = fallbackProfileImage;
  };

  const handleRetry = () => {
    setReloadKey((currentKey) => currentKey + 1);
  };

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const refreshIntervalId = window.setInterval(
      () => setCurrentTime(globalThis.Date.now()),
      RELATIVE_TIME_REFRESH_INTERVAL_MS,
    );

    return () => {
      window.clearInterval(refreshIntervalId);
    };
  }, []);

  useEffect(() => {
    let isCancelled = false;

    getMember()
      .then((members) => {
        if (isCancelled) {
          return;
        }

        const nextMemberEquippedItems: Record<
          number,
          ProfileAvatarEquippedItems
        > = {};

        members.forEach((member) => {
          if (member.equippedItems) {
            nextMemberEquippedItems[member.userId] = member.equippedItems;
          }
        });

        setMemberEquippedItems(nextMemberEquippedItems);
      })
      .catch(() => {
        // 프로필 효과 조회 실패 시 게시글 목록은 기본 프로필로 표시한다.
      });

    return () => {
      isCancelled = true;
    };
  }, []);

  useEffect(() => {
    let isCancelled = false;

    async function loadPosts() {
      setIsLoading(true);
      setLoadError(null);

      try {
        const [response, pinnedResponse] = await Promise.all([
          getPosts({
            category: selectedCategory ?? undefined,
            page: currentPage,
          }),
          getPosts({ page: 0 }),
        ]);

        if (!isCancelled) {
          const pinnedPosts = pinnedResponse.content.filter(
            (post) => post.pinned,
          );
          const categoryPosts = response.content.filter((post) => !post.pinned);

          setPosts([...pinnedPosts, ...categoryPosts]);
          setTotalPages(response.totalPages);
        }
      } catch {
        if (!isCancelled) {
          setPosts([]);
          setTotalPages(0);
          setLoadError('게시글을 불러오지 못했습니다.');
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadPosts();

    return () => {
      isCancelled = true;
    };
  }, [currentPage, reloadKey, selectedCategory]);

  return (
    <Page>
      <Content>
        <Header>
          <TabActionRow>
            <CategoryTabs role="tablist" aria-label="게시글 카테고리">
              {CATEGORY_TABS.map((category) => (
                <CategoryTab
                  key={category.label}
                  type="button"
                  role="tab"
                  aria-selected={selectedCategory === category.value}
                  $active={selectedCategory === category.value}
                  onClick={() => handleCategorySelect(category.value)}
                >
                  {category.label}
                </CategoryTab>
              ))}
            </CategoryTabs>
            <WriteButton size="sm" onClick={handleWritePost}>
              <PiPencilSimpleLineBold size={16} aria-hidden="true" />
              글쓰기
            </WriteButton>
          </TabActionRow>
        </Header>

        <PostList aria-label="게시글 목록" aria-busy={isLoading}>
          {isLoading && (
            <div role="status" aria-label="게시글을 불러오는 중입니다.">
              {Array.from({ length: SKELETON_ROW_COUNT }, (_, index) => (
                <SkeletonRow key={index} aria-hidden="true">
                  <SkeletonCategory />
                  <SkeletonTitle />
                  <SkeletonAuthor />
                  <SkeletonDate />
                  <SkeletonStats />
                </SkeletonRow>
              ))}
            </div>
          )}

          {!isLoading && loadError && (
            <StatusState role="alert">
              <StatusMessage>{loadError}</StatusMessage>
              <Button size="sm" variant="neutral" onClick={handleRetry}>
                다시 시도
              </Button>
            </StatusState>
          )}

          {!isLoading && !loadError && posts.length === 0 && (
            <EmptyState>
              <EmptyIcon>
                <PiNoteBlank size={18} aria-hidden="true" />
              </EmptyIcon>
              <EmptyTitle>등록된 게시글이 없습니다.</EmptyTitle>
              <EmptyDescription>첫 게시글을 작성해 보세요.</EmptyDescription>
            </EmptyState>
          )}

          {!isLoading &&
            !loadError &&
            posts.map((post) => {
              const authorImage =
                resolveCommunityAssetUrl(post.userProfileImageUrl) ??
                fallbackProfileImage;
              const equippedItems = post.isAnonymous
                ? undefined
                : post.equippedItems ?? memberEquippedItems[post.userId];
              const profileNameColor = equippedItems?.nameColor;
              const profileNameStyleKey = getNameStyleKey(
                profileNameColor?.styleKey ??
                  profileNameColor?.valueColor ??
                  profileNameColor?.value_color ??
                  profileNameColor?.valueText ??
                  profileNameColor?.itemName,
              );
              const profileBorder = equippedItems?.border;
              const profileBorderImageUrl =
                profileBorder?.valueImageUrl ??
                profileBorder?.imageUrl ??
                profileBorder?.itemImageUrl ??
                profileBorder?.originalImageUrl ??
                profileBorder?.previewImageUrl ??
                profileBorder?.thumbnailUrl;
              const hasCustomBorder = Boolean(profileBorderImageUrl?.trim());
              const hasImageAttachment = post.files?.some((file) =>
                file.fileType.startsWith('image/'),
              );
              const hasFileAttachment = post.files?.some(
                (file) => !file.fileType.startsWith('image/'),
              );

              return (
                <PostRow
                  key={post.postId}
                  role="link"
                  tabIndex={0}
                  onClick={() => handlePostSelect(post.postId)}
                  onKeyDown={(event) => handlePostKeyDown(event, post.postId)}
                >
                  <CategoryCell>
                    <PostCategoryBadge>
                      {getPostCategoryLabel(post.category)}
                    </PostCategoryBadge>
                  </CategoryCell>
                  {post.pinned && (
                    <PinnedIcon src={pinIcon} alt="고정된 게시글" />
                  )}
                  <PostTitle $pinned={post.pinned}>
                    <PostTitleText>{post.postTitle}</PostTitleText>
                    {hasImageAttachment && (
                      <ImageAttachmentIcon src={imageAttachmentIcon} alt="" />
                    )}
                    {hasFileAttachment && (
                      <ImageAttachmentIcon src={fileAttachmentIcon} alt="" />
                    )}
                  </PostTitle>
                  <Author>
                    <AuthorImage
                      alt={`${post.userName} 프로필`}
                      $hasBorder={hasCustomBorder}
                      equippedItems={equippedItems}
                      imageUrl={authorImage}
                      loading="lazy"
                      decoding="async"
                      onImageError={handleProfileImageError}
                      size={28}
                    />
                    <AuthorName
                      $pinned={post.pinned}
                      styleKey={profileNameStyleKey}
                    >
                      {post.userName}
                    </AuthorName>
                  </Author>
                  <Date dateTime={post.createdAt}>
                    {formatCommunityListRecentDate(post.createdAt, currentTime)}
                  </Date>
                  <Stats
                    aria-label={`좋아요 ${post.likeCount}, 댓글 ${post.commentCount}, 조회 ${post.viewers}`}
                  >
                    <Stat>
                      <StatIcon
                        src={
                          post.isHearted ? heartColoredIcon : heartOutlineIcon
                        }
                        alt=""
                        $kind="heart"
                      />
                      <StatValue>
                        {formatCommunityCount(post.likeCount)}
                      </StatValue>
                    </Stat>
                    <Stat>
                      <StatIcon
                        src={commentOutlineIcon}
                        alt=""
                        $kind="comment"
                      />
                      <StatValue>
                        {formatCommunityCount(post.commentCount)}
                      </StatValue>
                    </Stat>
                    <Stat>
                      <StatIcon src={eyeIcon} alt="" $kind="view" />
                      <StatValue>
                        {formatCommunityCount(post.viewers)}
                      </StatValue>
                    </Stat>
                  </Stats>
                </PostRow>
              );
            })}
        </PostList>

        {!isLoading && !loadError && totalPages > 1 && (
          <Pagination aria-label="게시글 페이지">
            {visiblePages.map((page) => (
              <PageButton
                key={page}
                type="button"
                aria-current={page === currentPage ? 'page' : undefined}
                $active={page === currentPage}
                disabled={page === currentPage}
                onClick={() => setCurrentPage(page)}
              >
                {page + 1}
              </PageButton>
            ))}
          </Pagination>
        )}
      </Content>
    </Page>
  );
}
