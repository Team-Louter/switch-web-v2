import styled from 'styled-components'

import * as token from '@/shared/styles/values/token'

export const Header = styled.header`
  display: grid;
  grid-template-columns: 22px minmax(0, 1fr);
  align-items: center;
  gap: clamp(24px, 2.1vw, 30px);
`

export const BackButton = styled.button`
  width: 20px;
  height: 40px;

  img { width: 100%; height: 100%; }
  &:focus-visible { outline: 3px solid ${token.colors.primary.primary40}; outline-offset: 5px; }
`

export const StatsBar = styled.div`
  ${token.flexBetween};
  width: 100%;
  padding: 15px 28px;
  border-radius: ${token.shapes.medium};
  background-color: ${token.colors.gray.gray0};
`

export const Stat = styled.div`
  ${token.flexCenter};
  gap: 5px;
`

export const Label = styled.span`
  ${token.typography('heading', 'sm', 'medium')};
  color: ${token.colors.gray.gray50};
`

export const Value = styled.span`
  ${token.typography('heading', 'sm', 'medium')};
  color: ${token.colors.gray.gray80};
`
