import { type KeyboardEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import authorChoiHyeonSu from '../assets/images/author-choi-hyeon-su.png'
import authorIdoYeon from '../assets/images/author-ido-yeon.png'
import authorJeonSuAn from '../assets/images/author-jeon-su-an.png'
import authorJeongMinSeong from '../assets/images/author-jeong-min-seong.png'
import authorJoSangCheol from '../assets/images/author-jo-sang-cheol.png'
import authorLeeDaYeon from '../assets/images/author-lee-da-yeon.png'
import authorLeeJunHyeon from '../assets/images/author-lee-jun-hyeon.png'
import pinIcon from '../assets/svg/pin-solid.svg'
import commentIcon from '@/shared/assets/my/comment-icon.svg'
import eyeIcon from '@/shared/assets/my/eye-icon.svg'
import heartIcon from '@/shared/assets/my/heart-icon.svg'
import { Button } from '@/shared/ui'

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
  PostCategory,
  PostList,
  PostRow,
  PostTitle,
  Stat,
  StatIcon,
  Stats,
} from './CommunityPage.style'

type CommunityCategory =
  | '전체 글'
  | '공지사항'
  | '자유게시판'
  | '정보 공유'
  | '과제'
  | '로드맵'
  | '대회'
  | 'Q&A'

type PostCategory = Exclude<CommunityCategory, '전체 글'>

interface CommunityPost {
  id: number
  category: PostCategory
  title: string
  isPinned: boolean
  author: string
  authorImage: string
  date: string
  dateTime: string
  likeCount: number
  commentCount: number
  viewCount: number
}

const CATEGORIES: readonly CommunityCategory[] = [
  '전체 글',
  '공지사항',
  '자유게시판',
  '정보 공유',
  '과제',
  '로드맵',
  '대회',
  'Q&A',
]

const POSTS: readonly CommunityPost[] = [
  {
    id: 1,
    category: '공지사항',
    title: '[필독] 라우터 커뮤니티 규칙',
    isPinned: true,
    author: '이도연',
    authorImage: authorIdoYeon,
    date: '2026.01.01 23:59',
    dateTime: '2026-01-01T23:59:00',
    likeCount: 12,
    commentCount: 1,
    viewCount: 32,
  },
  {
    id: 2,
    category: '과제',
    title: '[기획] 2213최현수 과제 제출',
    isPinned: false,
    author: '최현수',
    authorImage: authorChoiHyeonSu,
    date: '2026.01.01 23:59',
    dateTime: '2026-01-01T23:59:00',
    likeCount: 2,
    commentCount: 0,
    viewCount: 21,
  },
  {
    id: 3,
    category: 'Q&A',
    title: '깃허브 사용법이 궁금해요',
    isPinned: false,
    author: '조상철',
    authorImage: authorJoSangCheol,
    date: '2026.01.01 23:59',
    dateTime: '2026-01-01T23:59:00',
    likeCount: 21,
    commentCount: 7,
    viewCount: 57,
  },
  {
    id: 4,
    category: 'Q&A',
    title: '다음 주 동아리 시간에 뭐하나요?',
    isPinned: false,
    author: '이준현',
    authorImage: authorLeeJunHyeon,
    date: '2026.01.01 23:59',
    dateTime: '2026-01-01T23:59:00',
    likeCount: 2,
    commentCount: 1,
    viewCount: 12,
  },
  {
    id: 5,
    category: '대회',
    title: '2026 SW미래채움 고교 AI·SW챌린지',
    isPinned: false,
    author: '정민성',
    authorImage: authorJeongMinSeong,
    date: '2026.01.01 23:59',
    dateTime: '2026-01-01T23:59:00',
    likeCount: 12,
    commentCount: 6,
    viewCount: 22,
  },
  {
    id: 6,
    category: '정보 공유',
    title: '피그마 필수 플러그인 공유',
    isPinned: false,
    author: '이윤지',
    authorImage: authorJoSangCheol,
    date: '2026.01.01 23:59',
    dateTime: '2026-01-01T23:59:00',
    likeCount: 3,
    commentCount: 12,
    viewCount: 60,
  },
  {
    id: 7,
    category: '과제',
    title: '7월 둘째 주 과제 예시자료',
    isPinned: false,
    author: '전수안',
    authorImage: authorJeonSuAn,
    date: '2026.01.01 23:59',
    dateTime: '2026-01-01T23:59:00',
    likeCount: 0,
    commentCount: 1,
    viewCount: 11,
  },
  {
    id: 8,
    category: '자유게시판',
    title: '작년 시험지 나눔',
    isPinned: false,
    author: '이다연',
    authorImage: authorLeeDaYeon,
    date: '2026.01.01 23:59',
    dateTime: '2026-01-01T23:59:00',
    likeCount: 31,
    commentCount: 0,
    viewCount: 61,
  },
]

export function CommunityPage() {
  const navigate = useNavigate()
  const [selectedCategory, setSelectedCategory] =
    useState<CommunityCategory>('전체 글')

  const handleCategorySelect = (category: CommunityCategory) => {
    setSelectedCategory(category)
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
            {CATEGORIES.map((category) => (
              <CategoryTab
                key={category}
                type="button"
                role="tab"
                aria-selected={selectedCategory === category}
                $active={selectedCategory === category}
                onClick={() => handleCategorySelect(category)}
              >
                {category}
              </CategoryTab>
            ))}
          </CategoryTabs>
        </Header>

        <PostList aria-label="게시글 목록">
          {POSTS.map((post) => (
            <PostRow
              key={post.id}
              role="link"
              tabIndex={0}
              onClick={() => handlePostSelect(post.id)}
              onKeyDown={(event) => handlePostKeyDown(event, post.id)}
            >
              <CategoryCell>
                <PostCategory>{post.category}</PostCategory>
              </CategoryCell>
              {post.isPinned && (
                <PinnedIcon src={pinIcon} alt="고정된 게시글" />
              )}
              <PostTitle $pinned={post.isPinned}>{post.title}</PostTitle>
              <Author>
                <AuthorImage src={post.authorImage} alt={`${post.author} 프로필`} />
                <AuthorName>{post.author}</AuthorName>
              </Author>
              <Date dateTime={post.dateTime}>{post.date}</Date>
              <Stats aria-label={`좋아요 ${post.likeCount}, 댓글 ${post.commentCount}, 조회 ${post.viewCount}`}>
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
                  {post.viewCount}
                </Stat>
              </Stats>
            </PostRow>
          ))}
        </PostList>

        <Pagination aria-label="게시글 페이지">
          {[1, 2, 3, 4, 5].map((page) => (
            <PageButton
              key={page}
              type="button"
              aria-current={page === 1 ? 'page' : undefined}
              $active={page === 1}
            >
              {page}
            </PageButton>
          ))}
        </Pagination>
      </Content>
    </Page>
  )
}
