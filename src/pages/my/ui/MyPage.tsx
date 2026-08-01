import profileImage from '@/shared/assets/sidebar/profile.png'

import { useMyPage } from '../model/useMyPage'
import { MyStatIcon } from './icons/MyStatIcon'
import * as S from './MyPage.style'
import { ActivityFilterBar } from './component/ActivityFilterBar'

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
          <ActivityFilterBar
            tabs={activityTabs}
            activeTabId={activeTabId}
            onChange={setActiveTabId}
          />

          {hasPosts ? (
            <S.PostList>
              {posts.map((post) => (
                <S.PostPlaceholder key={post.id} />
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
