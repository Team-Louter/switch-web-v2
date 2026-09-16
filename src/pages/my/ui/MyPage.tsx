import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { clearAccessToken, clearPendingAccessToken } from '@/shared/lib/authToken'

import {
  sendWithdrawalVerificationCode,
  verifyWithdrawalCode,
} from '../api'
import { useMyPage } from '../model/useMyPage'
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

  const canManageMembers = profile.role === 'LEADER'

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
            onLogout={handleLogout}
            onMemberManage={
              canManageMembers
                ? () => setIsMemberManagementOpen(true)
                : undefined
            }
            onWithdraw={handleOpenWithdrawModal}
            profile={profile}
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

      {memberActionToastMessage && (
        <MemberActionToast
          message={memberActionToastMessage}
          onClose={() => setMemberActionToastMessage('')}
        />
      )}
    </S.Page>
  )
}
