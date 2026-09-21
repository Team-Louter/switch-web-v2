import louterLogoImage from '../../assets/images/louter-logo.png'
import switchLogo from '../../assets/svg/switch-logo.svg'
import * as S from './AuthIntro.style'

interface AuthIntroProps {
  titleId: string
  title?: string
  subtitle?: string
  useSwitchLogo?: boolean
  compactLogo?: boolean
  logoBelowTitle?: boolean
  showPartnerLogo?: boolean
  partnerLogoSrc?: string
  partnerLogoAlt?: string
}

export function AuthIntro({
  titleId,
  title = 'Louter (라우터)',
  subtitle = '로그인 및 회원가입',
  useSwitchLogo = false,
  compactLogo = false,
  logoBelowTitle = false,
  showPartnerLogo = true,
  partnerLogoSrc,
  partnerLogoAlt,
}: AuthIntroProps) {
  const resolvedPartnerLogoSrc =
    partnerLogoSrc || (useSwitchLogo ? switchLogo : louterLogoImage)
  const isSwitchPartnerLogo = useSwitchLogo && !partnerLogoSrc
  const resolvedPartnerLogoAlt =
    partnerLogoAlt || (isSwitchPartnerLogo ? 'Switch' : 'Louter')
  const partnerLogo = (
    <S.PartnerLogo
      src={resolvedPartnerLogoSrc}
      alt={resolvedPartnerLogoAlt}
      $isSwitchLogo={isSwitchPartnerLogo}
      $isCompactLogo={compactLogo}
    />
  )

  return (
    <S.Intro $logoBelowTitle={logoBelowTitle}>
      {showPartnerLogo && !logoBelowTitle && partnerLogo}
      <S.Copy>
        <S.Title id={titleId}>{title}</S.Title>
        <S.Subtitle>{subtitle}</S.Subtitle>
      </S.Copy>
      {showPartnerLogo && logoBelowTitle && (
        <>
          <S.IntroDivider aria-hidden="true" />
          {partnerLogo}
        </>
      )}
    </S.Intro>
  )
}
