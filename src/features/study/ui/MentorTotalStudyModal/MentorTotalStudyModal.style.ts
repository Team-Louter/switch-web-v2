import styled from 'styled-components'

import * as token from '@/shared/styles/values/token'
import {
  studyModalBackdropAnimation,
  studyModalContentAnimation,
} from '../studyModalAnimation.style'

export const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px 32px;
  background-color: rgb(14 13 12 / 70%);
  ${studyModalBackdropAnimation}
`

export const Modal = styled.div`
  position: relative;
  display: flex;
  width: min(600px, 100%);
  height: 270px;
  flex-direction: column;
  justify-content: space-between;
  padding: 40px;
  border-radius: ${token.shapes.xlarge};
  background-color: ${token.colors.white};
  box-shadow: 0 16px 48px rgb(0 0 0 / 20%);
  ${studyModalContentAnimation}
`

export const GeneratedModal = styled.div`
  --generated-modal-height: min(550px, 90vh);

  position: relative;
  display: flex;
  width: min(600px, 100%);
  height: var(--generated-modal-height);
  flex-direction: column;
  justify-content: space-between;
  padding: 40px;
  border-radius: ${token.shapes.xlarge};
  background-color: ${token.colors.white};
  box-shadow: 0 16px 48px rgb(0 0 0 / 20%);
  ${studyModalContentAnimation}
`

export const GeneratedContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 20px;
`

export const GeneratedFormRow = styled.div<{ $align?: 'center' }>`
  display: grid;
  grid-template-columns: 100px minmax(0, 1fr);
  align-items: ${({ $align }) => $align ?? 'start'};
  gap: 10px;
`

export const ContentTextarea = styled.textarea`
  width: 100%;
  height: calc(var(--generated-modal-height) * 0.5);
  padding: 16px;
  resize: none;
  border: 1px solid ${token.colors.gray.gray10};
  border-radius: ${token.shapes.xsmall};
  background-color: ${token.colors.white};
  color: ${token.colors.gray.gray70};
  ${token.typography('body', 'sm', 'medium')};

  &:focus {
    border-color: ${token.colors.primary.primary50};
    outline: none;
  }
`

export const Title = styled.h2`
  ${token.typography('heading', 'md', 'semibold')};
  color: ${token.colors.info.info40};
`

export const FormRow = styled.div`
  display: grid;
  grid-template-columns: 160px minmax(0, 530px);
  align-items: center;
  gap: 26px;
`

export const Label = styled.label`
  ${token.typography('body', 'md', 'medium')};
  color: ${token.colors.gray.gray70};
`

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 20px;
`

export const GeneratedButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
`

export const RightButtonGroup = styled.div`
  display: flex;
  gap: 20px;
`

const ActionButton = styled.button`
  padding: 7px 40px;
  border-radius: ${token.shapes.xsmall};
  ${token.typography('body', 'sm', 'bold')};
  cursor: pointer;
`

export const CancelButton = styled(ActionButton)`
  border: 1px solid ${token.colors.gray.gray10};
  background-color: ${token.colors.white};
  color: ${token.colors.primary.foreground};
`

export const SubmitButton = styled(ActionButton)`
  border: 0;
  background-color: ${token.colors.primary.primary50};
  color: ${token.colors.primary.foreground};

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
`
