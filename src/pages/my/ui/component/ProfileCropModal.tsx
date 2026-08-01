import { Button } from '@/shared/ui'

import { useProfileCropModal } from '../../model/useProfileCropModal'
import type { ProfileCropState } from '../../model/useProfileCropModal'
import * as S from './ProfileCropModal.style'

type ProfileCropModalProps = {
  imageSrc: string
  initialState: ProfileCropState
  onCancel: () => void
  onComplete: (
    croppedImageSrc: string,
    nextCropState: ProfileCropState,
  ) => void
}

export function ProfileCropModal({
  imageSrc,
  initialState,
  onCancel,
  onComplete,
}: ProfileCropModalProps) {
  const {
    cropAreaRef,
    handleComplete,
    handleImageLoad,
    handleImagePointerDown,
    handleImagePointerMove,
    handleImagePointerUp,
    handleZoomChange,
    imageFrame,
    imageRef,
    zoomValue,
  } = useProfileCropModal({ initialState, onComplete })

  return (
    <S.Overlay>
      <S.Modal>
        <S.Title>이미지 크롭</S.Title>
        <S.CropArea
          ref={cropAreaRef}
          onPointerDown={handleImagePointerDown}
          onPointerMove={handleImagePointerMove}
          onPointerUp={handleImagePointerUp}
          onPointerCancel={handleImagePointerUp}
        >
          <S.CropImage
            ref={imageRef}
            src={imageSrc}
            alt=""
            draggable={false}
            $height={imageFrame.height}
            $left={imageFrame.left}
            $top={imageFrame.top}
            $width={imageFrame.width}
            onLoad={handleImageLoad}
          />
          <S.CropFrame aria-hidden="true" />
        </S.CropArea>
        <S.SliderTrack>
          <S.SliderInput
            type="range"
            min="0"
            max="100"
            value={zoomValue}
            aria-label="이미지 확대 비율"
            onChange={handleZoomChange}
          />
        </S.SliderTrack>
        <S.Actions>
          <S.ActionWrap>
            <Button variant="text" onClick={onCancel}>
              취소
            </Button>
          </S.ActionWrap>
          <S.ActionWrap>
            <Button onClick={handleComplete}>완료</Button>
          </S.ActionWrap>
        </S.Actions>
      </S.Modal>
    </S.Overlay>
  )
}
