import styled from 'styled-components'

import * as token from '@/shared/styles/values/token'

export const Header = styled.header`
  display: grid;
  grid-template-columns: 22px minmax(0, 1fr);
  align-items: center;
  gap: clamp(24px, 2.1vw, 30px);

  @media (max-width: 640px) {
    grid-template-columns: 20px minmax(0, 1fr);
    gap: 12px;
  }
`

export const BackButton = styled.button`
  width: 20px;
  height: 40px;

  img { width: 100%; height: 100%; }
  &:focus-visible { outline: 3px solid ${token.colors.primary.primary40}; outline-offset: 5px; }
`

export const StatsBar = styled.div`
  ${token.flexBetween};
  flex-wrap: wrap;
  gap: 10px 20px;
  width: 100%;
  padding: 15px 28px;
  border-radius: ${token.shapes.medium};
  background-color: ${token.colors.gray.gray0};

  @media (max-width: 640px) {
    justify-content: flex-start;
    padding: 12px 16px;
  }
`

export const Stat = styled.div`
  ${token.flexCenter};
  gap: 10px;

  @media (max-width: 640px) {
    gap: 6px;
  }
`

export const Label = styled.span`
  ${token.typography('heading', 'sm', 'medium')};
  color: ${token.colors.gray.gray50};

  @media (max-width: 640px) {
    font-size: ${token.fontSize.body.sm};
  }
`

export const Value = styled.span`
  ${token.typography('heading', 'sm', 'medium')};
  color: ${token.colors.gray.gray80};

  @media (max-width: 640px) {
    font-size: ${token.fontSize.body.sm};
  }
`
