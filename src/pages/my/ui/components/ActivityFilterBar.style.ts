import styled from 'styled-components'

import * as token from '@/shared/styles/values/token'
import { myPagePalette as color } from '../myPagePalette'

export const FilterBar = styled.div`
  display: flex;
  align-items: stretch;
  box-sizing: border-box;
  width: calc(100% - 2 * var(--my-content-inset));
  margin: 0 var(--my-content-inset);
  border-bottom: 3px solid ${color.lightLine};
  overflow: hidden;
`

export const FilterItem = styled.button<{ $active: boolean }>`
  ${token.flexCenter}
  flex: 0 0 auto;
  position: relative;
  padding: 16px clamp(16px, calc(2.16vw - 0.6px), 32px);
  border-bottom: 3px solid
    ${({ $active }) => ($active ? color.yellow : 'transparent')};
  color: ${({ $active }) =>
    $active ? color.strongText : color.mutedText};
  line-height: 1;
  transition: border-color 200ms ease, color 200ms ease;
  ${token.typography('body', 'md', 'medium')}
  font-weight: ${({ $active }) => ($active ? 700 : 500)};

  &:hover {
    border-color: ${({ $active }) =>
      $active ? color.yellow : color.line};
    color: ${color.text};
  }
`
