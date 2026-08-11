import type { FormEvent } from 'react'

import { Turnstile } from '@/features/auth'

import authHeroImage from '../../assets/images/auth-hero.jpg'
import { useGoogleExtraSignupForm } from '../../model/useGoogleExtraSignupForm'
import { AuthHeader } from '../AuthHeader'
import { AuthIntro } from '../AuthIntro'
import * as S from './GoogleExtraSignupPage.style'

export function GoogleExtraSignupPage() {
  const controller = useGoogleExtraSignupForm()
  const {
    values,
    isSubmitting,
    isSubmitDisabled,
    turnstileSiteKey,
    turnstileKey,
    handleInputChange,
    handleSubmit,
    handleCancel,
    handleTurnstileVerify,
    handleTurnstileReset,
  } = controller

  function handleFormSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    void handleSubmit()
  }

  return (
    <S.Page>
      <AuthHeader onSwitchClick={handleCancel} />
      <S.Content>
        <S.Card aria-labelledby="google-extra-signup-title">
          <S.Hero>
            <S.HeroImage
              src={authHeroImage}
              alt="Louter 캐릭터들이 함께 뛰어노는 모습"
            />
          </S.Hero>

          <S.Panel>
            <S.PanelContent>
              <AuthIntro titleId="google-extra-signup-title" />

              <S.Form onSubmit={handleFormSubmit} noValidate>
                <S.FormOptions>
                  <S.Divider aria-hidden="true" />
                  <S.Fields>
                    <S.Input
                      type="text"
                      name="studentNumber"
                      value={values.studentNumber}
                      onChange={handleInputChange}
                      aria-label="학번"
                      placeholder="학번"
                      inputMode="numeric"
                      autoComplete="off"
                      disabled={isSubmitting}
                      autoFocus
                    />
                    <S.Input
                      type="text"
                      name="name"
                      value={values.name}
                      onChange={handleInputChange}
                      aria-label="이름"
                      placeholder="이름"
                      autoComplete="name"
                      disabled={isSubmitting}
                    />
                    <S.Input
                      type="text"
                      name="clubCode"
                      value={values.clubCode}
                      onChange={handleInputChange}
                      aria-label="동아리 코드"
                      placeholder="동아리 코드"
                      autoComplete="off"
                      disabled={isSubmitting}
                    />

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
                      <S.TurnstileConfigMessage role="status">
                        보안 인증 설정이 필요합니다
                      </S.TurnstileConfigMessage>
                    )}
                  </S.Fields>
                </S.FormOptions>

                <S.ActionArea>
                  <S.ContinueButton
                    type="submit"
                    disabled={isSubmitDisabled}
                    aria-busy={isSubmitting}
                  >
                    <S.ButtonContent>
                      {isSubmitting && (
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
              </S.Form>
            </S.PanelContent>
          </S.Panel>
        </S.Card>
      </S.Content>
    </S.Page>
  )
}
