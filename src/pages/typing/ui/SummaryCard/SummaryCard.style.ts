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
  flex: 0 0 36px;
  margin-left: 0;
`;

export const Column = styled.div`
  ${token.flexColumn};
  min-width: 0;
  padding-left: 6px;
  margin-left: 0;
`;

export const Label = styled.span`
  ${token.typography('caption', 'lg', 'semibold')};
  color: ${token.colors.gray.gray50};
  white-space: nowrap;

  @media (max-width: 1180px) {
    font-size: 13px;
  }
`;

export const Value = styled.span`
  ${token.typography('body', 'lg', 'semibold')};
`;
