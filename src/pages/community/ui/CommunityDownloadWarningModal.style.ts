import styled from 'styled-components'
import { tokens as token } from '@/shared/styles'

export const Character = styled.img`
  position: absolute;
  z-index: 1;
  top: -104px;
  right: 18px;
  width: 180px;
  height: 120px;
  object-fit: contain;
  pointer-events: none;
  user-select: none;
`
export const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
`
export const Badge = styled.span`
  align-self: flex-start;
  padding: 4px 8px;
  border-radius: 6px;
  color: ${token.colors.warning.warning30};
  background: ${token.colors.warning.warning0};
  ${token.typography('caption', 'md', 'semibold')}
`
export const Title = styled.h2`
  margin: 0;
  color: ${token.colors.gray.gray100};
  ${token.typography('body', 'lg', 'semibold')}
  line-height: 1.4;
`
export const FileName = styled.p`
  margin: 0;
  overflow: hidden;
  color: ${token.colors.gray.gray80};
  ${token.typography('body', 'sm', 'medium')}
  text-overflow: ellipsis;
  white-space: nowrap;
`
export const Description = styled.p`
  margin: 0;
  color: ${token.colors.gray.gray60};
  ${token.typography('body', 'sm', 'regular')}
  line-height: 1.65;
  word-break: keep-all;
  overflow-wrap: anywhere;
`
export const Actions = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 4px;
  > button {
    flex: 1;
    min-width: 0;
    min-height: 38px;
    padding: 8px 12px;
    border: 1px solid ${token.colors.gray.gray10};
    border-radius: 8px;
    color: ${token.colors.gray.gray100};
    background: ${token.colors.white};
    ${token.typography('body', 'sm', 'semibold')}
  }
  > button:last-child {
    border-color: ${token.colors.gray.gray100};
    color: ${token.colors.white};
    background: ${token.colors.gray.gray100};
  }
`
