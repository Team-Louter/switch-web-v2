import commentIcon from '@/shared/assets/my/comment-icon.svg'
import eyeIcon from '@/shared/assets/my/eye-icon.svg'
import heartIcon from '@/shared/assets/my/heart-icon.svg'
import profileImage from '@/shared/assets/sidebar/profile.png'

import { useMyPage } from '../model/useMyPage'
import type { MyPost } from '../types'
import { MyStatIcon } from './icons/MyStatIcon'
import {
  ActionButton,
  ActivityHeader,
  ActivitySection,
  AuthorAvatar,
  AuthorCell,
  AuthorName,
  CategoryBadge,
  CommentPostRow,
  CommentPreview,
  Content,
  DateCell,
  Divider,
  EmptyState,
  FooterActions,
  FooterButton,
  FooterDivider,
  MaskIcon,
  Metric,
  Metrics,
  Page,
  PostList,
  PostMainLine,
  PostRow,
  PostTitle,
  ProfileActions,
  ProfileDescription,
  ProfileEmail,
  ProfileIdentity,
  ProfileImage,
  ProfileImageWrap,
  ProfileInfo,
  ProfileName,
  ProfileSection,
  ProfileTextGroup,
  SectionTitle,
  StatBar,
  StatIcon,
  StatItem,
  StatLabel,
  StatLabelGroup,
  StatValue,
  TabButton,
  TabList,
} from './MyPage.style'

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
    <Page>
      <Content>
        <ProfileSection>
          <ProfileImageWrap>
            <ProfileImage src={profileImage} alt="" />
          </ProfileImageWrap>

          <ProfileInfo>
            <ProfileTextGroup>
              <ProfileIdentity>
                <ProfileName>{profile.name}</ProfileName>
                <ProfileDescription>{profile.classInfo}</ProfileDescription>
                <ProfileDescription>{profile.role}</ProfileDescription>
              </ProfileIdentity>
              <ProfileEmail>{profile.email}</ProfileEmail>
            </ProfileTextGroup>

            <ProfileActions>
              <ActionButton type="button">프로필 꾸미기</ActionButton>
              <ActionButton type="button" $variant="outline">
                프로필 수정
              </ActionButton>
            </ProfileActions>
          </ProfileInfo>
        </ProfileSection>

        <StatBar>
          {stats.map((stat) => (
            <StatItem key={stat.id}>
              <StatLabelGroup>
                <StatIcon aria-hidden="true">
                  <MyStatIcon type={stat.id} />
                </StatIcon>
                <StatLabel>{stat.label}</StatLabel>
              </StatLabelGroup>
              <StatValue>{stat.value}</StatValue>
            </StatItem>
          ))}
        </StatBar>

        <Divider />

        <ActivitySection>
          <ActivityHeader>
            <SectionTitle>내 활동</SectionTitle>
            <TabList>
              {activityTabs.map((tab) => (
                <TabButton
                  key={tab.id}
                  type="button"
                  $active={activeTabId === tab.id}
                  onClick={() => setActiveTabId(tab.id)}
                >
                  {tab.label} ({tab.count})
                </TabButton>
              ))}
            </TabList>
          </ActivityHeader>

          {hasPosts ? (
            <PostList>
              {posts.map((post) => (
                <ActivityPost
                  key={post.id}
                  post={post}
                  isComment={activeTabId === 'comments'}
                  isLiked={activeTabId === 'likes'}
                />
              ))}
            </PostList>
          ) : (
            <EmptyState>{emptyMessage}</EmptyState>
          )}
        </ActivitySection>

        <Divider />

        <FooterActions>
          <FooterButton type="button">로그아웃</FooterButton>
          <FooterDivider />
          <FooterButton type="button" $danger>
            회원 탈퇴
          </FooterButton>
        </FooterActions>
      </Content>
    </Page>
  )
}

type ActivityPostProps = {
  post: MyPost
  isComment: boolean
  isLiked: boolean
}

function ActivityPost({ post, isComment, isLiked }: ActivityPostProps) {
  const content = (
    <PostMainLine>
      <CategoryBadge>{post.category}</CategoryBadge>
      <PostTitle>{post.title}</PostTitle>
      <AuthorCell>
        <AuthorAvatar src={profileImage} alt="" />
        <AuthorName>{post.author}</AuthorName>
      </AuthorCell>
      <DateCell>{post.createdAt}</DateCell>
      <Metrics>
        <Metric>
          <MaskIcon $src={heartIcon} $active={isLiked} aria-hidden="true" />
          {post.likes}
        </Metric>
        <Metric>
          <MaskIcon $src={commentIcon} aria-hidden="true" />
          {post.comments}
        </Metric>
        <Metric>
          <MaskIcon $src={eyeIcon} aria-hidden="true" />
          {post.views}
        </Metric>
      </Metrics>
    </PostMainLine>
  )

  if (isComment) {
    return (
      <CommentPostRow>
        {content}
        <CommentPreview>{post.commentPreview}</CommentPreview>
      </CommentPostRow>
    )
  }

  return <PostRow>{content}</PostRow>
}
