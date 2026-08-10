import { Turnstile } from '@/features/auth'

import type { LoginFormController } from '../model/useLoginForm'
import googleLogo from '../assets/svg/google-logo.svg'
import * as S from './LoginForm.style'

interface LoginFormProps {
  controller: LoginFormController
}

export function LoginForm({ controller }: LoginFormProps) {
  const {
    email,
    password,
    isPasswordStep,
    isCheckingEmail,
    isContinueDisabled,
    emailValidationMessage,
    turnstileSiteKey,
    handleEmailChange,
    handlePasswordChange,
    handleContinue,
    handleChangeEmail,
    handleTurnstileVerify,
    handleTurnstileReset,
  } = controller
  const hasEmailValidationError = Boolean(emailValidationMessage)

  return (
    <>
      <S.Options>
        <S.GoogleButton type="button">
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
            <S.EmailField>
              <S.EmailInput
                type="email"
                name="email"
                value={email}
                onChange={handleEmailChange}
                aria-label="이메일"
                placeholder="이메일을 입력해주세요"
                autoComplete="email"
                readOnly={isPasswordStep || isCheckingEmail}
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
                onClick={handleChangeEmail}
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
                <S.PasswordInput
                  type="password"
                  name="password"
                  value={password}
                  onChange={handlePasswordChange}
                  aria-label="비밀번호"
                  placeholder="비밀번호를 입력해주세요"
                  autoComplete="current-password"
                  disabled={!isPasswordStep}
                  tabIndex={isPasswordStep ? 0 : -1}
                />
              </S.PasswordFieldMotion>
            </S.PasswordFieldSlot>
          </S.Fields>

          {turnstileSiteKey ? (
            <Turnstile
              key="turnstile"
              siteKey={turnstileSiteKey}
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
          type="button"
          disabled={isContinueDisabled}
          onClick={handleContinue}
          aria-busy={isCheckingEmail}
        >
          <S.ButtonContent>
            {isCheckingEmail && <S.LoadingSpinner aria-hidden="true" />}
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
    </>
  )
}
