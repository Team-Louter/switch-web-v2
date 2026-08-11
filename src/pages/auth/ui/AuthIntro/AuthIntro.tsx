import louterLogoImage from '../../assets/images/louter-logo.png'
import * as S from './AuthIntro.style'

interface AuthIntroProps {
  titleId: string
}

export function AuthIntro({ titleId }: AuthIntroProps) {
  return (
    <S.Intro>
      <S.PartnerLogo src={louterLogoImage} alt="" />
      <S.Copy>
        <S.Title id={titleId}>Louter (라우터)</S.Title>
        <S.Subtitle>로그인 및 회원가입</S.Subtitle>
      </S.Copy>
    </S.Intro>
  )
}
