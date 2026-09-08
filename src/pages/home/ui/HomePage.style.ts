import styled from 'styled-components'

import * as token from '@/shared/styles/values/token'

export const PageContainer = styled.section`
  width: 100%;
  min-height: 100dvh;
  /* AppLayout의 SidebarContainer와 같은 상단 기준선에서 콘텐츠를 시작한다. */
  padding: clamp(20px, 2vw, 30px) clamp(20px, 2vw, 30px)
    clamp(20px, 2vw, 30px) 0;
  background: ${token.colors.white};
`

export const CalendarArea = styled.div`
  width: 888px;
  /* 우측 프로필·랭킹/인기글 카드 묶음의 실제 하단과 맞춘다. */
  height: 675px;
  flex-shrink: 0;
`

export const Viewport = styled.div`width: 100%; position: relative;`
export const Canvas = styled.div`
  display: flex;
  gap: 32px;
  width: 1280px;
  height: 740px;
  transform-origin: top left;
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
