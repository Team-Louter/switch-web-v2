import {
  type KeyboardEvent,
  type SyntheticEvent,
  useEffect,
  useState,
} from 'react';
import { PiNoteBlank } from 'react-icons/pi';
import { useNavigate } from 'react-router-dom';

import {
  formatCommunityCount,
  formatCommunityListRecentDate,
  getPostCategoryLabel,
  resolveCommunityAssetUrl,
} from '@/entities/community';
import { profileFallbackImage as fallbackProfileImage } from '@/shared/assets/profileFallback';
import eyeIcon from '@/shared/assets/my/eye-icon.svg';
import { getNameStyleKey } from '@/shared/styles';
import { Button } from '@/shared/ui';

import commentOutlineIcon from '../assets/svg/comment-outline.svg';
import heartColoredIcon from '../assets/svg/heart-colored.svg';
import heartOutlineIcon from '../assets/svg/heart-outline.svg';
import fileAttachmentIcon from '../assets/svg/file-attachment.svg';
import imageAttachmentIcon from '../assets/svg/image-attachment.svg';
import pinIcon from '../assets/svg/pin-solid.svg';
import {
  useCommunityListNavigation,
  useCommunityListScroll,
} from '../model/useCommunityListNavigation';
import { useCommunityPosts } from '../model/useCommunityPosts';
import { Content, Page, PostList } from './CommunityList.style';
import { CommunityListHeader } from './CommunityListHeader';
import { CommunityListSkeleton } from './CommunityPageSkeleton';
import {
  Author,
  AuthorImage,
  AuthorMeta,
  AuthorName,
  AuthorTitle,
  CategoryCell,
  Date,
  EmptyDescription,
  EmptyIcon,
  EmptyState,
  EmptyTitle,
  ImageAttachmentIcon,
  PageButton,
  Pagination,
  PinnedIcon,
  PostCategory as PostCategoryBadge,
  PostRow,
  PostTitle,
  PostTitleText,
  Stat,
  StatIcon,
  StatValue,
  Stats,
  StatusMessage,
  StatusState,
} from './CommunityPage.style';
import { PixelHammerIcon } from './PixelHammerIcon';

const MAX_VISIBLE_PAGE_COUNT = 5;
const RELATIVE_TIME_REFRESH_INTERVAL_MS = 30_000;

function preloadDetailPage() {
  // 상세 API는 조회수를 증가시키므로 화면 코드만 사전 로딩합니다.
  void import('./CommunityDetailPage').catch(() => {});
}

export function CommunityPage() {
  const navigate = useNavigate();
  const {
    selectedCategory,
    currentPage,
    selectCategory,
    selectPage,
    getNavigationState,
  } = useCommunityListNavigation();
  const { posts, totalPages, hasData, isLoading, isFetching, loadError, retry } =
    useCommunityPosts(selectedCategory, currentPage);
  useCommunityListScroll(hasData);
  const [currentTime, setCurrentTime] = useState(globalThis.Date.now);

  const firstVisiblePage = Math.min(
    Math.max(currentPage - Math.floor(MAX_VISIBLE_PAGE_COUNT / 2), 0),
    Math.max(totalPages - MAX_VISIBLE_PAGE_COUNT, 0),
  );
  const visiblePages = Array.from(
    { length: Math.min(totalPages, MAX_VISIBLE_PAGE_COUNT) },
    (_, index) => firstVisiblePage + index,
  );

  const handleWritePost = () => {
    navigate('/community/write', { state: getNavigationState() });
  };

  const handlePostSelect = (postId: number) => {
    navigate(`/community/${postId}`, {
      viewTransition: true,
      state: getNavigationState(),
    });
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
    retry();
  };

  useEffect(() => {
    if (
      hasData &&
      !isFetching &&
      !loadError &&
      currentPage > 0 &&
      currentPage >= totalPages
    ) {
      selectPage(Math.max(totalPages - 1, 0), true);
    }
  }, [hasData, isFetching, loadError, currentPage, totalPages, selectPage]);

  useEffect(() => {
    const refreshIntervalId = window.setInterval(
      () => setCurrentTime(globalThis.Date.now()),
      RELATIVE_TIME_REFRESH_INTERVAL_MS,
    );

    return () => {
      window.clearInterval(refreshIntervalId);
    };
  }, []);

  return (
    <Page>
      <Content>
        <CommunityListHeader
          selectedCategory={selectedCategory}
          actions={{
            onCategorySelect: selectCategory,
            onWritePost: handleWritePost,
          }}
        />

        <PostList aria-label="게시글 목록" aria-busy={isFetching}>
          {isLoading && <CommunityListSkeleton />}

          {!isLoading && loadError && (
            <StatusState role="alert">
              <StatusMessage>{loadError}</StatusMessage>
              <Button
                size="sm"
                variant="neutral"
                onClick={handleRetry}
                disabled={isFetching}
              >
                다시 시도
              </Button>
            </StatusState>
          )}

          {hasData && posts.length === 0 && (
            <EmptyState>
              <EmptyIcon>
                <PiNoteBlank size={18} aria-hidden="true" />
              </EmptyIcon>
              <EmptyTitle>등록된 게시글이 없습니다.</EmptyTitle>
              <EmptyDescription>첫 게시글을 작성해 보세요.</EmptyDescription>
            </EmptyState>
          )}

          {hasData &&
            posts.map((post) => {
              const authorImage =
                resolveCommunityAssetUrl(post.userProfileImageUrl) ??
                fallbackProfileImage;
              const equippedItems = post.isAnonymous
                ? undefined
                : post.equippedItems;
              const profileNameColor = equippedItems?.nameColor;
              const profileNameStyleKey = getNameStyleKey(
                profileNameColor?.styleKey ??
                  profileNameColor?.valueColor ??
                  profileNameColor?.value_color ??
                  profileNameColor?.valueText ??
                  profileNameColor?.itemName,
              );
              const profileTitleName =
                equippedItems?.title?.valueText ??
                equippedItems?.title?.itemName;
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
                  onPointerEnter={preloadDetailPage}
                  onFocus={preloadDetailPage}
                  onClick={() => handlePostSelect(post.postId)}
                  onKeyDown={(event) => handlePostKeyDown(event, post.postId)}
                >
                  <CategoryCell>
                    <PostCategoryBadge>
                      {getPostCategoryLabel(post.category)}
                    </PostCategoryBadge>
                  </CategoryCell>
                  <PostTitle $pinned={post.pinned}>
                    {post.pinned && (
                      <PinnedIcon src={pinIcon} alt="고정된 게시글" />
                    )}
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
                    <AuthorMeta>
                      <AuthorName
                        $pinned={post.pinned}
                        styleKey={profileNameStyleKey}
                      >
                        {post.userName}
                      </AuthorName>
                      {profileTitleName && (
                        <AuthorTitle>
                          {profileTitleName === '최초의 개발자' && (
                            <PixelHammerIcon size={14} />
                          )}
                          <span>{profileTitleName}</span>
                        </AuthorTitle>
                      )}
                    </AuthorMeta>
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

        {hasData && totalPages > 1 && (
          <Pagination aria-label="게시글 페이지">
            {visiblePages.map((page) => (
              <PageButton
                key={page}
                type="button"
                aria-current={page === currentPage ? 'page' : undefined}
                $active={page === currentPage}
                disabled={page === currentPage}
                onClick={() => selectPage(page)}
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
