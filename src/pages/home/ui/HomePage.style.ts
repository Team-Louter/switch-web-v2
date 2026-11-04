import styled, { keyframes } from 'styled-components'

import * as token from '@/shared/styles/values/token'

const homeTopEnter = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`

export const PageContainer = styled.section`
  width: 100%;
  min-height: 100dvh;
  overflow-anchor: none;
  /* AppLayout의 SidebarContainer와 같은 상단 기준선에서 콘텐츠를 시작한다. */
  padding: clamp(20px, 2vw, 30px) clamp(20px, 2vw, 30px)
    clamp(20px, 2vw, 30px);
  background: ${token.colors.white};

  @media (max-width: 768px) { padding: 16px; }
`

export const CalendarArea = styled.div`
  /* FullCalendar가 날짜 칸과 일정 막대를 같은 좌표계에서 계산하도록 한다. */
  height: 100%;

  @media (max-width: 768px) {
    display: none;
  }
`

export const Viewport = styled.div`
  width: 100%;
  position: relative;
  overflow-anchor: none;
  @media (max-width: 768px) { height: auto !important; }
`
export const Canvas = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 888fr) minmax(0, 360fr);
  grid-template-rows: minmax(0, 1fr);
  height: 100%;

  @media (prefers-reduced-motion: no-preference) {
    animation: ${homeTopEnter} 420ms ease-out;
  }

  @media (max-width: 768px) {
    display: flex;
    height: auto;
    flex-direction: column;
  }
`

export const SidebarArea = styled.div`
  justify-self: end;
  align-self: start;
  transform-origin: top right;

  @media (max-width: 768px) {
    align-self: stretch;
    transform: none !important;
  }
`

export const Footer = styled.footer`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 150px;
`

export const FooterText = styled.span`
  color: ${token.colors.gray.gray40};
  font-size: 1rem;
`

export const GithubLink = styled.a`
  margin-top: 10px;
  color: ${token.colors.gray.gray80};
  font-size: .875rem;
  font-weight: 600;
`
