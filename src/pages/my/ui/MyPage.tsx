import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import type { EquippedItemsResponse } from '@/entities/store'
import { clearAccessToken, clearPendingAccessToken } from '@/shared/lib/authToken'
import { dispatchProfileSync } from '@/shared/lib/profileSync'

import {
  sendWithdrawalVerificationCode,
  verifyWithdrawalCode,
} from '../api'
import { useMyPage } from '../model/useMyPage'
import { useProfileCustomize } from '@/pages/store/model/useProfileCustomize'
import { StoreProfileCustomizeModal } from '@/pages/store/ui/components/StoreProfileCustomizeModal'
import {
  MemberActionToast,
  MemberManagementModal,
  ProfileEditModal,
  ProfileHeader,
  ProfilePostList,
  WithdrawModal,
} from './components'
import * as S from './MyPage.style'
import type { WithdrawModalStep } from './components'

export function MyPage() {
  const navigate = useNavigate()
  const [withdrawStep, setWithdrawStep] = useState<WithdrawModalStep | null>(
    null,
  )
  const [isMemberManagementOpen, setIsMemberManagementOpen] = useState(false)
  const [isProfileEditOpen, setIsProfileEditOpen] = useState(false)
  const [memberActionToastMessage, setMemberActionToastMessage] = useState('')
  const [withdrawConfirmText, setWithdrawConfirmText] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [isRequestingWithdrawalCode, setIsRequestingWithdrawalCode] =
    useState(false)
  const [isWithdrawing, setIsWithdrawing] = useState(false)
  const [isProfileCustomizeOpen, setIsProfileCustomizeOpen] = useState(false)
  const [equippedItemsOverride, setEquippedItemsOverride] = useState<
    EquippedItemsResponse | undefined
  >(undefined)
  const {
    activeTabId,
    activityTabs,
    applyProfileUpdate,
    emptyMessage,
    hasMore,
    isFetchingMore,
    isLoading,
    isProfileLoading,
    loadMore,
    posts,
    profile,
    setActiveTabId,
  } = useMyPage()

  const profileForDisplay = equippedItemsOverride
    ? { ...profile, equippedItems: equippedItemsOverride }
    : profile
  const canManageMembers = profile.role === 'LEADER'

  const { onSave: saveProfileCustomize, ...profileCustomize } =
    useProfileCustomize({
      isOpen: isProfileCustomizeOpen,
      onEquippedItemsChange: (equippedItems) => {
        setEquippedItemsOverride(equippedItems)
        dispatchProfileSync({ equippedItems })
      },
    })

  const handleProfileCustomizeSave = async () => {
    const didSave = await saveProfileCustomize()

    if (didSave) {
      setIsProfileCustomizeOpen(false)
    }
  }

  const resetWithdrawalVerificationState = () => {
    setVerificationCode('')
    setIsRequestingWithdrawalCode(false)
    setIsWithdrawing(false)
  }

  const handleLogout = () => {
    clearAccessToken()
    clearPendingAccessToken()
    navigate('/login', { replace: true })
  }

  const handleOpenWithdrawModal = () => {
    setWithdrawConfirmText('')
    resetWithdrawalVerificationState()
    setWithdrawStep('acknowledge')
  }

  const handleRequestWithdrawalCode = async () => {
    resetWithdrawalVerificationState()
    setWithdrawStep('verify')
    setIsRequestingWithdrawalCode(true)

    try {
      await sendWithdrawalVerificationCode()
    } catch {
      window.alert('이메일 인증 요청을 보내지 못했어요')
      setWithdrawStep(null)
    } finally {
      setIsRequestingWithdrawalCode(false)
    }
  }

  const handleResendWithdrawalCode = async () => {
    if (isRequestingWithdrawalCode) {
      return
    }

    setVerificationCode('')
    setIsRequestingWithdrawalCode(true)

    try {
      await sendWithdrawalVerificationCode()
    } catch {
      window.alert('이메일 인증 요청을 보내지 못했어요')
      setWithdrawStep(null)
    } finally {
      setIsRequestingWithdrawalCode(false)
    }
  }

  const handleShowWithdrawalConfirm = () => {
    if (verificationCode.length === 6) {
      setWithdrawStep('confirm')
    }
  }

  const handleCompleteWithdrawal = async () => {
    if (isWithdrawing) {
      return
    }

    try {
      setIsWithdrawing(true)
      await verifyWithdrawalCode(verificationCode)
      clearAccessToken()
      clearPendingAccessToken()
      navigate('/my/withdraw-complete', { replace: true })
    } catch {
      window.alert('인증 코드가 올바르지 않아요')
      handleCloseWithdrawModal()
    } finally {
      setIsWithdrawing(false)
    }
  }

  const handleCloseWithdrawModal = () => {
    setWithdrawConfirmText('')
    resetWithdrawalVerificationState()
    setWithdrawStep(null)
  }

  return (
    <S.Page>
      <S.Content>
        <S.Card>
          <ProfileHeader
            activityTabs={activityTabs}
            isLoading={isProfileLoading}
            onEdit={() => setIsProfileEditOpen(true)}
            onCustomize={() => setIsProfileCustomizeOpen(true)}
            onLogout={handleLogout}
            onMemberManage={
              canManageMembers
                ? () => setIsMemberManagementOpen(true)
                : undefined
            }
            onWithdraw={handleOpenWithdrawModal}
            profile={profileForDisplay}
          />

          <ProfilePostList
            activeTabId={activeTabId}
            emptyMessage={emptyMessage}
            hasMore={hasMore}
            isFetchingMore={isFetchingMore}
            isLoading={isLoading}
            loadMore={loadMore}
            onChangeTab={setActiveTabId}
            onPostClick={(post) => navigate(`/community/${post.communityPostId}`)}
            posts={posts}
            tabs={activityTabs}
          />
        </S.Card>
      </S.Content>

      {withdrawStep && (
        <WithdrawModal
          confirmText={withdrawConfirmText}
          isRequestingCode={isRequestingWithdrawalCode}
          isWithdrawing={isWithdrawing}
          onBack={() => setWithdrawStep('verify')}
          onCancel={handleCloseWithdrawModal}
          onConfirmTextChange={setWithdrawConfirmText}
          onNext={
            withdrawStep === 'acknowledge'
              ? handleRequestWithdrawalCode
              : handleShowWithdrawalConfirm
          }
          onResendCode={handleResendWithdrawalCode}
          onVerificationCodeChange={setVerificationCode}
          onWithdraw={handleCompleteWithdrawal}
          step={withdrawStep}
          verificationCode={verificationCode}
        />
      )}

      {isMemberManagementOpen && (
        <MemberManagementModal
          onClose={() => setIsMemberManagementOpen(false)}
          onComplete={setMemberActionToastMessage}
        />
      )}

      {isProfileEditOpen && (
        <ProfileEditModal
          onClose={() => setIsProfileEditOpen(false)}
          onUpdated={applyProfileUpdate}
        />
      )}

      {isProfileCustomizeOpen && (
        <StoreProfileCustomizeModal
          categories={profileCustomize.categories}
          errorMessage={profileCustomize.errorMessage}
          isActionPending={profileCustomize.isActionPending}
          isLoading={profileCustomize.isLoading}
          ownedEffects={profileCustomize.ownedEffects}
          profile={profileForDisplay}
          recommendedEffects={profileCustomize.recommendedEffects}
          selectedCategory={profileCustomize.selectedCategory}
          selectedEffect={profileCustomize.selectedEffect}
          selectedEffectsByCategory={profileCustomize.selectedEffectsByCategory}
          onCategorySelect={profileCustomize.onCategorySelect}
          onClose={() => setIsProfileCustomizeOpen(false)}
          onEffectSelect={profileCustomize.onEffectSelect}
          onGoToStore={(category) => {
            setIsProfileCustomizeOpen(false)
            navigate(`/store?category=${encodeURIComponent(category)}`)
          }}
          onReset={profileCustomize.onReset}
          onSave={handleProfileCustomizeSave}
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
