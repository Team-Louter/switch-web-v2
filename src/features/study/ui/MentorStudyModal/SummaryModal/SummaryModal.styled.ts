import styled from 'styled-components'

import * as token from '@/shared/styles/values/token'

export const Container = styled.article`
  ${token.flexColumn};
  width: 100%;
  height: 350px;
  padding: 20px;
  border-radius: ${token.shapes.large};
  background-color: ${token.colors.white};
  box-shadow: 0 16px 48px rgb(0 0 0 / 20%);
  cursor: pointer;
`

export const Header = styled.div`
  ${token.flexRow};
  align-items: center;
  min-width: 0;
  gap: 10px;
`

export const StudyTitle = styled.h3`
  ${token.typography('body', 'md', 'semibold')};
  overflow: hidden;
  margin: 0;
  color: ${token.colors.gray.gray90};
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const Divider = styled.span`
  width: 1px;
  height: 16px;
  flex: 0 0 auto;
  background-color: ${token.colors.gray.gray70};
`

export const Author = styled.span`
  ${token.typography('caption', 'sm', 'medium')};
  overflow: hidden;
  color: ${token.colors.gray.gray40};
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const Line = styled.div`
  height: 2px;
  margin: 15px 0;
  flex: 0 0 auto;
  background-color: ${token.colors.primary.primary40};
`

export const Summary = styled.div<{ $isEmpty: boolean }>`
  ${token.typography('caption', 'lg', 'medium')};
  display: flex;
  flex: 1;
  align-items: ${({ $isEmpty }) => ($isEmpty ? 'center' : 'flex-start')};
  justify-content: ${({ $isEmpty }) => ($isEmpty ? 'center' : 'flex-start')};
  overflow-y: auto;
  padding: 10px;
  border: 1px solid ${token.colors.gray.gray10};
  border-radius: ${token.shapes.xsmall};
  color: ${({ $isEmpty }) =>
    $isEmpty ? token.colors.gray.gray30 : token.colors.gray.gray70};
  overflow-wrap: anywhere;
`
