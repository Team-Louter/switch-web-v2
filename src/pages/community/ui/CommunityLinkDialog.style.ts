import styled from 'styled-components';

import { tokens as token } from '@/shared/styles';

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
`;

export const Title = styled.h2`
  margin: 0;
  color: ${token.colors.gray.gray100};
  ${token.typography('body', 'md', 'semibold')}
  line-height: 1.45;
`;

export const Field = styled.label`
  display: flex;
  flex-direction: column;
  gap: 8px;
  color: ${token.colors.gray.gray80};
  ${token.typography('body', 'sm', 'medium')}
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

  > button:hover:not(:disabled) { filter: brightness(0.94); }
  > button:disabled { opacity: 0.5; }
`;
