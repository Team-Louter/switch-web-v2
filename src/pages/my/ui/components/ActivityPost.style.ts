import styled from 'styled-components'

import * as token from '@/shared/styles/values/token'

export const Row = styled.article`
  ${token.flexColumn}
  align-items: flex-start;
  justify-content: center;
  width: 100%;
  min-height: 72px;
  box-sizing: border-box;
  gap: 4px;
  padding: 10px;
  border-radius: ${token.shapes.small};
  background: ${token.colors.white};
`

export const MainLine = styled.div`
  display: grid;
  grid-template-columns:
    80px minmax(220px, 1fr) 120px 176px
    214px;
  align-items: center;
  width: 100%;
  min-height: 32px;
  gap: 10px;
`

export const CategoryBadge = styled.span`
  ${token.flexCenter}
  width: 80px;
  height: 29px;
  border-radius: ${token.shapes.small};
  background: ${token.colors.primary.primary10};
  color: ${token.colors.primary.primary80};
  line-height: 1;
  ${token.typography('caption', 'lg', 'medium')}
`

export const Title = styled.strong`
  overflow: hidden;
  color: ${token.colors.gray.gray100};
  line-height: 1;
  text-overflow: ellipsis;
  white-space: nowrap;
  ${token.typography('body', 'md', 'semibold')}
`

export const Author = styled.div`
  ${token.flexLeft}
  gap: 8px;
  min-width: 0;
`

export const AuthorAvatar = styled.img`
  width: 32px;
  height: 32px;
  overflow: hidden;
  border-radius: ${token.shapes.circle};
  object-fit: cover;
`

export const AuthorName = styled.span`
  overflow: hidden;
  color: ${token.colors.gray.gray100};
  line-height: 1;
  text-overflow: ellipsis;
  white-space: nowrap;
  ${token.typography('body', 'sm', 'medium')}
`

export const DateText = styled.span`
  color: ${token.colors.gray.gray50};
  line-height: 1;
  text-align: center;
  white-space: nowrap;
  ${token.typography('body', 'sm', 'medium')}
`

export const Metrics = styled.div`
  ${token.flexCenter}
  gap: 12px;
  min-width: 0;
`

export const Metric = styled.span`
  ${token.flexCenter}
  gap: 4px;
  min-width: 0;
  color: ${token.colors.gray.gray40};
  line-height: 1;
  white-space: nowrap;
  ${token.typography('body', 'sm', 'medium')}
`

export const MetricIcon = styled.img`
  width: 24px;
  height: 24px;
  object-fit: contain;
`

export const CommentPreview = styled.div`
  ${token.flexLeft}
  width: 100%;
  min-height: 16px;
  color: ${token.colors.gray.gray50};
  line-height: 1;
  ${token.typography('caption', 'md', 'medium')}
`

export const CommentLabel = styled.span`
  flex: 0 0 89px;
  color: ${token.colors.gray.gray40};
`

export const CommentText = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`
