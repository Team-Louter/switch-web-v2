import styled from 'styled-components'

import * as token from '@/shared/styles/values/token'

export const PageContainer = styled.div`
  ${token.flexColumnStart}
  position: relative;
  width: 100%;
  height: 100dvh;
  gap: 40px;
  padding: 80px 100px 0;
  overflow: hidden;
  background-color: ${token.colors.white};
`

export const Header = styled.header`
  ${token.flexBetween}
  width: 100%;
  flex-shrink: 0;
`

export const TitleGroup = styled.div`
  ${token.flexLeft}
  gap: 16px;
`

export const Title = styled.h1`
  ${token.typography('heading', 'xl', 'semibold')}
  margin: 0;
  color: ${token.colors.gray.gray100};
`

export const Subtitle = styled.p`
  ${token.typography('body', 'lg', 'medium')}
  margin: 0;
  color: ${token.colors.gray.gray50};
`

export const QuestionSection = styled.section`
  ${token.flexColumnStart}
  width: 100%;
  flex: 1 1 0;
  min-height: 0;
  gap: 10px;
  padding: 28px 0 10px;
  border-radius: 24px;
  background-color: ${token.colors.gray.gray0};
`

export const SectionHeader = styled.div`
  ${token.flexBetween}
  width: 100%;
  flex-shrink: 0;
  padding: 0 24px;
`

export const SectionTitle = styled.h2`
  ${token.typography('heading', 'md', 'semibold')}
  margin: 0;
  color: ${token.colors.gray.gray100};
`

export const RoomScroll = styled.div`
  ${token.flexRow}
  width: 100%;
  flex: 1 1 0;
  min-height: 0;
  gap: 13px;
  padding: 18px 24px;
  overflow-x: auto;
`

export const StateText = styled.p`
  ${token.typography('body', 'md', 'medium')}
  margin: 0;
  padding: 18px 24px;
  color: ${token.colors.gray.gray50};
`
