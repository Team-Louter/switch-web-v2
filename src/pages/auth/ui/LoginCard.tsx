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
  startsFromSignup?: boolean
}

function getHeightOffset(
  isPasswordStep: boolean,
  emailValidationMessage: string,
): number {
  if (isPasswordStep) {
    return PASSWORD_STEP_HEIGHT_OFFSET
  }

  return emailValidationMessage ? VALIDATION_MESSAGE_HEIGHT_OFFSET : 0
}

export function LoginCard({
  initialEmail = '',
  startsFromSignup = false,
}: LoginCardProps) {
  const controller = useLoginForm(initialEmail)
  const {
    isPasswordStep,
    usesPasswordTransition,
    emailValidationMessage,
  } = controller
  const heightOffset = getHeightOffset(
    isPasswordStep,
    emailValidationMessage,
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
          $isVisible
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
