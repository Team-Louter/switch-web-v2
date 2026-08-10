import styled from 'styled-components'

import * as token from '@/shared/styles/values/token'

export const Article = styled.article`
  ${token.flexColumnStart}
  gap: 28px;
  width: 100%;
`

export const HeaderArea = styled.div`
  ${token.flexColumnStart}
  gap: 20px;
  width: 100%;
`

export const HeaderInner = styled.div`
  ${token.flexColumnStart}
  gap: 16px;
  width: 100%;
`

export const TitleRow = styled.div`
  ${token.flexBetween}
  gap: 24px;
  width: 100%;
`

export const Title = styled.h1`
  color: ${token.colors.gray.gray100};
  word-break: break-word;
  ${token.typography('heading', 'lg', 'semibold')}
`

export const MetaGroup = styled.div`
  ${token.flexRight}
  flex: 0 0 auto;
  gap: 12px;
`

export const AuthorGroup = styled.div`
  ${token.flexLeft}
  gap: 8px;
`

export const Avatar = styled.span`
  ${token.flexCenter}
  flex: 0 0 auto;
  width: 22px;
  height: 22px;
  overflow: hidden;
  border: 1px solid ${token.colors.gray.gray10};
  border-radius: ${token.shapes.circle};
  background: ${token.colors.white};

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`

export const AuthorName = styled.span`
  color: ${token.colors.gray.gray70};
  white-space: nowrap;
  ${token.typography('body', 'md', 'medium')}
`

export const Dot = styled.span`
  flex: 0 0 auto;
  width: 4px;
  height: 4px;
  border-radius: ${token.shapes.circle};
  background: ${token.colors.gray.gray30};
`

export const CreatedAt = styled.span`
  color: ${token.colors.gray.gray50};
  white-space: nowrap;
  ${token.typography('body', 'md', 'regular')}
`

export const Divider = styled.hr`
  width: 100%;
  height: 1px;
  border: 0;
  background: ${token.colors.gray.gray10};
`

export const Content = styled.div`
  width: 100%;
  color: ${token.colors.gray.gray90};
  line-height: 1.4;
  word-break: break-word;
  white-space: pre-wrap;
  ${token.typography('body', 'lg', 'medium')}
`

export const StatsArea = styled.div`
  ${token.flexColumnStart}
  gap: 28px;
  width: 100%;
`
