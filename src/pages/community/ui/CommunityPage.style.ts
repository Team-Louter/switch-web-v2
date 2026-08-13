import styled from 'styled-components'

import * as token from '@/shared/styles/values/token'

type StatIconKind = 'heart' | 'comment' | 'view'

export const Page = styled.section`
  ${token.flexColumnCenter}
  box-sizing: border-box;
  min-height: 100dvh;
  padding: 50px 100px;
  background: ${token.colors.white};
`

export const Content = styled.div`
  ${token.flexColumn}
  gap: 40px;
  width: 100%;
  max-width: 1003px;
`

export const Header = styled.header`
  ${token.flexColumn}
  gap: 20px;
`

export const HeadingRow = styled.div`
  ${token.flexBetween}
  gap: 24px;
`

export const Heading = styled.h1`
  margin: 0;
  color: ${token.colors.gray.gray100};
  ${token.typography('heading', 'lg', 'semibold')}
  line-height: 1.18;
`

export const HeadingDescription = styled.p`
  margin: 0 0 0 16px;
  color: ${token.colors.gray.gray50};
  ${token.typography('body', 'lg', 'medium')}
  line-height: 1.17;
`

export const HeadingGroup = styled.div`
  ${token.flexLeft}
  min-width: 0;
`

export const CategoryTabs = styled.div`
  ${token.flexBetween}
  box-sizing: border-box;
  min-height: 56px;
  padding: 4px;
  border-radius: ${token.shapes.xlarge};
  background: ${token.colors.gray.gray0};
`

export const CategoryTab = styled.button<{ $active: boolean }>`
  flex: 0 0 116px;
  min-height: 48px;
  border: 0;
  border-radius: ${token.shapes.large};
  color: ${({ $active }) =>
    $active ? token.colors.gray.gray100 : token.colors.gray.gray50};
  background: ${({ $active }) =>
    $active ? token.colors.white : 'transparent'};
  ${token.typography('heading', 'sm', 'medium')}
  line-height: 1;
  cursor: pointer;
`

export const PostList = styled.section`
  overflow: hidden;
  background: ${token.colors.white};
`

export const PostRow = styled.article`
  display: grid;
  grid-template-columns: 100px minmax(0, 1fr) 140px 180px 214px;
  align-items: center;
  box-sizing: border-box;
  min-height: 72px;
  padding: 10px;
  background: ${token.colors.white};
`

export const CategoryCell = styled.div`
  ${token.flexLeft}
  min-width: 0;
`

export const PostCategory = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  min-width: 80px;
  min-height: 29px;
  padding: 6px 12px;
  border-radius: ${token.shapes.small};
  color: ${token.colors.gray.gray100};
  background: ${token.colors.primary.primary40};
  ${token.typography('body', 'sm', 'bold')}
  line-height: 1.2;
  white-space: nowrap;
`

export const PostTitle = styled.p`
  overflow: hidden;
  margin: 0;
  color: ${token.colors.gray.gray100};
  ${token.typography('body', 'lg', 'semibold')}
  line-height: 1.2;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const Author = styled.div`
  ${token.flexCenter}
  gap: 8px;
  min-width: 0;
  padding: 0 12px;
`

export const AuthorImage = styled.img`
  flex: 0 0 auto;
  width: 32px;
  height: 32px;
  border: 1px solid ${token.colors.gray.gray10};
  border-radius: ${token.shapes.circle};
  object-fit: cover;
`

export const AuthorName = styled.p`
  overflow: hidden;
  margin: 0;
  color: ${token.colors.gray.gray80};
  ${token.typography('body', 'lg', 'medium')}
  line-height: 1.2;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const Date = styled.time`
  ${token.flexCenter}
  color: ${token.colors.gray.gray80};
  ${token.typography('body', 'lg', 'medium')}
  line-height: 1.2;
  white-space: nowrap;
`

export const Stats = styled.div`
  ${token.flexCenter}
  gap: 12px;
  min-width: 0;
  padding: 0 16px;
`

export const Stat = styled.span`
  ${token.flexLeft}
  gap: 4px;
  min-width: 0;
  color: ${token.colors.gray.gray80};
  ${token.typography('body', 'lg', 'medium')}
  line-height: 1;
`

export const StatIcon = styled.img<{ $kind: StatIconKind }>`
  flex: 0 0 auto;
  width: ${({ $kind }) => ($kind === 'view' ? '24px' : '20px')};
  height: ${({ $kind }) => ($kind === 'comment' ? '18px' : '20px')};
  object-fit: contain;
`

export const Pagination = styled.nav`
  ${token.flexCenter}
  gap: 12px;
`

export const PageButton = styled.button<{ $active: boolean }>`
  ${token.flexCenter}
  box-sizing: border-box;
  width: 36px;
  height: 36px;
  padding: 7px 12px;
  border: 0;
  border-radius: ${token.shapes.large};
  color: ${token.colors.gray.gray100};
  background: ${({ $active }) =>
    $active ? token.colors.primary.primary30 : 'transparent'};
  ${token.typography('heading', 'sm', 'semibold')}
  line-height: 1;
  cursor: pointer;
`
