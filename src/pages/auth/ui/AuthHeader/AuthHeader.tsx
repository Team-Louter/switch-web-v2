import louterLogoImage from '../../assets/images/louter-logo.png'
import switchLogo from '../../assets/svg/switch-logo.svg'
import * as S from './AuthHeader.style'

interface AuthHeaderProps {
  onSwitchClick?: () => void
  isClubCreation?: boolean
  clubLogoPreview?: string
  clubLogoSrc?: string
  clubLoginPath?: string
}

export function AuthHeader({
  onSwitchClick,
  isClubCreation = false,
  clubLogoPreview,
  clubLogoSrc,
  clubLoginPath = '/login',
}: AuthHeaderProps) {
  const hasClubLogo = isClubCreation && Boolean(clubLogoPreview)
  const hasClubBranding = Boolean(clubLogoSrc)

  return (
    <S.Header>
      <S.BrandGroup>
        <S.SwitchLink to={clubLoginPath} onClick={onSwitchClick}>
          <S.SwitchLogo src={switchLogo} alt="Switch" />
        </S.SwitchLink>
        {(!isClubCreation || hasClubLogo || hasClubBranding) && (
          <S.CollaborationMark aria-hidden="true">X</S.CollaborationMark>
        )}
        {hasClubBranding ? (
          <S.PartnerLogo src={clubLogoSrc} alt="동아리 로고" />
        ) : isClubCreation ? (
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
