// 커뮤니티 3개 화면(목록 / 조회 / 작성)이 함께 쓰는 뼈대 스타일
import styled from 'styled-components'

import * as token from '@/shared/styles/values/token'

export const Body = styled.section`
  ${token.flexColumnStart}
  gap: 40px;
  box-sizing: border-box;
  width: 100%;
  min-height: 100dvh;
  padding: 50px clamp(24px, 8vw, 100px);
  background: ${token.colors.white};
`

export const BackButton = styled.button`
  ${token.flexLeft}
  gap: 8px;
  color: ${token.colors.gray.gray50};
  ${token.typography('body', 'lg', 'medium')}

  &:hover {
    color: ${token.colors.gray.gray80};
  }
`

export const IconBox = styled.span`
  ${token.flexCenter}
  flex: 0 0 auto;
  width: 10px;
  height: 16px;
`

export const PageTitle = styled.h1`
  color: ${token.colors.gray.gray100};
  white-space: nowrap;
  ${token.typography('heading', 'lg', 'semibold')}
`

export const StatusText = styled.p`
  ${token.flexCenter}
  width: 100%;
  padding: 120px 0;
  color: ${token.colors.gray.gray40};
  ${token.typography('body', 'lg', 'medium')}
`
