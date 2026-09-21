import styled from "styled-components";

import * as token from '@/shared/styles/values/token'

export const Card = styled.button<{$selected: boolean}>`
  height: 100%;
  background-color: ${({$selected}) => $selected ? token.colors.primary.primary40 : token.colors.white};
  border-radius: ${token.shapes.medium};
  border: 1px solid ${({$selected}) => $selected ? token.colors.primary.primary100 : token.colors.gray.gray20};
  color: ${({$selected}) => $selected ? token.colors.primary.foreground : token.colors.gray.gray100};
  padding: 0px 30px;
  ${token.flexRow};
  align-items: center;
`;

export const Column = styled.div`
  ${token.flexColumnStart};
  padding-left: 10px;
  margin-left: 10px;
`;

export const Label = styled.span`
  ${token.typography('body', 'lg', 'semibold')};
`;

export const Value = styled.span<{$selected: boolean}>`
  ${token.typography('body', 'sm', 'semibold')};
  color: ${({$selected}) => $selected ? token.colors.primary.foreground : token.colors.gray.gray50};
  opacity: ${({$selected}) => $selected ? 0.8 : 1};
`;
