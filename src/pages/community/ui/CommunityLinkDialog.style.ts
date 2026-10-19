import styled, { css, keyframes } from 'styled-components';

import { tokens as token } from '@/shared/styles';

const reveal = keyframes`
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
`;

const dismiss = keyframes`
  from { opacity: 1; transform: translateY(0); }
  to { opacity: 0; transform: translateY(6px); }
`;

export const Form = styled.form<{ $closing: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 18px;
  width: 100%;
  animation: ${({ $closing }) => css`${$closing ? dismiss : reveal} 160ms ease both`};
  @media (prefers-reduced-motion: reduce) { animation: none; }
`;

export const Title = styled.h2`
  margin: 0;
  color: ${token.colors.gray.gray100};
  ${token.typography('heading', 'sm', 'semibold')}
`;

export const Field = styled.label`
  display: flex;
  flex-direction: column;
  gap: 8px;
  color: ${token.colors.gray.gray80};
  ${token.typography('body', 'md', 'medium')}
`;

export const Input = styled.input`
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  padding: 10px 12px;
  border: 1px solid ${token.colors.gray.gray20};
  border-radius: ${token.shapes.small};
  background: ${token.colors.white};
  color: ${token.colors.gray.gray100};
  font: inherit;
  transition: border-color 160ms ease;
  &:focus-visible { outline: 2px solid ${token.colors.primary.primary50}; outline-offset: 2px; }
  &[aria-invalid='true'] { border-color: ${token.colors.danger.danger20}; }
  @media (prefers-reduced-motion: reduce) { transition: none; }
`;

export const Error = styled.p`
  margin: 0;
  color: ${token.colors.danger.danger20};
  ${token.typography('body', 'sm', 'regular')}
`;

export const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: 8px;
`;
