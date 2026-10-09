import styled from 'styled-components'

import * as token from '@/shared/styles/values/token'

export const Identity = styled.span`
  ${token.flexRow}
  align-items: center;
  min-width: 0;
  max-width: 100%;
  gap: 6px;
`

export const Title = styled.span`
  ${token.typography('caption', 'sm', 'medium')}
  display: inline-flex;
  align-items: center;
  box-sizing: border-box;
  flex: 0 1 auto;
  min-width: 0;
  max-width: min(160px, 100%);
  gap: 4px;
  padding: 2px 5px;
  overflow: hidden;
  border: 1px solid ${token.colors.gray.gray20};
  border-radius: ${token.shapes.xsmall};
  background: ${token.colors.white};
  color: ${token.colors.gray.gray70};
  line-height: 1.2;
  white-space: nowrap;

  svg {
    flex: 0 0 auto;
    color: ${token.colors.gray.gray60};
  }

  span {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`

export const Name = styled.span`
  display: block;
  flex: 0 1 auto;
  min-width: 0;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  & > span {
    max-width: 100%;
  }
`
