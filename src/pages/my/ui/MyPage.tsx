import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import profileImage from '@/shared/assets/sidebar/profile.png'
import { hasApiAccessToken } from '@/shared/api'

import {
  sendWithdrawalVerificationCode,
  verifyWithdrawalCode,
} from '../model/myApi'
import { useMyPage } from '../model/useMyPage'
import { ActivityFilterBar } from './component/ActivityFilterBar'
import { ActivityPost } from './component/ActivityPost'
import { MemberActionToast } from './component/MemberActionToast'
import { MemberManagementModal } from './component/MemberManagementModal'
import { WithdrawModal } from './component/WithdrawModal'
import { MyStatIcon } from './icons/MyStatIcon'
import * as S from './MyPage.style'
import type { WithdrawModalStep } from './component/WithdrawModal'

export function MyPage() {
  const navigate = useNavigate()
  const [withdrawStep, setWithdrawStep] = useState<WithdrawModalStep | null>(
    null,
  )
  const [isMemberManagementOpen, setIsMemberManagementOpen] = useState(false)
  const [memberActionToastMessage, setMemberActionToastMessage] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
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
  const profileImageSrc = profile.imageUrl || profileImage

  const handleOpenWithdrawModal = async () => {
    if (!hasApiAccessToken()) {
      window.alert('로그인 기능이 연결된 뒤 사용할 수 있어요')
      return
    }

    setWithdrawStep('verify')

    try {
      await sendWithdrawalVerificationCode()
    } catch {
      window.alert('인증 코드를 발송하지 못했어요')
    }
  }

  const handleVerifyWithdrawalCode = async () => {
    try {
      await verifyWithdrawalCode(verificationCode)
      setWithdrawStep('confirm')
    } catch {
      window.alert('인증 코드가 올바르지 않아요')
    }
  }

  return (
    <S.Page>
      <S.Content>
        <S.ProfileSection>
          <S.ProfileImageWrap>
            <S.ProfileImage src={profileImageSrc} alt="" />
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
              <S.ActionButton
                type="button"
                $variant="secondary"
                onClick={() => setIsMemberManagementOpen(true)}
              >
                멤버 관리
              </S.ActionButton>
              <S.ActionButton type="button">프로필 꾸미기</S.ActionButton>
              <S.ActionButton
                type="button"
                $variant="outline"
                onClick={() => navigate('/my/edit')}
              >
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
                <ActivityPost key={post.id} post={post} />
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
          <S.FooterButton
            type="button"
            $danger
            onClick={handleOpenWithdrawModal}
          >
            회원 탈퇴
          </S.FooterButton>
        </S.FooterActions>
      </S.Content>

      {withdrawStep && (
        <WithdrawModal
          step={withdrawStep}
          verificationCode={verificationCode}
          onVerificationCodeChange={setVerificationCode}
          onCancel={() => setWithdrawStep(null)}
          onNext={handleVerifyWithdrawalCode}
          onWithdraw={() => navigate('/my/withdraw-complete')}
        />
      )}

      {isMemberManagementOpen && (
        <MemberManagementModal
          onClose={() => setIsMemberManagementOpen(false)}
          onComplete={setMemberActionToastMessage}
        />
      )}

      {memberActionToastMessage && (
        <MemberActionToast
          message={memberActionToastMessage}
          onClose={() => setMemberActionToastMessage('')}
        />
      )}
    </S.Page>
  )
}
