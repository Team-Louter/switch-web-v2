import styled from "styled-components";

import * as token from '@/shared/styles/values/token'

export const Card = styled.button<{$selected: boolean}>`
  height: 100%;
  background-color: ${({$selected}) => $selected ? token.colors.primary.primary40 : token.colors.white};
  border-radius: ${token.shapes.medium};
  border: 1px solid ${({$selected}) => $selected ? token.colors.primary.primary100 : token.colors.gray.gray20};
  padding: 14px 30px;
  ${token.flexRow};
  align-items: center;

  @media (max-width: 1180px) {
    min-height: 86px;
    padding: 14px 18px;
  }

  @media (min-width: 601px) and (max-width: 1400px) {
    > svg {
      display: none;
    }
  }

  @media (min-width: 601px) and (max-width: 1050px) {
    height: auto;
    min-height: 64px;
    padding: 10px 16px;
  }

  @media (min-width: 1401px) and (max-width: 1600px) {
    > svg {
      width: 28px;
      height: 28px;
    }
  }
`;

export const Column = styled.div`
  ${token.flexColumnStart};
  min-width: 0;
  padding-left: 8px;
  margin-left: 8px;

  @media (min-width: 601px) and (max-width: 1400px) {
    align-items: flex-start;
    width: 100%;
    margin-left: 0;
    padding-left: 0;
    text-align: left;
  }

  @media (min-width: 1401px) and (max-width: 1600px) {
    margin-left: 4px;
    padding-left: 4px;
  }
`;

export const Label = styled.span`
  ${token.typography('body', 'lg', 'semibold')};
  white-space: nowrap;
`;

export const Value = styled.span`
  ${token.typography('body', 'sm', 'semibold')};
  color: ${token.colors.gray.gray50};
  overflow-wrap: anywhere;

  @media (min-width: 601px) and (max-width: 1400px) {
    overflow-wrap: normal;
    white-space: nowrap;
  }

  @media (min-width: 1051px) and (max-width: 1400px) {
    font-size: clamp(11px, 1.15vw, 14px);
  }

  @media (min-width: 1401px) and (max-width: 1600px) {
    overflow-wrap: normal;
    white-space: nowrap;
    font-size: 14px;
  }
`;
