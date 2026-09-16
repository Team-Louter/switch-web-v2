import { useEffect, useState } from 'react'
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

const WITHDRAW_CODE_TIME_LIMIT_SECONDS = 120
const WITHDRAW_CODE_RESEND_DELAY_SECONDS = 30

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
  const [withdrawCodeRemainingSeconds, setWithdrawCodeRemainingSeconds] =
    useState(WITHDRAW_CODE_TIME_LIMIT_SECONDS)
  const [withdrawResendRemainingSeconds, setWithdrawResendRemainingSeconds] =
    useState(WITHDRAW_CODE_RESEND_DELAY_SECONDS)
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

  const handleOpenWithdrawModal = () => {
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
          canResendCode={canResendWithdrawalCode}
          confirmText={withdrawConfirmText}
          onCancel={handleCloseWithdrawModal}
          onConfirmTextChange={setWithdrawConfirmText}
          onNext={
            withdrawStep === 'acknowledge'
              ? handleRequestWithdrawalCode
              : handleVerifyWithdrawalCode
          }
          onResendCode={handleResendWithdrawalCode}
          onVerificationCodeChange={setVerificationCode}
          onWithdraw={handleCompleteWithdrawal}
          remainingSeconds={withdrawCodeRemainingSeconds}
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
