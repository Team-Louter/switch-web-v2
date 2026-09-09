import { useState } from 'react'
import type { FormEvent } from 'react'
import { FiEye, FiEyeOff } from 'react-icons/fi'

import { startGoogleLogin, Turnstile } from '@/features/auth'

import googleLogo from '../../assets/svg/google-logo.svg'
import type { LoginFormController } from '../../model/useLoginForm'
import * as S from './LoginForm.style'

interface LoginFormProps {
  controller: LoginFormController
}

export function LoginForm({ controller }: LoginFormProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const {
    email,
    password,
    isPasswordStep,
    isSubmitting,
    isContinueDisabled,
    emailValidationMessage,
    loginValidationMessage,
    turnstileSiteKey,
    turnstileKey,
    handleEmailChange,
    handlePasswordChange,
    handleContinue,
    handleChangeEmail,
    handleTurnstileVerify,
    handleTurnstileReset,
  } = controller
  const hasEmailValidationError = Boolean(emailValidationMessage)
  const hasLoginValidationError = Boolean(loginValidationMessage)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    void handleContinue()
  }

  return (
    <S.Form onSubmit={handleSubmit} noValidate>
      <S.Options>
        <S.GoogleButton type="button" onClick={startGoogleLogin}>
          <S.GoogleLogo src={googleLogo} alt="" />
          Google으로 계속하기
        </S.GoogleButton>

        <S.Divider aria-hidden="true">
          <S.DividerLine />
          <S.DividerText>또는</S.DividerText>
          <S.DividerLine />
        </S.Divider>

        <S.EmailGroup>
          <S.Fields>
            <S.EmailField data-auth-email-field>
              <S.EmailInput
                type="email"
                name="email"
                value={email}
                onChange={handleEmailChange}
                aria-label="이메일"
                placeholder="이메일을 입력해주세요"
                autoComplete="email"
                readOnly={isPasswordStep || isSubmitting}
                $hasError={hasEmailValidationError}
                aria-invalid={hasEmailValidationError}
                aria-describedby={
                  hasEmailValidationError
                    ? 'login-email-validation'
                    : undefined
                }
              />
              <S.ChangeEmailButton
                type="button"
                $isVisible={isPasswordStep}
                onClick={() => {
                  setIsPasswordVisible(false)
                  handleChangeEmail()
                }}
                aria-hidden={!isPasswordStep}
                tabIndex={isPasswordStep ? 0 : -1}
              >
                변경
              </S.ChangeEmailButton>
            </S.EmailField>

            <S.ValidationMessageSlot
              $isVisible={hasEmailValidationError}
              aria-hidden={!hasEmailValidationError}
            >
              <S.ValidationMessage
                id="login-email-validation"
                $isVisible={hasEmailValidationError}
                role={hasEmailValidationError ? 'alert' : undefined}
              >
                {emailValidationMessage}
              </S.ValidationMessage>
            </S.ValidationMessageSlot>

            <S.PasswordFieldSlot
              $isVisible={isPasswordStep}
              aria-hidden={!isPasswordStep}
            >
              <S.PasswordFieldMotion $isVisible={isPasswordStep}>
                <S.PasswordField>
                  <S.PasswordInput
                    type={isPasswordVisible ? 'text' : 'password'}
                    name="password"
                    value={password}
                    onChange={handlePasswordChange}
                    aria-label="비밀번호"
                    placeholder="비밀번호를 입력해주세요"
                    autoComplete="current-password"
                    disabled={!isPasswordStep}
                    tabIndex={isPasswordStep ? 0 : -1}
                    $hasError={hasLoginValidationError}
                    aria-invalid={hasLoginValidationError}
                    aria-describedby={
                      hasLoginValidationError
                        ? 'login-password-validation'
                        : undefined
                    }
                  />
                  {password.length > 0 && (
                    <S.PasswordVisibilityButton
                      type="button"
                      aria-label={isPasswordVisible ? '비밀번호 숨기기' : '비밀번호 표시'}
                      disabled={!isPasswordStep}
                      tabIndex={isPasswordStep ? 0 : -1}
                      onClick={() => setIsPasswordVisible((visible) => !visible)}
                    >
                      {isPasswordVisible ? <FiEyeOff aria-hidden="true" size={18} /> : <FiEye aria-hidden="true" size={18} />}
                    </S.PasswordVisibilityButton>
                  )}
                </S.PasswordField>
              </S.PasswordFieldMotion>
            </S.PasswordFieldSlot>

            <S.ValidationMessageSlot
              $isVisible={hasLoginValidationError}
              aria-hidden={!hasLoginValidationError}
            >
              <S.ValidationMessage
                id="login-password-validation"
                $isVisible={hasLoginValidationError}
                role={hasLoginValidationError ? 'alert' : undefined}
              >
                {loginValidationMessage}
              </S.ValidationMessage>
            </S.ValidationMessageSlot>
          </S.Fields>

          {turnstileSiteKey ? (
            <Turnstile
              key={turnstileKey}
              siteKey={turnstileSiteKey}
              action="login"
              onVerify={handleTurnstileVerify}
              onExpire={handleTurnstileReset}
              onError={handleTurnstileReset}
            />
          ) : (
            <S.TurnstileConfigMessage role="alert">
              보안 인증 설정이 필요합니다
            </S.TurnstileConfigMessage>
          )}
        </S.EmailGroup>
      </S.Options>

      <S.ActionArea>
        <S.ContinueButton
          type="submit"
          disabled={isContinueDisabled}
          aria-busy={isSubmitting}
        >
          <S.ButtonContent>
            {isSubmitting && <S.LoadingSpinner aria-hidden="true" />}
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
    </S.Form>
  )
}
