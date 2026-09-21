import louterLogoImage from '../../assets/images/louter-logo.png'
import switchLogo from '../../assets/svg/switch-logo.svg'
import * as S from './AuthHeader.style'

interface AuthHeaderProps {
  onSwitchClick?: () => void
  isClubCreation?: boolean
  clubLogoPreview?: string
}

export function AuthHeader({
  onSwitchClick,
  isClubCreation = false,
  clubLogoPreview,
}: AuthHeaderProps) {
  const hasClubLogo = isClubCreation && Boolean(clubLogoPreview)

  return (
    <S.Header>
      <S.BrandGroup>
        <S.SwitchLink to="/login" onClick={onSwitchClick}>
          <S.SwitchLogo src={switchLogo} alt="Switch" />
        </S.SwitchLink>
        {(!isClubCreation || hasClubLogo) && (
          <S.CollaborationMark aria-hidden="true">X</S.CollaborationMark>
        )}
        {isClubCreation ? (
          hasClubLogo && (
            <S.PartnerLogo src={clubLogoPreview} alt="동아리 로고 미리보기" />
          )
        ) : (
          <S.PartnerLogo src={louterLogoImage} alt="Louter" />
        )}
      </S.BrandGroup>
    </S.Header>
  )
}
