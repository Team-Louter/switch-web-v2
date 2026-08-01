import commentIcon from '@/shared/assets/my/comment-icon.svg'
import eyeIcon from '@/shared/assets/my/eye-icon.svg'
import heartIcon from '@/shared/assets/my/heart-icon.svg'
import profileImage from '@/shared/assets/sidebar/profile.png'

import { useMyPage } from '../model/useMyPage'
import type { MyPost } from '../types'
import { MyStatIcon } from './icons/MyStatIcon'
import * as S from './MyPage.style'

export function MyPage() {
  const {
    activeTabId,
    activityTabs,
    emptyMessage,
    posts,
    profile,
    setActiveTabId,
    stats,
  } = useMyPage()

  const hasPosts = posts.length > 0

  return (
    <S.Page>
      <S.Content>
        <S.ProfileSection>
          <S.ProfileImageWrap>
            <S.ProfileImage src={profileImage} alt="" />
          </S.ProfileImageWrap>

          <S.ProfileInfo>
            <S.ProfileTextGroup>
              <S.ProfileIdentity>
                <S.ProfileName>{profile.name}</S.ProfileName>
                <S.ProfileDescription>{profile.classInfo}</S.ProfileDescription>
                <S.ProfileDescription>{profile.role}</S.ProfileDescription>
              </S.ProfileIdentity>
              <S.ProfileEmail>{profile.email}</S.ProfileEmail>
            </S.ProfileTextGroup>

            <S.ProfileActions>
              <S.ActionButton type="button">프로필 꾸미기</S.ActionButton>
              <S.ActionButton type="button" $variant="outline">
                프로필 수정
              </S.ActionButton>
            </S.ProfileActions>
          </S.ProfileInfo>
        </S.ProfileSection>

        <S.StatBar>
          {stats.map((stat) => (
            <S.StatItem key={stat.id}>
              <S.StatLabelGroup>
                <S.StatIcon aria-hidden="true">
                  <MyStatIcon type={stat.id} />
                </S.StatIcon>
                <S.StatLabel>{stat.label}</S.StatLabel>
              </S.StatLabelGroup>
              <S.StatValue>{stat.value}</S.StatValue>
            </S.StatItem>
          ))}
        </S.StatBar>

        <S.Divider />

        <S.ActivitySection>
          <S.ActivityHeader>
            <S.SectionTitle>내 활동</S.SectionTitle>
            <S.TabList>
              {activityTabs.map((tab) => (
                <S.TabButton
                  key={tab.id}
                  type="button"
                  $active={activeTabId === tab.id}
                  onClick={() => setActiveTabId(tab.id)}
                >
                  {tab.label} ({tab.count})
                </S.TabButton>
              ))}
            </S.TabList>
          </S.ActivityHeader>

          {hasPosts ? (
            <S.PostList>
              {posts.map((post) => (
                <ActivityPost
                  key={post.id}
                  post={post}
                  isComment={activeTabId === 'comments'}
                  isLiked={activeTabId === 'likes'}
                />
              ))}
            </S.PostList>
          ) : (
            <S.EmptyState>{emptyMessage}</S.EmptyState>
          )}
        </S.ActivitySection>

        <S.Divider />

        <S.FooterActions>
          <S.FooterButton type="button">로그아웃</S.FooterButton>
          <S.FooterDivider />
          <S.FooterButton type="button" $danger>
            회원 탈퇴
          </S.FooterButton>
        </S.FooterActions>
      </S.Content>
    </S.Page>
  )
}

type ActivityPostProps = {
  post: MyPost
  isComment: boolean
  isLiked: boolean
}

function ActivityPost({ post, isComment, isLiked }: ActivityPostProps) {
  const content = (
    <S.PostMainLine>
      <S.CategoryBadge>{post.category}</S.CategoryBadge>
      <S.PostTitle>{post.title}</S.PostTitle>
      <S.AuthorCell>
        <S.AuthorAvatar src={profileImage} alt="" />
        <S.AuthorName>{post.author}</S.AuthorName>
      </S.AuthorCell>
      <S.DateCell>{post.createdAt}</S.DateCell>
      <S.Metrics>
        <S.Metric>
          <S.MaskIcon $src={heartIcon} $active={isLiked} aria-hidden="true" />
          {post.likes}
        </S.Metric>
        <S.Metric>
          <S.MaskIcon $src={commentIcon} aria-hidden="true" />
          {post.comments}
        </S.Metric>
        <S.Metric>
          <S.MaskIcon $src={eyeIcon} aria-hidden="true" />
          {post.views}
        </S.Metric>
      </S.Metrics>
    </S.PostMainLine>
  )

  if (isComment) {
    return (
      <S.CommentPostRow>
        {content}
        <S.CommentPreview>{post.commentPreview}</S.CommentPreview>
      </S.CommentPostRow>
    )
  }

  return <S.PostRow>{content}</S.PostRow>
}
