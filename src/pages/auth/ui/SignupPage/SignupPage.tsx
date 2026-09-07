import { useState } from 'react'
import type { AnimationEvent } from 'react'
import { FiEye, FiEyeOff } from 'react-icons/fi'

import { Turnstile } from '@/features/auth'

import authHeroImage from '../../assets/images/auth-hero.jpg'
import { useSignupForm } from '../../model/useSignupForm'
import { AuthHeader } from '../AuthHeader'
import { AuthIntro } from '../AuthIntro'
import { EmailVerificationModal } from '../EmailVerificationModal'
import * as S from './SignupPage.style'

interface SignupPageProps {
  initialEmail: string
  onChangeEmail: (email: string) => void
  onSignupComplete: (email: string) => void
  shouldAnimate?: boolean
}

export function SignupPage({
  initialEmail,
  onChangeEmail,
  onSignupComplete,
  shouldAnimate = false,
}: SignupPageProps) {
  const [isReturningToLogin, setIsReturningToLogin] = useState(false)
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [isPasswordConfirmationVisible, setIsPasswordConfirmationVisible] = useState(false)
  const controller = useSignupForm(initialEmail, onSignupComplete)
  const {
    values,
    verificationCode,
    clubCodeValidationMessage,
    isContinueDisabled,
    isSendingVerificationCode,
    isVerificationOpen,
    isVerificationSubmitting,
    isResendingVerificationCode,
    isResendVerificationReady,
    turnstileSiteKey,
    turnstileKey,
    resendTurnstileKey,
    handleInputChange,
    handleContinue,
    handleVerificationCodeChange,
    handleVerificationClose,
    handleVerificationSubmit,
    handleResendVerificationCode,
    handleTurnstileVerify,
    handleTurnstileReset,
    handleResendTurnstileVerify,
    handleResendTurnstileReset,
  } = controller
  const hasClubCodeValidationError = Boolean(
    clubCodeValidationMessage,
  )

  function handleChangeEmail() {
    if (isReturningToLogin) {
      return
    }

    if (
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      window.matchMedia('(max-width: 420px)').matches
    ) {
      onChangeEmail(values.email)
      return
    }

    setIsReturningToLogin(true)
  }

  function handleCardAnimationEnd(event: AnimationEvent<HTMLElement>) {
    if (!isReturningToLogin || event.target !== event.currentTarget) {
      return
    }

    onChangeEmail(values.email)
  }

  return (
    <S.Page
      $shouldAnimate={shouldAnimate}
      $isReturningToLogin={isReturningToLogin}
      data-returning-to-login={isReturningToLogin}
    >
      <AuthHeader />
      <S.Content>
        <S.Card
          aria-labelledby="signup-title"
          onAnimationEnd={handleCardAnimationEnd}
        >
          <S.Hero>
            <S.HeroImage
              src={authHeroImage}
              alt="Louter 캐릭터들이 함께 뛰어노는 모습"
            />
          </S.Hero>

          <S.Panel>
            <S.PanelContent>
              <AuthIntro titleId="signup-title" />

              <S.FormOptions>
                <S.Divider aria-hidden="true" />
                <S.Fields>
                  <S.EmailField>
                    <S.SignupEmailInput
                      type="email"
                      name="email"
                      value={values.email}
                      aria-label="이메일"
                      autoComplete="email"
                      readOnly
                    />
                    <S.ChangeEmailButton
                      type="button"
                      $isVisible
                      onClick={handleChangeEmail}
                      disabled={
                        isReturningToLogin || isSendingVerificationCode
                      }
                    >
                      변경
                    </S.ChangeEmailButton>
                  </S.EmailField>

                  <S.AdditionalFields>
                    <S.Input
                      type="text"
                      name="studentNumber"
                      value={values.studentNumber}
                      onChange={handleInputChange}
                      aria-label="학번"
                      placeholder="학번"
                      inputMode="numeric"
                      autoComplete="off"
                    />
                    <S.Input
                      type="text"
                      name="name"
                      value={values.name}
                      onChange={handleInputChange}
                      aria-label="이름"
                      placeholder="이름"
                      autoComplete="name"
                    />
                    <S.PasswordField>
                      <S.PasswordInput
                        type={isPasswordVisible ? 'text' : 'password'}
                        name="password"
                        value={values.password}
                        onChange={handleInputChange}
                        aria-label="비밀번호"
                        placeholder="비밀번호"
                        autoComplete="new-password"
                      />
                      <S.PasswordVisibilityButton
                        type="button"
                        aria-label={
                          isPasswordVisible ? '비밀번호 숨기기' : '비밀번호 표시'
                        }
                        onClick={() => setIsPasswordVisible((visible) => !visible)}
                      >
                        {isPasswordVisible ? (
                          <FiEyeOff aria-hidden="true" size={18} />
                        ) : (
                          <FiEye aria-hidden="true" size={18} />
                        )}
                      </S.PasswordVisibilityButton>
                    </S.PasswordField>
                    <S.PasswordField>
                      <S.PasswordInput
                        type={isPasswordConfirmationVisible ? 'text' : 'password'}
                        name="passwordConfirmation"
                        value={values.passwordConfirmation}
                        onChange={handleInputChange}
                        aria-label="비밀번호 확인"
                        placeholder="비밀번호 확인"
                        autoComplete="new-password"
                      />
                      <S.PasswordVisibilityButton
                        type="button"
                        aria-label={
                          isPasswordConfirmationVisible ? '비밀번호 확인 숨기기' : '비밀번호 확인 표시'
                        }
                        onClick={() => setIsPasswordConfirmationVisible((visible) => !visible)}
                      >
                        {isPasswordConfirmationVisible ? (
                          <FiEyeOff aria-hidden="true" size={18} />
                        ) : (
                          <FiEye aria-hidden="true" size={18} />
                        )}
                      </S.PasswordVisibilityButton>
                    </S.PasswordField>
                    <S.ClubCodeField>
                      <S.Input
                        type="text"
                        name="clubCode"
                        value={values.clubCode}
                        onChange={handleInputChange}
                        aria-label="동아리 코드"
                        placeholder="동아리 코드"
                        autoComplete="off"
                        $hasError={hasClubCodeValidationError}
                        aria-invalid={hasClubCodeValidationError}
                        aria-describedby={
                          hasClubCodeValidationError
                            ? 'signup-club-code-validation'
                            : undefined
                        }
                      />
                      <S.ClubCodeValidationMessageSlot
                        $isVisible={hasClubCodeValidationError}
                        aria-hidden={!hasClubCodeValidationError}
                      >
                        <S.ClubCodeValidationMessage
                          id="signup-club-code-validation"
                          $isVisible={hasClubCodeValidationError}
                          role={
                            hasClubCodeValidationError
                              ? 'alert'
                              : undefined
                          }
                        >
                          {clubCodeValidationMessage}
                        </S.ClubCodeValidationMessage>
                      </S.ClubCodeValidationMessageSlot>
                    </S.ClubCodeField>

                    {turnstileSiteKey ? (
                      <Turnstile
                        key={turnstileKey}
                        siteKey={turnstileSiteKey}
                        action="email_verification"
                        onVerify={handleTurnstileVerify}
                        onExpire={handleTurnstileReset}
                        onError={handleTurnstileReset}
                      />
                    ) : (
                      <S.TurnstileConfigMessage role="alert">
                        보안 인증 설정이 필요합니다
                      </S.TurnstileConfigMessage>
                    )}
                  </S.AdditionalFields>
                </S.Fields>
              </S.FormOptions>

              <S.ActionArea>
                <S.ContinueButton
                  type="button"
                  onClick={() => void handleContinue()}
                  disabled={isContinueDisabled}
                  aria-busy={isSendingVerificationCode}
                >
                  <S.ButtonContent>
                    {isSendingVerificationCode && (
                      <S.LoadingSpinner aria-hidden="true" />
                    )}
                    <span>계속</span>
                  </S.ButtonContent>
                </S.ContinueButton>
                <S.Footer>
                  <S.PolicyLinks>
                    <span>서비스 이용약관</span>
                    <span>개인정보 처리방침</span>
                  </S.PolicyLinks>
                  <S.Team>Team. Louter</S.Team>
                </S.Footer>
              </S.ActionArea>
            </S.PanelContent>
          </S.Panel>
        </S.Card>
      </S.Content>

      {isVerificationOpen && (
        <EmailVerificationModal
          code={verificationCode}
          isSubmitting={isVerificationSubmitting}
          isResending={isResendingVerificationCode}
          isResendReady={isResendVerificationReady}
          turnstileSiteKey={turnstileSiteKey}
          turnstileKey={resendTurnstileKey}
          onChangeCode={handleVerificationCodeChange}
          onClose={handleVerificationClose}
          onResend={handleResendVerificationCode}
          onSubmit={handleVerificationSubmit}
          onTurnstileVerify={handleResendTurnstileVerify}
          onTurnstileReset={handleResendTurnstileReset}
        />
      )}
    </S.Page>
  )
}
