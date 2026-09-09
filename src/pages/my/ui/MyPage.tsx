import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { UserName } from '@/entities/user'
import { getNameStyleKey } from '@/shared/styles'
import {
  clearAccessToken,
  clearPendingAccessToken,
} from '@/shared/lib/authToken'
import { ProfileAvatar } from '@/shared/ui'

import {
  sendWithdrawalVerificationCode,
  verifyWithdrawalCode,
} from '../api'
import { useMyPage } from '../model/useMyPage'
import {
  ActivityFilterBar,
  ActivityPost,
  MemberActionToast,
  MemberManagementModal,
  WithdrawModal,
} from './components'
import { MyStatIcon } from './icons/MyStatIcon'
import * as S from './MyPage.style'
import type { WithdrawModalStep } from './components'

import { useProfileCustomize } from '@/pages/store/model/useProfileCustomize'
import { StoreProfileCustomizeModal } from '@/pages/store/ui/components/StoreProfileCustomizeModal'
import { dispatchProfileSync } from '@/shared/lib/profileSync'

import type { EquippedItemsResponse } from '@/entities/store'

const WITHDRAW_CODE_TIME_LIMIT_SECONDS = 120
const WITHDRAW_CODE_RESEND_DELAY_SECONDS = 30

export function MyPage() {
  const navigate = useNavigate()
  const [withdrawStep, setWithdrawStep] = useState<WithdrawModalStep | null>(
    null,
  )
  const [isMemberManagementOpen, setIsMemberManagementOpen] = useState(false)
  const [memberActionToastMessage, setMemberActionToastMessage] = useState('')
  const [withdrawConfirmText, setWithdrawConfirmText] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [withdrawCodeRemainingSeconds, setWithdrawCodeRemainingSeconds] =
    useState(WITHDRAW_CODE_TIME_LIMIT_SECONDS)
  const [withdrawResendRemainingSeconds, setWithdrawResendRemainingSeconds] =
    useState(WITHDRAW_CODE_RESEND_DELAY_SECONDS)
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false)
  const [equippedItemsOverride, setEquippedItemsOverride] =
    useState<EquippedItemsResponse | undefined>(undefined)
  const {
    activeTabId,
    activityTabs,
    emptyMessage,
    posts,
    profile,
    setActiveTabId,
    stats,
  } = useMyPage()

  const displayProfile = equippedItemsOverride
    ? { ...profile, equippedItems: equippedItemsOverride }
    : profile

  const hasPosts = posts.length > 0
  const canManageMembers = profile.role === 'LEADER'
  const profileNameColor = displayProfile.equippedItems?.nameColor
  const profileNameStyleKey = getNameStyleKey(
    profileNameColor?.styleKey ??
      profileNameColor?.valueColor ??
      profileNameColor?.value_color ??
      profileNameColor?.valueText ??
      profileNameColor?.itemName,
  )
  const profileTitle = displayProfile.equippedItems?.title
  const profileTitleText = profileTitle?.valueText ?? profileTitle?.itemName
  const canResendWithdrawalCode =
    withdrawStep === 'verify' && withdrawResendRemainingSeconds === 0

  useEffect(() => {
    if (withdrawStep !== 'verify' || withdrawCodeRemainingSeconds === 0) {
      return
    }

    const timerId = window.setInterval(() => {
      setWithdrawCodeRemainingSeconds((currentSeconds) =>
        Math.max(currentSeconds - 1, 0),
      )
    }, 1000)

    return () => window.clearInterval(timerId)
  }, [withdrawCodeRemainingSeconds, withdrawStep])

  useEffect(() => {
    if (withdrawStep !== 'verify' || withdrawResendRemainingSeconds === 0) {
      return
    }

    const timerId = window.setInterval(() => {
      setWithdrawResendRemainingSeconds((currentSeconds) =>
        Math.max(currentSeconds - 1, 0),
      )
    }, 1000)

    return () => window.clearInterval(timerId)
  }, [withdrawResendRemainingSeconds, withdrawStep])

  const { onSave: onCustomizeSaveRaw, ...customize } = useProfileCustomize({
    isOpen: isCustomizeOpen,
    onEquippedItemsChange: (equippedItems) => {
      setEquippedItemsOverride(equippedItems)
      dispatchProfileSync({ equippedItems })
    },
  })
  
  const handleCustomizeSave = async () => {
    const didSave = await onCustomizeSaveRaw()
  
    if (didSave) {
      setIsCustomizeOpen(false)
    }
  }
  const resetWithdrawalVerificationState = () => {
    setVerificationCode('')
    setWithdrawCodeRemainingSeconds(WITHDRAW_CODE_TIME_LIMIT_SECONDS)
    setWithdrawResendRemainingSeconds(WITHDRAW_CODE_RESEND_DELAY_SECONDS)
  }

  const handleLogout = () => {
    clearAccessToken()
    clearPendingAccessToken()
    navigate('/login', { replace: true })
  }

  const handleOpenWithdrawModal = async () => {
    setWithdrawConfirmText('')
    resetWithdrawalVerificationState()
    setWithdrawStep('acknowledge')
  }

  const handleRequestWithdrawalCode = async () => {
    resetWithdrawalVerificationState()
    setWithdrawStep('verify')

    try {
      await sendWithdrawalVerificationCode()
    } catch {
      window.alert('이메일 인증 요청을 보내지 못했어요')
    }
  }

  const handleResendWithdrawalCode = async () => {
    if (!canResendWithdrawalCode) {
      return
    }

    resetWithdrawalVerificationState()

    try {
      await sendWithdrawalVerificationCode()
    } catch {
      window.alert('이메일 인증 요청을 보내지 못했어요')
    }
  }

  const handleVerifyWithdrawalCode = async () => {
    if (withdrawCodeRemainingSeconds === 0) {
      window.alert('인증 시간이 만료되었어요')
      return
    }

    try {
      await verifyWithdrawalCode(verificationCode)
      setWithdrawStep('confirm')
    } catch {
      window.alert('인증 코드가 올바르지 않아요')
    }
  }

  const handleCompleteWithdrawal = () => {
    clearAccessToken()
    clearPendingAccessToken()
    navigate('/my/withdraw-complete', { replace: true })
  }

  const handleCloseWithdrawModal = () => {
    setWithdrawConfirmText('')
    resetWithdrawalVerificationState()
    setWithdrawStep(null)
  }

  return (
    <S.Page>
      <S.Content>
        <S.ProfileSection>
          <ProfileAvatar
          imageUrl={displayProfile.imageUrl}
          equippedItems={displayProfile.equippedItems}
          size={200}
          />

          <S.ProfileInfo>
            <S.ProfileTextGroup>
            <S.ProfileIdentity>
            {profileTitleText && <S.ProfileTitle>{profileTitleText}</S.ProfileTitle>}
            <S.ProfileName>
              <UserName styleKey={profileNameStyleKey}>
                {displayProfile.name}
              </UserName>
            </S.ProfileName>
            <S.ProfileDescription>{displayProfile.classInfo}</S.ProfileDescription>
            {displayProfile.majors && (
              <S.ProfileDescription>{displayProfile.majors}</S.ProfileDescription>
            )}
            </S.ProfileIdentity>
              <S.ProfileEmail>{profile.email}</S.ProfileEmail>
            </S.ProfileTextGroup>

            <S.ProfileActions>
              {canManageMembers && (
                <S.ActionButton
                  type="button"
                  $variant="secondary"
                  onClick={() => setIsMemberManagementOpen(true)}
                >
                  멤버 관리
                </S.ActionButton>
              )}
              <S.ActionButton
                type="button"
                onClick={() => setIsCustomizeOpen(true)}
              >
                프로필 꾸미기
              </S.ActionButton>
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
          <S.FooterButton type="button" onClick={handleLogout}>
            로그아웃
          </S.FooterButton>
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
          confirmText={withdrawConfirmText}
          onConfirmTextChange={setWithdrawConfirmText}
          verificationCode={verificationCode}
          onVerificationCodeChange={setVerificationCode}
          remainingSeconds={withdrawCodeRemainingSeconds}
          canResendCode={canResendWithdrawalCode}
          onCancel={handleCloseWithdrawModal}
          onNext={
            withdrawStep === 'acknowledge'
              ? handleRequestWithdrawalCode
              : handleVerifyWithdrawalCode
          }
          onResendCode={handleResendWithdrawalCode}
          onWithdraw={handleCompleteWithdrawal}
        />
      )}
      
      {isCustomizeOpen && (
        <StoreProfileCustomizeModal
          categories={customize.categories}
          isActionPending={customize.isActionPending}
          ownedEffects={customize.ownedEffects}
          profile={displayProfile}
          recommendedEffects={customize.recommendedEffects}
          selectedCategory={customize.selectedCategory}
          selectedEffect={customize.selectedEffect}
          onCategorySelect={customize.onCategorySelect}
          onClose={() => setIsCustomizeOpen(false)}
          onEffectSelect={customize.onEffectSelect}
          onGoToStore={() => navigate('/store')}
          onPurchaseOpen={() => navigate('/store')}
          onReset={customize.onReset}
          onSave={handleCustomizeSave}
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
