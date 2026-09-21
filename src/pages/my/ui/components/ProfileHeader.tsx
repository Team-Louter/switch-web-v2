import { FiEdit } from 'react-icons/fi'

import {
  extractGithubHandle,
  extractLinkedinHandle,
  normalizeGithubUrl,
  normalizeLinkedinUrl,
} from '../../model/profileUrlUtils'
import { UserName } from '@/entities/user'
import { ProfileAvatar } from '@/shared/ui'
import { getNameStyleKey } from '@/shared/styles'
import fallbackProfileImage from '@/shared/assets/sidebar/profile.png'

import * as S from '../MyPage.style'
import githubIcon from '../assets/v1-github.svg'
import linkedinIcon from '../assets/v1-linkedin.svg'
import { MyStatIcon } from '../icons'
import type { MyActivityTab, MyProfile } from '../../types'

interface ProfileHeaderProps {
  activityTabs: MyActivityTab[]
  isLoading: boolean
  onEdit: () => void
  onCustomize: () => void
  onLogout: () => void
  onMemberManage?: () => void
  onWithdraw: () => void
  profile: MyProfile
}

const getSocialLabel = (url: string, kind: 'github' | 'linkedin') =>
  kind === 'github' ? extractGithubHandle(url) : extractLinkedinHandle(url)

const formatCount = (value?: number) =>
  typeof value === 'number' ? value.toLocaleString() : '0'

export function ProfileHeader({
  activityTabs,
  isLoading,
  onEdit,
  onCustomize,
  onLogout,
  onMemberManage,
  onWithdraw,
  profile,
}: ProfileHeaderProps) {
  if (isLoading) {
    return (
      <>
        <S.CardTop aria-label="프로필 불러오는 중">
          <S.QuickStats aria-label="보유 현황 불러오는 중">
            <S.QuickStat>
              <S.QuickStatIcon $kind="point" aria-hidden="true">
                <MyStatIcon type="point" />
              </S.QuickStatIcon>
              <S.SkeletonBlock $width="24px" $height="10px" />
            </S.QuickStat>
          </S.QuickStats>
          <S.ProfileGroup>
            <S.SkeletonCircle />
            <S.ProfileInfo>
              <S.SkeletonBlock $width="120px" $height="24px" />
              <S.SkeletonBlock $width="160px" $height="16px" />
              <S.SkeletonBlock $width="86px" $height="28px" />
            </S.ProfileInfo>
          </S.ProfileGroup>
          <S.StatsGroup>
            {[0, 1, 2].map((item) => (
              <S.StatItem key={item}>
                <S.SkeletonBlock $width="36px" $height="24px" />
                <S.SkeletonBlock $width="76px" $height="14px" />
              </S.StatItem>
            ))}
          </S.StatsGroup>
          <S.ActionGroup>
            <S.SkeletonBlock $width="120px" $height="18px" />
            <S.ButtonRow>
              <S.SkeletonBlock $width="72px" $height="30px" />
              <S.SkeletonBlock $width="72px" $height="30px" />
            </S.ButtonRow>
          </S.ActionGroup>
        </S.CardTop>
        <S.Divider />
        <S.InfoSection>
          <S.SkeletonBlock $width="260px" $height="20px" />
          <S.SkeletonBlock $width="190px" $height="20px" />
        </S.InfoSection>
      </>
    )
  }

  const postCount = activityTabs.find((tab) => tab.id === 'posts')?.count ?? 0
  const commentCount =
    activityTabs.find((tab) => tab.id === 'comments')?.count ?? 0
  const likedPostCount =
    activityTabs.find((tab) => tab.id === 'likes')?.count ?? 0
  const profileImageUrl = profile.imageUrl ?? fallbackProfileImage
  const profileTitle = profile.equippedItems?.title
  const profileTitleText = profileTitle?.valueText ?? profileTitle?.itemName
  const profileNameColor = profile.equippedItems?.nameColor
  const profileNameStyleKey = getNameStyleKey(
    profileNameColor?.styleKey ??
      profileNameColor?.valueColor ??
      profileNameColor?.value_color ??
      profileNameColor?.valueText ??
      profileNameColor?.itemName,
  )
  const profileBorder = profile.equippedItems?.border
  const profileBorderImageUrl =
    profileBorder?.valueImageUrl ??
    profileBorder?.imageUrl ??
    profileBorder?.itemImageUrl ??
    profileBorder?.originalImageUrl ??
    profileBorder?.previewImageUrl ??
    profileBorder?.thumbnailUrl
  const hasCustomBorder = Boolean(profileBorderImageUrl?.trim())

  return (
    <>
      <S.CardTop>
        <S.QuickStats aria-label="보유 현황">
          <S.QuickStat
            role="img"
            aria-label={`포인트 ${formatCount(profile.point)}`}
          >
            <S.QuickStatIcon $kind="point" aria-hidden="true">
              <MyStatIcon type="point" />
            </S.QuickStatIcon>
            <S.QuickStatValue>{formatCount(profile.point)}</S.QuickStatValue>
          </S.QuickStat>
        </S.QuickStats>
        <S.ProfileGroup>
          <S.ProfileImageWrapper $hasCustomBorder={hasCustomBorder}>
            <ProfileAvatar
              alt={`${profile.name} 프로필 이미지`}
              equippedItems={profile.equippedItems}
              imageUrl={profileImageUrl}
              loading="eager"
              size={116}
            />
            <S.ProfileCustomizeButton
              aria-label="프로필 꾸미기"
              onClick={onCustomize}
              type="button"
            >
              <FiEdit aria-hidden="true" />
            </S.ProfileCustomizeButton>
          </S.ProfileImageWrapper>
          <S.ProfileInfo>
            {profileTitleText && (
              <S.ProfileTitle>{profileTitleText}</S.ProfileTitle>
            )}
            <S.ProfileName>
              <UserName styleKey={profileNameStyleKey}>{profile.name}</UserName>
            </S.ProfileName>
            <S.ProfileSubInfo>{profile.classInfo}</S.ProfileSubInfo>
            <S.EditButton type="button" onClick={onEdit}>
              프로필 수정
            </S.EditButton>
          </S.ProfileInfo>
        </S.ProfileGroup>

        <S.StatsGroup>
          <S.StatItem>
            <S.StatValue>{postCount.toLocaleString()}</S.StatValue>
            <S.StatLabel>작성한 글</S.StatLabel>
          </S.StatItem>
          <S.StatItem>
            <S.StatValue>{commentCount.toLocaleString()}</S.StatValue>
            <S.StatLabel>작성한 댓글</S.StatLabel>
          </S.StatItem>
          <S.StatItem>
            <S.StatValue>{likedPostCount.toLocaleString()}</S.StatValue>
            <S.StatLabel>좋아요한 글</S.StatLabel>
          </S.StatItem>
        </S.StatsGroup>

        <S.ActionGroup>
          <S.SocialRow>
            {profile.githubUrl && (
              <S.SocialLink
                href={normalizeGithubUrl(profile.githubUrl)}
                rel="noopener noreferrer"
                target="_blank"
              >
                <S.SocialIcon aria-hidden="true">
                  <img src={githubIcon} alt="" />
                </S.SocialIcon>
                {getSocialLabel(profile.githubUrl, 'github')}
              </S.SocialLink>
            )}
            {profile.linkedinUrl && (
              <S.SocialLink
                href={normalizeLinkedinUrl(profile.linkedinUrl)}
                rel="noopener noreferrer"
                target="_blank"
              >
                <S.SocialIcon aria-hidden="true">
                  <img src={linkedinIcon} alt="" />
                </S.SocialIcon>
                {getSocialLabel(profile.linkedinUrl, 'linkedin')}
              </S.SocialLink>
            )}
          </S.SocialRow>
          <S.ButtonRow>
            {onMemberManage && (
              <S.ActionButton type="button" $variant="admin" onClick={onMemberManage}>
                멤버 관리
              </S.ActionButton>
            )}
            <S.ActionButton type="button" onClick={onLogout}>
              로그아웃
            </S.ActionButton>
            <S.ActionButton type="button" $danger onClick={onWithdraw}>
              회원 탈퇴
            </S.ActionButton>
          </S.ButtonRow>
        </S.ActionGroup>
      </S.CardTop>

      <S.Divider />

      <S.InfoSection>
        <S.InfoRow>
          <S.InfoLabel>이메일(Email)</S.InfoLabel>
          <S.InfoValue>{profile.email}</S.InfoValue>
        </S.InfoRow>
        <S.InfoRow>
          <S.InfoLabel>받은 좋아요 개수</S.InfoLabel>
          <S.InfoValue $accent>
            {(profile.receivedLikeCount ?? 0).toLocaleString()}
          </S.InfoValue>
        </S.InfoRow>
      </S.InfoSection>
    </>
  )
}
