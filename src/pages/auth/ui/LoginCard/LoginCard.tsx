import authHeroImage from '../../assets/images/auth-hero.jpg'
import type { ClubApplication, ClubApplicationInput } from '@/entities/club'
import { useLoginForm } from '../../model/useLoginForm'
import { LoginPanel } from '../LoginPanel'
import * as S from './LoginCard.style'

const PASSWORD_STEP_HEIGHT_OFFSET = 48
const VALIDATION_MESSAGE_HEIGHT_OFFSET = 24

interface LoginCardProps {
  initialEmail?: string
  returnPath?: string
  authPath?: string
  authTransitionSessionId?: string
  hideHeroImage?: boolean
  useSwitchLogo?: boolean
  requiresTurnstile?: boolean
  title?: string
  subtitle?: string
  isClubCreation?: boolean
  onClubCreateSubmit?: (values: ClubApplicationInput) => void
  clubProfile?: ClubApplication
  heroImage?: string
  heroImageAlt?: string
  representativeImagePreview?: string
  onClubLogoPreviewChange?: (preview: string) => void
  onRepresentativeImagePreviewChange?: (preview: string) => void
}

function getHeightOffset(
  isPasswordStep: boolean,
  emailValidationMessage: string,
  loginValidationMessage: string,
): number {
  if (isPasswordStep) {
    return (
      PASSWORD_STEP_HEIGHT_OFFSET +
      (loginValidationMessage ? VALIDATION_MESSAGE_HEIGHT_OFFSET : 0)
    )
  }

  return emailValidationMessage ? VALIDATION_MESSAGE_HEIGHT_OFFSET : 0
}

export function LoginCard({
  initialEmail = '',
  returnPath = '/home',
  authPath = '/login',
  authTransitionSessionId = '',
  hideHeroImage = false,
  useSwitchLogo = false,
  requiresTurnstile = true,
  title,
  subtitle,
  isClubCreation = false,
  onClubCreateSubmit,
  clubProfile,
  heroImage,
  heroImageAlt = 'Louter 캐릭터들이 함께 노는 모습',
  representativeImagePreview,
  onClubLogoPreviewChange,
  onRepresentativeImagePreviewChange,
}: LoginCardProps) {
  const controller = useLoginForm(
    initialEmail,
    returnPath,
    authTransitionSessionId,
    requiresTurnstile,
    authPath,
  )
  const {
    isPasswordStep,
    usesPasswordTransition,
    emailValidationMessage,
    loginValidationMessage,
  } = controller
  const heightOffset = getHeightOffset(
    isPasswordStep,
    emailValidationMessage,
    loginValidationMessage,
  )
  return (
    <S.Card
      $heightOffset={heightOffset}
      $isFullWidth={hideHeroImage}
      $usesPasswordTransition={usesPasswordTransition}
      aria-labelledby="login-title"
    >
      {!hideHeroImage && (
        <S.Hero $heightOffset={heightOffset}>
          <S.HeroImage
            src={heroImage || authHeroImage}
            alt={heroImageAlt}
          />
        </S.Hero>
      )}

      <LoginPanel
        controller={controller}
        heightOffset={heightOffset}
        isFullWidth={hideHeroImage}
        useSwitchLogo={useSwitchLogo}
        requiresTurnstile={requiresTurnstile}
        title={title}
        subtitle={subtitle}
        isClubCreation={isClubCreation}
        onClubCreateSubmit={onClubCreateSubmit}
        clubProfile={clubProfile}
        representativeImagePreview={representativeImagePreview}
        onClubLogoPreviewChange={onClubLogoPreviewChange}
        onRepresentativeImagePreviewChange={onRepresentativeImagePreviewChange}
      />
    </S.Card>
  )
}
