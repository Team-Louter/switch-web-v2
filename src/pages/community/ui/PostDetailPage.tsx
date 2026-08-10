import { useNavigate, useParams } from 'react-router-dom'

import { formatDateTime } from '@/shared/lib/date'
import { ChevronLeftIcon } from '@/shared/ui/icons'
import { CommentSection } from '@/features/comment'
import { CategoryBadge, PostStats, usePostDetail } from '@/features/post'

import { BackButton, Body, IconBox, StatusText } from './CommunityLayout.style'
import {
  Article,
  AuthorGroup,
  AuthorName,
  Avatar,
  Content,
  CreatedAt,
  Divider,
  Dot,
  HeaderArea,
  HeaderInner,
  MetaGroup,
  StatsArea,
  Title,
  TitleRow,
} from './PostDetailPage.style'

export function PostDetailPage() {
  const navigate = useNavigate()
  const { postId } = useParams()

  const { post, isLoading, isHeartPending, reloadPost, toggleHeartOfPost } =
    usePostDetail(Number(postId))

  const backButton = (
    <BackButton type="button" onClick={() => navigate('/community')}>
      <IconBox>
        <ChevronLeftIcon aria-hidden="true" />
      </IconBox>
      목록 보기
    </BackButton>
  )

  // 로딩 중 / 불러오기 실패는 본문 자리에 문구로 대체한다.
  if (isLoading) {
    return (
      <Body>
        {backButton}
        <StatusText>게시글을 불러오는 중입니다.</StatusText>
      </Body>
    )
  }

  if (!post) {
    return (
      <Body>
        {backButton}
        <StatusText>게시글을 찾을 수 없습니다.</StatusText>
      </Body>
    )
  }

  return (
    <Body>
      {backButton}
      <Article>
        <HeaderArea>
          <HeaderInner>
            <CategoryBadge category={post.category} />
            <TitleRow>
              <Title>{post.postTitle}</Title>
              <MetaGroup>
                <AuthorGroup>
                  <Avatar>
                    {!post.isAnonymous && post.userProfileImageUrl && (
                      <img src={post.userProfileImageUrl} alt="" />
                    )}
                  </Avatar>
                  <AuthorName>
                    {post.isAnonymous ? '익명' : post.userName}
                  </AuthorName>
                </AuthorGroup>
                <Dot aria-hidden="true" />
                <CreatedAt>{formatDateTime(post.createdAt)}</CreatedAt>
              </MetaGroup>
            </TitleRow>
          </HeaderInner>
          <Divider />
        </HeaderArea>
        <Content>{post.postContent}</Content>
      </Article>
      <StatsArea>
        <PostStats
          likeCount={post.likeCount}
          commentCount={post.commentCount}
          viewers={post.viewers}
          isHearted={post.isHearted}
          files={post.files ?? []}
          isHeartPending={isHeartPending}
          onHeartToggle={toggleHeartOfPost}
        />
        <Divider />
      </StatsArea>
      <CommentSection postId={post.postId} onCommentCountChange={reloadPost} />
    </Body>
  )
}
