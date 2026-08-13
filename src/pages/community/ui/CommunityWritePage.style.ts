import styled from 'styled-components'

import * as token from '@/shared/styles/values/token'

export const Page = styled.section`
  box-sizing: border-box;
  min-height: 100dvh;
  padding: clamp(32px, 5.1dvh, 50px) clamp(24px, 8.31%, 100px);
  container-name: community-write;
  container-type: inline-size;
  background: ${token.colors.white};
`

export const Content = styled.div`
  ${token.flexColumn}
  gap: 20px;
  width: 100%;
  max-width: calc(1003px / 0.9);
  min-height: calc(100dvh - 100px);
  margin: 0 auto;
  zoom: 0.9;
`

export const Header = styled.header`
  ${token.flexColumn}
  gap: 24px;
  width: 100%;
`

export const BackButton = styled.button`
  ${token.flexLeft}
  align-self: flex-start;
  gap: 8px;
  height: 21px;
  padding: 0;
  border: 0;
  color: ${token.colors.gray.gray50};
  background: transparent;
  ${token.typography('body', 'lg', 'medium')}
  line-height: 1;
  cursor: pointer;
`

export const BackIcon = styled.img`
  width: 9.257px;
  height: 16px;
  transform: rotate(180deg);
`

export const WriteForm = styled.form`
  ${token.flexColumn}
  gap: 20px;
  width: 100%;
`

export const TitleRow = styled.div`
  ${token.flexBetween}
  gap: 20px;
  width: 100%;
  min-height: 39px;
`

export const Heading = styled.h1`
  margin: 0;
  color: ${token.colors.gray.gray100};
  ${token.typography('heading', 'lg', 'semibold')}
  line-height: 1.18;
`

export const Fields = styled.div`
  ${token.flexRow}
  gap: 12px;
  width: 100%;
  height: 52px;

  @container community-write (max-width: 560px) {
    flex-direction: column;
    height: auto;
  }
`

export const CategoryField = styled.div`
  position: relative;
  flex: 0 0 162px;
  height: 52px;

  @container community-write (max-width: 560px) {
    flex-basis: 52px;
    width: 100%;
  }
`

export const CategorySelect = styled.select`
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  padding: 12px 44px 12px 12px;
  overflow: hidden;
  border: 0;
  border-radius: ${token.shapes.medium};
  outline: none;
  color: ${token.colors.gray.gray60};
  background: #f5f5f5;
  ${token.typography('body', 'lg', 'medium')}
  line-height: 1;
  appearance: none;
  cursor: pointer;

  &:focus-visible {
    outline: 2px solid ${token.colors.primary.primary50};
    outline-offset: -2px;
  }
`

export const CategoryChevron = styled.img`
  position: absolute;
  top: 20px;
  right: 12px;
  width: 20px;
  height: 12px;
  pointer-events: none;
  transform: rotate(180deg);
`

export const TitleInput = styled.input`
  flex: 1 1 0;
  box-sizing: border-box;
  min-width: 0;
  height: 52px;
  padding: 12px 20px;
  border: 0;
  border-radius: ${token.shapes.medium};
  outline: none;
  color: ${token.colors.gray.gray100};
  background: ${token.colors.gray.gray0};
  ${token.typography('body', 'lg', 'medium')}
  line-height: 1;

  &::placeholder {
    color: ${token.colors.gray.gray40};
    opacity: 1;
  }

  &:focus-visible {
    outline: 2px solid ${token.colors.primary.primary50};
    outline-offset: -2px;
  }
`

export const Editor = styled.section`
  ${token.flexColumn}
  flex: 1 1 706px;
  gap: 16px;
  box-sizing: border-box;
  width: 100%;
  min-height: 706px;
  padding: 16px;
  overflow: hidden;
  border-radius: ${token.shapes.small};
  background: #f5f5f5;

  @container community-write (max-width: 560px) {
    flex-basis: 520px;
    min-height: 520px;
  }
`

export const Toolbar = styled.div`
  ${token.flexBetween}
  flex: 0 0 auto;
  flex-wrap: wrap;
  gap: 12px;
  width: 100%;
  min-height: 24px;
`

export const ToolbarActions = styled.div`
  ${token.flexLeft}
  flex: 0 0 420px;
  gap: 12px;
  height: 24px;

  @container community-write (max-width: 650px) {
    flex: 1 1 100%;
    flex-wrap: wrap;
    height: auto;
  }

  @container community-write (max-width: 430px) {
    gap: 10px;
  }
`

export const ToolbarButton = styled.button`
  ${token.flexCenter}
  flex: 0 0 24px;
  width: 24px;
  height: 24px;
  padding: 0;
  border: 0;
  border-radius: ${token.shapes.xsmall};
  background: transparent;
  cursor: pointer;

  &:hover {
    background: ${token.colors.gray.gray10};
  }

  &:focus-visible {
    outline: 2px solid ${token.colors.primary.primary50};
    outline-offset: 1px;
  }
`

export const ToolbarIcon = styled.img<{ $width: number; $height: number }>`
  width: ${({ $width }) => $width}px;
  height: ${({ $height }) => $height}px;
  object-fit: contain;
`

export const AnonymousLabel = styled.label`
  ${token.flexLeft}
  gap: 6px;
  color: ${token.colors.gray.gray40};
  ${token.typography('body', 'lg', 'medium')}
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;

  @container community-write (max-width: 650px) {
    margin-left: auto;
  }
`

export const AnonymousToggle = styled.input`
  position: relative;
  box-sizing: border-box;
  width: 36.69px;
  height: 19px;
  margin: 0;
  border: 0;
  border-radius: 10.483px;
  outline: none;
  background: ${token.colors.gray.gray30};
  appearance: none;
  cursor: pointer;
  transition: background-color 120ms ease;

  &::after {
    position: absolute;
    top: 2px;
    left: 2px;
    width: 15px;
    height: 15px;
    border-radius: ${token.shapes.circle};
    background: ${token.colors.white};
    content: '';
    transition: transform 120ms ease;
  }

  &:checked {
    background: ${token.colors.primary.primary50};
  }

  &:checked::after {
    transform: translateX(17.69px);
  }

  &:focus-visible {
    outline: 2px solid ${token.colors.primary.primary50};
    outline-offset: 2px;
  }
`

export const EditorDivider = styled.hr`
  flex: 0 0 1px;
  width: 100%;
  height: 1px;
  margin: 4px 0 -4px;
  border: 0;
  background: ${token.colors.gray.gray10};
`

export const ContentInput = styled.textarea`
  flex: 1 1 0;
  box-sizing: border-box;
  width: 100%;
  min-height: 0;
  padding: 0;
  resize: none;
  border: 0;
  outline: none;
  color: ${token.colors.gray.gray100};
  background: transparent;
  ${token.typography('body', 'lg', 'medium')}
  line-height: 1.4;

  &::placeholder {
    color: ${token.colors.gray.gray40};
    opacity: 1;
  }
`

export const SubmitError = styled.p`
  position: fixed;
  z-index: 20;
  right: 32px;
  bottom: 32px;
  max-width: 420px;
  margin: 0;
  padding: 12px 16px;
  border-radius: ${token.shapes.small};
  color: ${token.colors.danger.danger30};
  background: ${token.colors.danger.danger0};
  ${token.typography('body', 'md', 'medium')}
  line-height: 1.4;

  @media (max-width: 700px) {
    right: 24px;
    bottom: 24px;
    left: 24px;
    max-width: none;
  }
`
