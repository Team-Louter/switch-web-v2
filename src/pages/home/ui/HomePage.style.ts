import styled from 'styled-components'

import * as token from '@/shared/styles/values/token'

export const PageContainer = styled.section`
  ${token.flexRow}
  align-items: stretch;
  gap: 30px;
  width: 100%;
  height: 100vh;
  padding: clamp(20px, 2vw, 30px);
  overflow: hidden;
  background: ${token.colors.white};
`

export const CalendarArea = styled.div`
  flex: 1 1 0;
  min-width: 0;
  height: 100%;
`

export const SideArea = styled.aside`
  ${token.flexColumn}
  flex: 0 0 clamp(320px, 31vw, 469px);
  gap: 30px;
  height: 100%;
  min-height: 0;
  overflow-y: auto;
`

// 남는 세로 공간은 디자인처럼 다가오는 일정 카드가 차지한다.
export const SideTop = styled.div`
  ${token.flexColumn}
  flex: 1 1 auto;
  min-height: 245px;

  > section {
    flex: 1 1 auto;
  }
`

export const SideItem = styled.div`
  flex: 0 0 auto;
`
