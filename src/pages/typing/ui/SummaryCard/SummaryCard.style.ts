import styled from "styled-components";

import * as token from '@/shared/styles/values/token'

export const Card = styled.div`
  height: 80px;
  width: 100%;
  min-width: 0;
  background-color: ${token.colors.white};
  border-radius: ${token.shapes.medium};
  padding: 12px;
  ${token.flexRow}
  align-items: center;
`;

export const IconContainer = styled.div`
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 10px;
`;

export const Column = styled.div`
  ${token.flexColumn};
  padding-left: 10px;
  margin-left: 10px;
`;

export const Label = styled.span`
  ${token.typography('caption', 'lg', 'semibold')};
  color: ${token.colors.gray.gray50};
`;

export const Value = styled.span`
  ${token.typography('body', 'lg', 'semibold')};
`;
