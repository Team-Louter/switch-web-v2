import styled from 'styled-components'

import * as token from '@/shared/styles/values/token'

export const CalendarContainer = styled.div`
  box-sizing: border-box;
  width: 100%;
  height: 100dvh;
  padding: clamp(20px, 2vw, 30px) clamp(20px, 2vw, 30px)
    clamp(20px, 2vw, 30px) 0;
  ${token.flexCenter}
`

export const CalendarContent = styled.div`
  width: 100%;
  height: 100%;
  min-width: 0;
`

export const Container = styled.section`
  ${token.flexColumnStart}
  box-sizing: border-box;
  width: 100%;
  min-height: 100dvh;
  gap: clamp(24px, 4dvh, 40px);
  padding: clamp(40px, 8dvh, 80px) clamp(24px, 7vw, 100px)
    clamp(16px, 2dvh, 24px);
  background: ${token.colors.white};
`

export const PageHeader = styled.header`
  ${token.flexLeft}
  flex: 0 0 auto;
  width: 100%;
  gap: 16px;
`

export const PageTitle = styled.h1`
  color: ${token.colors.gray.gray100};
  line-height: 1;
  white-space: nowrap;
  ${token.typography('heading', 'lg', 'semibold')}
`

export const PageDescription = styled.p`
  color: ${token.colors.gray.gray50};
  line-height: 1;
  ${token.typography('body', 'lg', 'medium')}
`

export const StateText = styled.p`
  flex: 0 0 auto;
  color: ${token.colors.gray.gray50};
  ${token.typography('body', 'md', 'medium')}
`
