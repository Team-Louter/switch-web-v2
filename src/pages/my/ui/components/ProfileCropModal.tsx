import { useState } from 'react'

import { ProfileAvatar } from '@/shared/ui'

import { useProfileCropModal } from '../../model/useProfileCropModal'
import * as S from './ProfileCropModal.style'

import type { ProfileAvatarEquippedItems } from '@/shared/ui'
import type { ProfileCropState } from '../../model/useProfileCropModal'

interface ProfileCropModalProps {
  imageSrc: string
  initialState: ProfileCropState
  equippedItems?: ProfileAvatarEquippedItems
  onCancel: () => void
  onComplete: (
    croppedImageSrc: string,
    nextCropState: ProfileCropState,
  ) => void
}

const SMALL_PREVIEW_SIZE = 80
const LARGE_PREVIEW_SIZE = 240

export function ProfileCropModal({
  imageSrc,
  initialState,
  equippedItems,
  onCancel,
  onComplete,
}: ProfileCropModalProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const {
    cropAreaRef,
    cropAreaSize,
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

  const createPreviewFrame = (size: number) => {
    const scale = size / cropAreaSize.height

    return {
      height: imageFrame.height * scale,
      left: imageFrame.left * scale,
      top: imageFrame.top * scale,
      width: imageFrame.width * scale,
    }
  }
  const smallPreviewFrame = createPreviewFrame(SMALL_PREVIEW_SIZE)
  const largePreviewFrame = createPreviewFrame(LARGE_PREVIEW_SIZE)

  return (
    <S.Overlay>
      <S.Modal
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-crop-title"
        onClick={(event) => event.stopPropagation()}
      >
        <S.Title id="profile-crop-title">이미지 자르기</S.Title>
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
          <S.CropGrid aria-hidden="true" />
          <S.CropCircleGuide aria-hidden="true" />
          <S.CropBorderPreview aria-hidden="true">
            <ProfileAvatar
              imageUrl=""
              equippedItems={equippedItems}
              size={cropAreaSize.width}
            />
          </S.CropBorderPreview>
        </S.CropArea>

        <S.ZoomRow>
          <S.ZoomLabel htmlFor="profile-crop-zoom">확대</S.ZoomLabel>
          <S.ZoomSlider
            id="profile-crop-zoom"
            type="range"
            min="0"
            max="200"
            step="5"
            value={zoomValue}
            onChange={handleZoomChange}
          />
        </S.ZoomRow>

        <S.BottomRow>
          <S.PreviewButton
            type="button"
            aria-label="크롭 미리보기 확대"
            onClick={() => setIsPreviewOpen(true)}
          >
            <S.PreviewImage
              src={imageSrc}
              alt=""
              $height={smallPreviewFrame.height}
              $left={smallPreviewFrame.left}
              $top={smallPreviewFrame.top}
              $width={smallPreviewFrame.width}
            />
            <S.PreviewBorder
              imageUrl=""
              equippedItems={equippedItems}
              size={SMALL_PREVIEW_SIZE}
            />
          </S.PreviewButton>
          <S.ButtonGroup>
            <S.CancelButton type="button" onClick={onCancel}>
              취소
            </S.CancelButton>
            <S.ApplyButton type="button" onClick={handleComplete}>
              적용
            </S.ApplyButton>
          </S.ButtonGroup>
        </S.BottomRow>

        {isPreviewOpen && (
          <S.PreviewOverlay onClick={() => setIsPreviewOpen(false)}>
            <S.LargePreview onClick={(event) => event.stopPropagation()}>
              <S.PreviewImage
                src={imageSrc}
                alt="크롭 결과 미리보기"
                $height={largePreviewFrame.height}
                $left={largePreviewFrame.left}
                $top={largePreviewFrame.top}
                $width={largePreviewFrame.width}
              />
              <S.PreviewBorder
                imageUrl=""
                equippedItems={equippedItems}
                size={LARGE_PREVIEW_SIZE}
              />
            </S.LargePreview>
          </S.PreviewOverlay>
        )}
      </S.Modal>
    </S.Overlay>
  )
}
