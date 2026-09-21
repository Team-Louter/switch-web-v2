import styled from 'styled-components'

import * as token from '@/shared/styles/values/token'

export const Scrim = styled.div`
  ${token.flexCenter}
  position: fixed;
  z-index: 31;
  inset: 0;
  background: rgb(14 13 12 / 45%);
`

export const Card = styled.div`
  ${token.flexColumnCenter}
  box-sizing: border-box;
  width: 460px;
  padding: 40px 56px;
  border-radius: ${token.shapes.large};
  background: ${token.colors.white};
  box-shadow: 0 8px 28px rgb(14 13 12 / 14%);
`

export const Title = styled.h2`
  margin: 0 0 32px;
  color: ${token.colors.primary.foreground};
  ${token.typography('heading', 'lg', 'bold')}
`

export const Description = styled.p`
  margin: 0 0 32px;
  color: ${token.colors.gray.gray80};
  text-align: center;
  ${token.typography('body', 'md', 'medium')}
`

export const SmallNote = styled.span`
  color: ${token.colors.gray.gray40};
  font-size: 12px;
`

export const Actions = styled.div`
  ${token.flexCenter}
  gap: 20px;
`

export const CancelButton = styled.button`
  width: 100px;
  padding: 10px 0;
  border: 1px solid ${token.colors.gray.gray20};
  border-radius: ${token.shapes.small};
  color: ${token.colors.gray.gray80};
  background: ${token.colors.white};
  ${token.typography('body', 'sm', 'bold')}

  &:hover:not(:disabled) {
    background: ${token.colors.gray.gray0};
  }
`

export const ConfirmButton = styled.button<{ $active: boolean }>`
  width: 100px;
  padding: 10px 0;
  border-radius: ${token.shapes.small};
  color: ${token.colors.gray.gray80};
  background: ${token.colors.primary.primary40};
  opacity: ${({ $active }) => ($active ? 1 : 0.5)};
  cursor: ${({ $active }) => ($active ? 'pointer' : 'not-allowed')};
  ${token.typography('body', 'sm', 'bold')}

  &:hover:not(:disabled) {
    background: ${token.colors.primary.primary50};
  }
`
