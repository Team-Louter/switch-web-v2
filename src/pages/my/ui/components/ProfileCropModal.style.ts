import styled from 'styled-components'

import * as token from '@/shared/styles/values/token'

export const Overlay = styled.div`
  ${token.flexCenter}
  position: fixed;
  z-index: 40;
  inset: 0;
  background: rgb(14 13 12 / 70%);
`

export const Modal = styled.div`
  ${token.flexColumn}
  align-items: flex-start;
  width: 700px;
  box-sizing: border-box;
  gap: 20px;
  padding: 30px;
  border-radius: ${token.shapes.large};
  background: ${token.colors.white};
`

export const Title = styled.h2`
  margin: 0;
  color: ${token.colors.gray.gray80};
  line-height: 1;
  ${token.typography('heading', 'md', 'medium')}
`

export const CropArea = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1;
  overflow: hidden;
  border-radius: ${token.shapes.small};
  background: ${token.colors.gray.gray10};
  cursor: grab;
  touch-action: none;

  &:active {
    cursor: grabbing;
  }
`

export const CropImage = styled.img<{
  $height: number
  $left: number
  $top: number
  $width: number
}>`
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

export const CropFrame = styled.div`
  position: absolute;
  inset: 0;
  box-sizing: border-box;
  border: 1px solid ${token.colors.white};
  pointer-events: none;

  &::before {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(to right, rgb(255 255 255 / 24%) 1px, transparent 1px),
      linear-gradient(to bottom, rgb(255 255 255 / 24%) 1px, transparent 1px);
    background-size: calc(100% / 3) calc(100% / 3);
    content: '';
    pointer-events: none;
  }
`

export const SliderTrack = styled.div`
  position: relative;
  width: 100%;
  height: 8px;
  border-radius: ${token.shapes.circle};
  background: ${token.colors.gray.gray80};
`

export const SliderInput = styled.input`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  margin: 0;
  appearance: none;
  background: transparent;
  cursor: pointer;

  &::-webkit-slider-thumb {
    width: 16px;
    height: 16px;
    appearance: none;
    border: 0;
    border-radius: ${token.shapes.circle};
    background: ${token.colors.primary.primary40};
  }

  &::-moz-range-thumb {
    width: 16px;
    height: 16px;
    border: 0;
    border-radius: ${token.shapes.circle};
    background: ${token.colors.primary.primary40};
  }
`

export const Actions = styled.div`
  ${token.flexLeft}
  width: 100%;
  gap: 10px;
`

export const ActionWrap = styled.div`
  flex: 1 1 0;
  min-width: 0;

  button {
    width: 100%;
    background: ${token.colors.gray.gray10};
  }

  &:last-child button {
    background: ${token.colors.primary.primary50};
  }
`
