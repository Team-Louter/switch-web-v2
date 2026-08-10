import louterLogoImage from '../assets/images/louter-logo.png'
import switchLogo from '../assets/svg/switch-logo.svg'
import * as S from './AuthHeader.style'

export function AuthHeader() {
  return (
    <S.Header>
      <S.BrandGroup>
        <S.SwitchLogo src={switchLogo} alt="Switch" />
        <S.CollaborationMark aria-hidden="true">X</S.CollaborationMark>
        <S.PartnerLogo src={louterLogoImage} alt="Louter" />
      </S.BrandGroup>
    </S.Header>
  )
}
