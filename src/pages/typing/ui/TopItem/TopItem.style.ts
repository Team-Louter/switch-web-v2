import styled from "styled-components";

import * as token from '@/shared/styles/values/token'

export const Card = styled.div`
  ${token.flexRow}
  align-items: center;
  min-width: 0;

  @media (max-width: 768px) {
    flex: 1 1 0;
    flex-direction: column;
    gap: 8px;
    text-align: center;
  }
`;

export const MedalContainer = styled.img`
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    width: 52px;
    height: 52px;
  }
`;

export const Column = styled.div`
  ${token.flexColumn};
  justify-content: center;
  min-width: 0;

  @media (max-width: 768px) {
    width: 100%;
    align-items: center;
    gap: 4px;
  }
`;

export const Name = styled.span`
  ${token.typography('heading', 'sm', 'medium')};
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  @media (max-width: 1180px) {
    max-width: none;
    ${token.typography('body', 'lg', 'medium')};
  }

  @media (max-width: 768px) {
    width: 100%;
    min-height: 38px;
    font-size: 14px;
    line-height: 1.25;
    text-align: center;
    white-space: normal;
    overflow-wrap: anywhere;
  }
`;

export const Value = styled.span`
  ${token.typography('caption', 'sm', 'medium')};
  background-color: ${token.colors.primary.primary50};
  padding: 2px 6px;
  border-radius: ${token.shapes.xlarge};
  color: ${token.colors.gray.gray100};
  ${token.flexCenter};
`;
