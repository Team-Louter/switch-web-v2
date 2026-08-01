import { Button } from '@/shared/ui'

import profileImage from '@/shared/assets/sidebar/profile.png'

import * as S from './ProfileCropModal.style'

type ProfileCropModalProps = {
  onCancel: () => void
  onComplete: () => void
}

export function ProfileCropModal({
  onCancel,
  onComplete,
}: ProfileCropModalProps) {
  return (
    <S.Overlay>
      <S.Modal>
        <S.Title>이미지 크롭</S.Title>
        <S.CropArea>
          <S.CropImage src={profileImage} alt="" />
          <S.CropShade aria-hidden="true" />
          <S.CropFrame aria-hidden="true" />
        </S.CropArea>
        <S.SliderTrack>
          <S.SliderThumb aria-hidden="true" />
        </S.SliderTrack>
        <S.Actions>
          <S.ActionWrap>
            <Button variant="text" onClick={onCancel}>
              취소
            </Button>
          </S.ActionWrap>
          <S.ActionWrap>
            <Button onClick={onComplete}>완료</Button>
          </S.ActionWrap>
        </S.Actions>
      </S.Modal>
    </S.Overlay>
  )
}
