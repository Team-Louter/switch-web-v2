import styled from 'styled-components'

import * as token from '@/shared/styles/values/token'

export const AvatarRoot = styled.span<{ $size: number }>`
  position: relative;
  display: block;
  flex: 0 0 ${({ $size }) => $size}px;
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  overflow: visible;
`

export const ImageClip = styled.span<{ $size: number }>`
  position: absolute;
  top: 50%;
  left: 50%;
  display: block;
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  overflow: hidden;
  border-radius: ${token.shapes.circle};
  background: ${token.colors.white};
  transform: translate(-50%, -50%);
`

export const ProfileImage = styled.img<{ $imageScale: number }>`
  position: absolute;
  top: 50%;
  left: 50%;
  display: block;
  width: ${({ $imageScale }) => $imageScale * 100}%;
  height: ${({ $imageScale }) => $imageScale * 100}%;
  object-fit: cover;
  transform: translate(-50%, -50%);
`

export const DecorationImage = styled.img<{ $displaySize: number }>`
  position: absolute;
  z-index: 1;
  top: 50%;
  left: 50%;
  display: block;
  width: ${({ $displaySize }) => $displaySize}px;
  height: ${({ $displaySize }) => $displaySize}px;
  max-width: none;
  object-fit: contain;
  pointer-events: none;
  user-select: none;
  transform: translate(-50%, -50%);
`