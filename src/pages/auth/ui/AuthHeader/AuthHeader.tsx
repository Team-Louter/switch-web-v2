import louterLogoImage from '../../assets/images/louter-logo.png'
import switchLogo from '../../assets/svg/switch-logo.svg'
import * as S from './AuthHeader.style'

interface AuthHeaderProps {
  onSwitchClick?: () => void
}

export function AuthHeader({ onSwitchClick }: AuthHeaderProps) {
  return (
    <S.Header>
      <S.BrandGroup>
        <S.SwitchLink to="/login" onClick={onSwitchClick}>
          <S.SwitchLogo src={switchLogo} alt="Switch" />
        </S.SwitchLink>
        <S.CollaborationMark aria-hidden="true">X</S.CollaborationMark>
        <S.PartnerLogo src={louterLogoImage} alt="Louter" />
      </S.BrandGroup>
    </S.Header>
  )
}
