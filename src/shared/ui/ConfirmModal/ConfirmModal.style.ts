import styled, { css } from 'styled-components'

import * as token from '@/shared/styles/values/token'

export const Title = styled.h2`
  margin: 0;
  color: ${token.colors.gray.gray100};
  ${token.typography('heading', 'sm', 'semibold')}
  line-height: 1.35;
`

export const Description = styled.p`
  margin: 0;
  color: ${token.colors.gray.gray70};
  ${token.typography('body', 'md', 'regular')}
  line-height: 1.5;
`

export const Actions = styled.div`
  ${token.flexRow}
  justify-content: flex-end;
  gap: 8px;
  width: 100%;
  margin-top: 12px;
`

export const Content = styled.div<{ $compact: boolean }>`
  ${token.flexColumn}
  gap: 12px;
  width: 100%;

  ${({ $compact }) => $compact && css`
    ${Title} {
      ${token.typography('body', 'md', 'semibold')}
      line-height: 1.45;
    }

    ${Description} {
      color: ${token.colors.gray.gray60};
      ${token.typography('body', 'sm', 'regular')}
      line-height: 1.5;
    }

    ${Actions} {
      gap: 8px;
      margin-top: 4px;

      > button {
        flex: 1 1 0;
        min-width: 0;
        min-height: 36px;
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

      > button:hover:not(:disabled) {
        filter: brightness(0.94);
      }

      > button:disabled {
        opacity: 0.5;
      }
    }
  `}
`
