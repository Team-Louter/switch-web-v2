import styled from 'styled-components'

import * as token from '@/shared/styles/values/token'

export const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px 32px;
  background-color: rgb(14 13 12 / 70%);
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

export const Label = styled.span`
  ${token.typography('body', 'md', 'medium')};
  color: ${token.colors.gray.gray70};
`

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 20px;
`

const ActionButton = styled.button`
  padding: 7px 40px;
  border-radius: ${token.shapes.xsmall};
  ${token.typography('body', 'md', 'bold')};
  cursor: pointer;
`

export const CancelButton = styled(ActionButton)`
  border: 1px solid ${token.colors.gray.gray10};
  background-color: ${token.colors.white};
  color: ${token.colors.gray.gray80};
`

export const SubmitButton = styled(ActionButton)`
  border: 0;
  background-color: ${token.colors.primary.primary50};
  color: ${token.colors.info.info40};

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
`
