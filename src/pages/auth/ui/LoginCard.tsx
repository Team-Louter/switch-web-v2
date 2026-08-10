import loginHeroImage from '../assets/images/login-hero.png'
import loginPasswordHeroImage from '../assets/images/login-password-hero.png'
import { useLoginForm } from '../model/useLoginForm'
import * as S from './LoginCard.style'
import { LoginPanel } from './LoginPanel'

export function LoginCard() {
  const controller = useLoginForm()
  const { isPasswordStep } = controller

  return (
    <S.Card
      $isPasswordStep={isPasswordStep}
      aria-labelledby="login-title"
    >
      <S.Hero $isPasswordStep={isPasswordStep}>
        <S.HeroImage
          src={loginHeroImage}
          alt={isPasswordStep ? '' : 'Louter 캐릭터들이 함께 노는 모습'}
          aria-hidden={isPasswordStep}
          $isVisible
        />
        <S.HeroImage
          src={loginPasswordHeroImage}
          alt={isPasswordStep ? 'Louter 캐릭터들이 함께 노는 모습' : ''}
          aria-hidden={!isPasswordStep}
          $isVisible={isPasswordStep}
        />
      </S.Hero>

      <LoginPanel controller={controller} />
    </S.Card>
  )
}
