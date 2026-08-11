import loginHeroImage from '../assets/images/login-hero.png'
import loginPasswordHeroImage from '../assets/images/login-password-hero.png'
import signupHeroImage from '../assets/images/signup-hero.png'
import { useLoginForm } from '../model/useLoginForm'
import * as S from './LoginCard.style'
import { LoginPanel } from './LoginPanel'

const PASSWORD_STEP_HEIGHT_OFFSET = 48
const VALIDATION_MESSAGE_HEIGHT_OFFSET = 24

interface LoginCardProps {
  initialEmail?: string
  returnPath?: string
  startsFromSignup?: boolean
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
}: LoginCardProps) {
  const controller = useLoginForm(initialEmail, returnPath)
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
        {startsFromSignup && (
          <S.PreviousHeroImage
            src={signupHeroImage}
            alt=""
            aria-hidden="true"
          />
        )}
        <S.HeroImage
          src={loginHeroImage}
          alt={isPasswordStep ? '' : 'Louter 캐릭터들이 함께 노는 모습'}
          aria-hidden={isPasswordStep}
          $fadesIn={startsFromSignup}
          $isVisible={!isPasswordStep}
        />
        <S.HeroImage
          src={loginPasswordHeroImage}
          alt={isPasswordStep ? 'Louter 캐릭터들이 함께 노는 모습' : ''}
          aria-hidden={!isPasswordStep}
          $isVisible={isPasswordStep}
        />
      </S.Hero>

      <LoginPanel controller={controller} heightOffset={heightOffset} />
    </S.Card>
  )
}
