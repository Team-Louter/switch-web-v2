import louterLogoImage from '../../assets/images/louter-logo.png'
import switchLogo from '../../assets/svg/switch-logo.svg'
import * as S from './AuthHeader.style'

interface AuthHeaderProps {
  onSwitchClick?: () => void
  isClubCreation?: boolean
}

export function AuthHeader({
  onSwitchClick,
  isClubCreation = false,
}: AuthHeaderProps) {
  return (
    <S.Header>
      <S.BrandGroup>
        <S.SwitchLink to="/login" onClick={onSwitchClick}>
          <S.SwitchLogo src={switchLogo} alt="Switch" />
        </S.SwitchLink>
        {!isClubCreation && (
          <S.CollaborationMark aria-hidden="true">X</S.CollaborationMark>
        )}
        {!isClubCreation && (
          <S.PartnerLogo src={louterLogoImage} alt="Louter" />
        )}
      </S.BrandGroup>
    </S.Header>
  )
}
