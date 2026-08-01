import styled from 'styled-components'

import * as token from '@/shared/styles/values/token'

export const Overlay = styled.div`
  ${token.flexCenter}
  position: fixed;
  z-index: 20;
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
  height: 350px;
  overflow: hidden;
  border-radius: ${token.shapes.small};
  background: ${token.colors.gray.gray10};
`

export const CropImage = styled.img`
  position: absolute;
  top: -120px;
  left: 0;
  width: 100%;
  height: 590px;
  object-fit: cover;
`

export const CropShade = styled.div`
  position: absolute;
  inset: 0;
  background: rgb(14 13 12 / 45%);
`

export const CropFrame = styled.div`
  position: absolute;
  top: 6px;
  left: 151px;
  width: 338px;
  height: 338px;
  box-sizing: border-box;
  border: 1px solid ${token.colors.white};
`

export const SliderTrack = styled.div`
  position: relative;
  width: 100%;
  height: 8px;
  border-radius: ${token.shapes.circle};
  background: ${token.colors.gray.gray80};
`

export const SliderThumb = styled.span`
  position: absolute;
  top: 50%;
  left: 0;
  width: 16px;
  height: 16px;
  border-radius: ${token.shapes.circle};
  background: ${token.colors.primary.primary40};
  transform: translateY(-50%);
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
