import authHeroImage from '../assets/images/auth-hero.jpg'
import { useLoginForm } from '../model/useLoginForm'
import * as S from './LoginCard.style'
import { LoginPanel } from './LoginPanel'

const PASSWORD_STEP_HEIGHT_OFFSET = 48
const VALIDATION_MESSAGE_HEIGHT_OFFSET = 24

interface LoginCardProps {
  initialEmail?: string
  returnPath?: string
  startsFromSignup?: boolean
  authTransitionSessionId?: string
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
  startsFromSignup = false,
  authTransitionSessionId = '',
}: LoginCardProps) {
  const controller = useLoginForm(
    initialEmail,
    returnPath,
    authTransitionSessionId,
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
      $startsFromSignup={startsFromSignup}
      $usesPasswordTransition={usesPasswordTransition}
      aria-labelledby="login-title"
    >
      <S.Hero $heightOffset={heightOffset}>
        <S.HeroImage
          src={authHeroImage}
          alt="Louter 캐릭터들이 함께 노는 모습"
        />
      </S.Hero>

      <LoginPanel controller={controller} heightOffset={heightOffset} />
    </S.Card>
  )
}
