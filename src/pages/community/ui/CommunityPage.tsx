import { useNavigate, useSearchParams } from 'react-router-dom'

import {
  ALL_POST_CATEGORY_TAB,
  POST_CATEGORY_TABS,
  type PostCategoryTab,
} from '@/shared/constants/community'
import { Button } from '@/shared/ui'
import { CategoryTabs, Pagination, PostList, usePostList } from '@/features/post'

import { Body, PageTitle } from './CommunityLayout.style'
import {
  Description,
  Header,
  ListArea,
  TitleGroup,
  TitleRow,
} from './CommunityPage.style'

/**
 * 쿼리 스트링의 category 값을 탭 값으로 바꾼다. (알 수 없는 값이면 전체 글)
 *
 * @param value 쿼리 스트링에서 읽은 category 값
 */
const parseTab = (value: string | null): PostCategoryTab => {
  const tab = POST_CATEGORY_TABS.find((item) => item.id === value)
  return tab?.id ?? ALL_POST_CATEGORY_TAB
}

export function CommunityPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const activeTab = parseTab(searchParams.get('category'))
  const page = Math.max(0, Number(searchParams.get('page') ?? 0) || 0)

  const { posts, totalPages, isLoading } = usePostList(activeTab, page)

  const handleTabSelect = (tab: PostCategoryTab) => {
    setSearchParams({ category: tab, page: '0' })
  }

  const handlePageChange = (nextPage: number) => {
    setSearchParams({ category: activeTab, page: String(nextPage) })
  }

  const handlePostSelect = (postId: number) => {
    navigate(`/community/${postId}`)
  }

  return (
    <Body>
      <Header>
        <TitleRow>
          <TitleGroup>
            <PageTitle>커뮤니티</PageTitle>
            <Description>동아리의 최신 소식을 부원들과 공유해 보세요!</Description>
          </TitleGroup>
          <Button size="md" onClick={() => navigate('/community/write')}>
            새 글 쓰기
          </Button>
        </TitleRow>
        <CategoryTabs activeTab={activeTab} onTabSelect={handleTabSelect} />
      </Header>
      <ListArea>
        <PostList
          posts={posts}
          isLoading={isLoading}
          onPostSelect={handlePostSelect}
        />
      </ListArea>
      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </Body>
  )
}
