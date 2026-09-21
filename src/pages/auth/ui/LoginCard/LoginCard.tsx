import authHeroImage from '../../assets/images/auth-hero.jpg'
import type { ClubApplicationInput } from '@/entities/club'
import { useLoginForm } from '../../model/useLoginForm'
import { LoginPanel } from '../LoginPanel'
import * as S from './LoginCard.style'

const PASSWORD_STEP_HEIGHT_OFFSET = 48
const VALIDATION_MESSAGE_HEIGHT_OFFSET = 24

interface LoginCardProps {
  initialEmail?: string
  returnPath?: string
  authTransitionSessionId?: string
  hideHeroImage?: boolean
  useSwitchLogo?: boolean
  requiresTurnstile?: boolean
  title?: string
  subtitle?: string
  isClubCreation?: boolean
  onClubCreateSubmit?: (values: ClubApplicationInput) => void
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
  authTransitionSessionId = '',
  hideHeroImage = false,
  useSwitchLogo = false,
  requiresTurnstile = true,
  title,
  subtitle,
  isClubCreation = false,
  onClubCreateSubmit,
  representativeImagePreview,
  onClubLogoPreviewChange,
  onRepresentativeImagePreviewChange,
}: LoginCardProps) {
  const controller = useLoginForm(
    initialEmail,
    returnPath,
    authTransitionSessionId,
    requiresTurnstile,
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
            src={authHeroImage}
            alt="Louter 캐릭터들이 함께 노는 모습"
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
        representativeImagePreview={representativeImagePreview}
        onClubLogoPreviewChange={onClubLogoPreviewChange}
        onRepresentativeImagePreviewChange={onRepresentativeImagePreviewChange}
      />
    </S.Card>
  )
}
