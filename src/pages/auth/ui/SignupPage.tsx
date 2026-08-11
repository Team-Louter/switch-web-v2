import { Turnstile } from '@/features/auth'

import authHeroImage from '../assets/images/auth-hero.jpg'
import { useSignupForm } from '../model/useSignupForm'
import { AuthHeader } from './AuthHeader'
import { AuthIntro } from './AuthIntro'
import * as S from './SignupPage.style'

interface SignupPageProps {
  initialEmail: string
  onChangeEmail: (email: string) => void
}

export function SignupPage({ initialEmail, onChangeEmail }: SignupPageProps) {
  const controller = useSignupForm(initialEmail)
  const {
    values,
    isContinueDisabled,
    turnstileSiteKey,
    handleInputChange,
    handleTurnstileVerify,
    handleTurnstileReset,
  } = controller

  function handleChangeEmail() {
    onChangeEmail(values.email)
  }

  return (
    <S.Page>
      <AuthHeader />
      <S.Content>
        <S.Card aria-labelledby="signup-title">
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
                    <S.Input
                      type="password"
                      name="password"
                      value={values.password}
                      onChange={handleInputChange}
                      aria-label="비밀번호"
                      placeholder="비밀번호"
                      autoComplete="new-password"
                    />
                    <S.Input
                      type="password"
                      name="passwordConfirmation"
                      value={values.passwordConfirmation}
                      onChange={handleInputChange}
                      aria-label="비밀번호 확인"
                      placeholder="비밀번호 확인"
                      autoComplete="new-password"
                    />
                    <S.Input
                      type="text"
                      name="clubCode"
                      value={values.clubCode}
                      onChange={handleInputChange}
                      aria-label="동아리 코드"
                      placeholder="동아리 코드"
                      autoComplete="off"
                    />

                    {turnstileSiteKey ? (
                      <Turnstile
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
                  </S.AdditionalFields>
                </S.Fields>
              </S.FormOptions>

              <S.ActionArea>
                <S.ContinueButton type="button" disabled={isContinueDisabled}>
                  계속
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
    </S.Page>
  )
}
