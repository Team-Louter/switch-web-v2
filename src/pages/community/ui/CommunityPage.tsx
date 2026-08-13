import {
  type KeyboardEvent,
  type SyntheticEvent,
  useEffect,
  useState,
} from 'react'
import { useNavigate } from 'react-router-dom'

import {
  formatCommunityDate,
  getPostCategoryLabel,
  getPosts,
  POST_CATEGORY_OPTIONS,
  resolveCommunityAssetUrl,
  type PostCategory,
  type PostResponse,
} from '@/entities/community'
import fallbackProfileImage from '@/shared/assets/sidebar/profile.png'
import commentIcon from '@/shared/assets/my/comment-icon.svg'
import eyeIcon from '@/shared/assets/my/eye-icon.svg'
import heartIcon from '@/shared/assets/my/heart-icon.svg'
import { Button } from '@/shared/ui'

import pinIcon from '../assets/svg/pin-solid.svg'
import {
  Author,
  AuthorImage,
  AuthorName,
  CategoryCell,
  CategoryTab,
  CategoryTabs,
  Content,
  Date,
  Header,
  Heading,
  HeadingDescription,
  HeadingGroup,
  HeadingRow,
  Page,
  PageButton,
  Pagination,
  PinnedIcon,
  PostCategory as PostCategoryBadge,
  PostList,
  PostRow,
  PostTitle,
  SkeletonAuthor,
  SkeletonCategory,
  SkeletonDate,
  SkeletonRow,
  SkeletonStats,
  SkeletonTitle,
  Stat,
  StatIcon,
  Stats,
  StatusMessage,
  StatusState,
} from './CommunityPage.style'

interface CategoryTabItem {
  value: PostCategory | null
  label: string
}

const CATEGORY_TABS: readonly CategoryTabItem[] = [
  { value: null, label: '전체 글' },
  ...POST_CATEGORY_OPTIONS,
]

const VISIBLE_PAGE_COUNT = 2
const SKELETON_ROW_COUNT = 8

export function CommunityPage() {
  const navigate = useNavigate()
  const [selectedCategory, setSelectedCategory] =
    useState<PostCategory | null>(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [posts, setPosts] = useState<PostResponse[]>([])
  const [totalPages, setTotalPages] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)

  const firstVisiblePage =
    Math.floor(currentPage / VISIBLE_PAGE_COUNT) * VISIBLE_PAGE_COUNT
  const visiblePages = Array.from(
    {
      length: Math.min(
        VISIBLE_PAGE_COUNT,
        Math.max(totalPages - firstVisiblePage, 0),
      ),
    },
    (_, index) => firstVisiblePage + index,
  )
  const hasPreviousPageGroup = firstVisiblePage > 0
  const hasNextPageGroup =
    firstVisiblePage + VISIBLE_PAGE_COUNT < totalPages

  const handleCategorySelect = (category: PostCategory | null) => {
    setSelectedCategory(category)
    setCurrentPage(0)
  }

  const handleWritePost = () => {
    navigate('/community/write')
  }

  const handlePostSelect = (postId: number) => {
    navigate(`/community/${postId}`)
  }

  const handlePostKeyDown = (
    event: KeyboardEvent<HTMLElement>,
    postId: number,
  ) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handlePostSelect(postId)
    }
  }

  const handleProfileImageError = (
    event: SyntheticEvent<HTMLImageElement>,
  ) => {
    event.currentTarget.onerror = null
    event.currentTarget.src = fallbackProfileImage
  }

  const handleRetry = () => {
    setReloadKey((currentKey) => currentKey + 1)
  }

  useEffect(() => {
    let isCancelled = false

    async function loadPosts() {
      setIsLoading(true)
      setLoadError(null)

      try {
        const response = await getPosts({
          category: selectedCategory ?? undefined,
          page: currentPage,
        })

        if (!isCancelled) {
          setPosts(response.content)
          setTotalPages(response.totalPages)
        }
      } catch {
        if (!isCancelled) {
          setPosts([])
          setTotalPages(0)
          setLoadError('게시글을 불러오지 못했습니다.')
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false)
        }
      }
    }

    void loadPosts()

    return () => {
      isCancelled = true
    }
  }, [currentPage, reloadKey, selectedCategory])

  return (
    <Page>
      <Content>
        <Header>
          <HeadingRow>
            <HeadingGroup>
              <Heading>커뮤니티</Heading>
              <HeadingDescription>
                동아리의 최신 소식을 부원들과 공유해 보세요!
              </HeadingDescription>
            </HeadingGroup>
            <Button size="md" onClick={handleWritePost}>
              새 글 쓰기
            </Button>
          </HeadingRow>
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
            <StatusState>
              <StatusMessage>아직 등록된 게시글이 없습니다.</StatusMessage>
            </StatusState>
          )}

          {!isLoading &&
            !loadError &&
            posts.map((post) => {
              const authorImage =
                resolveCommunityAssetUrl(post.userProfileImageUrl) ??
                fallbackProfileImage

              return (
                <PostRow
                  key={post.postId}
                  role="link"
                  tabIndex={0}
                  onClick={() => handlePostSelect(post.postId)}
                  onKeyDown={(event) =>
                    handlePostKeyDown(event, post.postId)
                  }
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
                    {post.postTitle}
                  </PostTitle>
                  <Author>
                    <AuthorImage
                      src={authorImage}
                      alt={`${post.userName} 프로필`}
                      onError={handleProfileImageError}
                    />
                    <AuthorName>{post.userName}</AuthorName>
                  </Author>
                  <Date dateTime={post.createdAt}>
                    {formatCommunityDate(post.createdAt)}
                  </Date>
                  <Stats
                    aria-label={`좋아요 ${post.likeCount}, 댓글 ${post.commentCount}, 조회 ${post.viewers}`}
                  >
                    <Stat>
                      <StatIcon src={heartIcon} alt="" $kind="heart" />
                      {post.likeCount}
                    </Stat>
                    <Stat>
                      <StatIcon src={commentIcon} alt="" $kind="comment" />
                      {post.commentCount}
                    </Stat>
                    <Stat>
                      <StatIcon src={eyeIcon} alt="" $kind="view" />
                      {post.viewers}
                    </Stat>
                  </Stats>
                </PostRow>
              )
            })}
        </PostList>

        {!isLoading && !loadError && totalPages > 1 && (
          <Pagination aria-label="게시글 페이지">
            <PageButton
              type="button"
              aria-label="이전 페이지 그룹"
              $active={false}
              disabled={!hasPreviousPageGroup}
              onClick={() => setCurrentPage(firstVisiblePage - 1)}
            >
              ‹
            </PageButton>
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
            <PageButton
              type="button"
              aria-label="다음 페이지 그룹"
              $active={false}
              disabled={!hasNextPageGroup}
              onClick={() =>
                setCurrentPage(firstVisiblePage + VISIBLE_PAGE_COUNT)
              }
            >
              ›
            </PageButton>
          </Pagination>
        )}
      </Content>
    </Page>
  )
}
