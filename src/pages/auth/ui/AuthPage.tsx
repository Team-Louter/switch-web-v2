import humanVerificationImage from '../assets/images/human-verification.png'
import loginHeroImage from '../assets/images/login-hero.png'
import louterLogoImage from '../assets/images/louter-logo.png'
import googleLogo from '../assets/svg/google-logo.svg'
import switchLogo from '../assets/svg/switch-logo.svg'
import * as S from './AuthPage.style'

export function AuthPage() {
  return (
    <S.Page>
      <S.Header>
        <S.BrandGroup>
          <S.SwitchLogo src={switchLogo} alt="Switch" />
          <S.CollaborationMark aria-hidden="true">X</S.CollaborationMark>
          <S.HeaderPartnerLogo src={louterLogoImage} alt="Louter" />
        </S.BrandGroup>
      </S.Header>

      <S.Content>
        <S.LoginCard aria-labelledby="login-title">
          <S.Hero>
            <S.HeroImage
              src={loginHeroImage}
              alt="Louter 캐릭터들이 함께 노는 모습"
            />
          </S.Hero>

          <S.LoginPanel>
            <S.PanelContent>
              <S.Intro>
                <S.PartnerLogo src={louterLogoImage} alt="" />
                <S.IntroCopy>
                  <S.Title id="login-title">Louter (라우터)</S.Title>
                  <S.Subtitle>로그인 및 회원가입</S.Subtitle>
                </S.IntroCopy>
              </S.Intro>

              <S.LoginOptions>
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
                  <S.EmailInput
                    type="email"
                    name="email"
                    aria-label="이메일"
                    placeholder="이메일을 입력해주세요"
                    autoComplete="email"
                  />
                  <S.VerificationImage
                    src={humanVerificationImage}
                    alt="사람인지 확인하는 인증 화면"
                  />
                </S.EmailGroup>
              </S.LoginOptions>

              <S.ActionArea>
                <S.ContinueButton type="button" disabled>
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
          </S.LoginPanel>
        </S.LoginCard>
      </S.Content>
    </S.Page>
  )
}
