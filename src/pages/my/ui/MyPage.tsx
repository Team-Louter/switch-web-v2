import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  clearAccessToken,
  clearPendingAccessToken,
} from '@/shared/lib/authToken'

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

  const handleCloseWithdrawModal = () => {
    setWithdrawConfirmText('')
    resetWithdrawalVerificationState()
    setWithdrawStep(null)
  }

  return (
    <S.Page>
      <S.Content>
        <S.ProfileSection>
          <S.ProfileImageWrap>
            {profile.imageUrl && <S.ProfileImage src={profile.imageUrl} alt="" />}
          </S.ProfileImageWrap>

          <S.ProfileInfo>
            <S.ProfileTextGroup>
              <S.ProfileIdentity>
                <S.ProfileName>{profile.name}</S.ProfileName>
                <S.ProfileDescription>{profile.classInfo}</S.ProfileDescription>
                {profile.majors && (
                  <S.ProfileDescription>{profile.majors}</S.ProfileDescription>
                )}
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
