import styled from "styled-components";

import * as token from '@/shared/styles/values/token'

export const Card = styled.div`
  ${token.flexRow}
  align-items: center;
`;

export const MedalContainer = styled.img`
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Column = styled.div`
  ${token.flexColumn};
  justify-content: center;
`;

export const Name = styled.span`
  ${token.typography('heading', 'sm', 'medium')};
`;

export const Value = styled.span`
  ${token.typography('caption', 'sm', 'medium')};
  background-color: ${token.colors.primary.primary50};
  padding: 2px 6px;
  border-radius: ${token.shapes.xlarge};
  color: ${token.colors.primary.foreground};
  ${token.flexCenter};
`;
