import type { LoginFormController } from '../../model/useLoginForm'
import type { ClubApplication, ClubApplicationInput } from '@/entities/club'
import clubCreateBanner from '../../assets/images/club-create-banner.webp'
import { AuthIntro } from '../AuthIntro'
import { ClubCreateForm } from '../ClubCreateForm'
import { LoginForm } from '../LoginForm'
import * as S from './LoginPanel.style'

interface LoginPanelProps {
  controller: LoginFormController
  heightOffset: number
  isFullWidth?: boolean
  useSwitchLogo?: boolean
  requiresTurnstile?: boolean
  title?: string
  subtitle?: string
  isClubCreation?: boolean
  onClubCreateSubmit?: (values: ClubApplicationInput) => void
  clubProfile?: ClubApplication
  representativeImagePreview?: string
  onClubLogoPreviewChange?: (preview: string) => void
  onRepresentativeImagePreviewChange?: (preview: string) => void
}

export function LoginPanel({
  controller,
  heightOffset,
  isFullWidth = false,
  useSwitchLogo = false,
  requiresTurnstile = true,
  title,
  subtitle,
  isClubCreation = false,
  onClubCreateSubmit,
  clubProfile,
  representativeImagePreview,
  onClubLogoPreviewChange,
  onRepresentativeImagePreviewChange,
}: LoginPanelProps) {
  return (
    <S.Panel $heightOffset={heightOffset} $isFullWidth={isFullWidth}>
      {isClubCreation && (
        <S.ClubCreateBannerFrame>
          <S.ClubCreateBanner
            src={representativeImagePreview || clubCreateBanner}
            alt={
              representativeImagePreview
                ? '선택한 동아리 대표 이미지 미리보기'
                : '동아리 생성 안내 배너'
            }
          />
        </S.ClubCreateBannerFrame>
      )}
      <S.Content
        $isFullWidth={isFullWidth}
        $hasBanner={isClubCreation}
      >
        <AuthIntro
          titleId="login-title"
          title={title}
          subtitle={subtitle}
          useSwitchLogo={useSwitchLogo}
          compactLogo={isClubCreation}
          showPartnerLogo={!isClubCreation}
          partnerLogoSrc={clubProfile?.clubLogoPreview}
          partnerLogoAlt={clubProfile ? '동아리 로고' : undefined}
        />
        {isClubCreation ? (
          <ClubCreateForm
            onSubmit={onClubCreateSubmit}
            onLogoPreviewChange={onClubLogoPreviewChange}
            onRepresentativeImagePreviewChange={
              onRepresentativeImagePreviewChange
            }
          />
        ) : (
          <LoginForm
            controller={controller}
            requiresTurnstile={requiresTurnstile}
          />
        )}
      </S.Content>
    </S.Panel>
  )
}
