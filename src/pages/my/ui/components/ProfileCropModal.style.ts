import styled, { css } from 'styled-components'

import * as token from '@/shared/styles/values/token'

interface PositionedImageProps {
  $height: number
  $left: number
  $top: number
  $width: number
}

const positionedImageStyle = css<PositionedImageProps>`
  position: absolute;
  top: ${({ $top }) => $top}px;
  left: ${({ $left }) => $left}px;
  width: ${({ $width }) => $width}px;
  height: ${({ $height }) => $height}px;
  max-width: none;
  max-height: none;
  object-fit: cover;
  pointer-events: none;
  user-select: none;
`

export const Overlay = styled.div`
  ${token.flexCenter}
  position: fixed;
  z-index: 40;
  inset: 0;
  background: rgb(14 13 12 / 70%);
`

export const Modal = styled.div`
  ${token.flexColumn}
  box-sizing: border-box;
  width: 520px;
  padding: 28px 28px 24px;
  border-radius: 12px;
  background: ${token.colors.white};
  box-shadow: 0 8px 28px rgb(14 13 12 / 14%);
`

export const Title = styled.h3`
  margin: 0 0 16px;
  color: ${token.colors.gray.gray80};
  ${token.typography('heading', 'sm', 'semibold')}
`

export const CropArea = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 3 / 2;
  overflow: hidden;
  margin-bottom: 16px;
  border-radius: 8px;
  background: ${token.colors.gray.gray90};
  cursor: grab;
  touch-action: none;

  &:active {
    cursor: grabbing;
  }
`

export const CropImage = styled.img<PositionedImageProps>`
  ${positionedImageStyle}
`

export const CropGrid = styled.div`
  position: absolute;
  inset: 0;
  border: 1px solid rgb(255 255 255 / 70%);
  background-image:
    linear-gradient(to right, rgb(255 255 255 / 32%) 1px, transparent 1px),
    linear-gradient(to bottom, rgb(255 255 255 / 32%) 1px, transparent 1px);
  background-size: calc(100% / 3) calc(100% / 3);
  pointer-events: none;
`

export const ZoomRow = styled.div`
  ${token.flexLeft}
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
`

export const ZoomLabel = styled.label`
  flex-shrink: 0;
  color: ${token.colors.gray.gray50};
  ${token.typography('body', 'sm', 'medium')}
`

export const ZoomSlider = styled.input`
  flex: 1;
  accent-color: ${token.colors.primary.primary50};
  cursor: pointer;
`

export const BottomRow = styled.div`
  ${token.flexBetween}
  align-items: center;
  gap: 12px;
`

export const PreviewButton = styled.button`
  position: relative;
  width: 80px;
  height: 80px;
  flex: 0 0 auto;
  overflow: hidden;
  border-radius: ${token.shapes.circle};
  background: ${token.colors.gray.gray0};
`

export const PreviewImage = styled.img<PositionedImageProps>`
  ${positionedImageStyle}
`

export const ButtonGroup = styled.div`
  ${token.flexLeft}
  justify-content: flex-end;
  gap: 12px;
`

const actionButtonStyle = css`
  width: 100px;
  padding: 10px 0;
  border-radius: 4px;
  ${token.typography('body', 'sm', 'bold')}
`

export const CancelButton = styled.button`
  ${actionButtonStyle}
  border: 1px solid ${token.colors.gray.gray20};
  color: ${token.colors.gray.gray80};
  background: ${token.colors.white};

  &:hover {
    background: ${token.colors.gray.gray0};
  }
`

export const ApplyButton = styled.button`
  ${actionButtonStyle}
  border: 0;
  color: ${token.colors.primary.foreground};
  background: ${token.colors.primary.primary40};

  &:hover {
    background: ${token.colors.primary.primary50};
  }
`

export const PreviewOverlay = styled.div`
  ${token.flexCenter}
  position: fixed;
  z-index: 50;
  inset: 0;
  background: rgb(14 13 12 / 80%);
`

export const LargePreview = styled.div`
  position: relative;
  width: 240px;
  height: 240px;
  overflow: hidden;
  border-radius: ${token.shapes.circle};
  box-shadow: 0 8px 32px rgb(0 0 0 / 30%);
`
