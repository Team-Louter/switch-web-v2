import styled from 'styled-components'

import * as token from '@/shared/styles/values/token'

type StatIconKind = 'heart' | 'comment' | 'view'

export const Page = styled.section`
  ${token.flexColumnCenter}
  box-sizing: border-box;
  min-height: 100dvh;
  padding: 50px 100px;
  container-type: inline-size;
  background: ${token.colors.white};
`

export const Content = styled.div`
  ${token.flexColumn}
  gap: 40px;
  width: 1003px;
  zoom: min(1, calc(100cqw / 1003px));
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
  width: min(1000px, 100%);
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
  width: 100%;
  background: ${token.colors.white};
`

export const PostRow = styled.article`
  display: flex;
  gap: 10px;
  align-items: center;
  box-sizing: border-box;
  width: min(1000px, 100%);
  height: 72px;
  padding: 10px;
  overflow: hidden;
  background: ${token.colors.white};
`

export const CategoryCell = styled.div`
  ${token.flexCenter}
  flex: 0 0 80px;
  height: 100%;
  overflow: hidden;
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

export const PinnedIcon = styled.img`
  flex: 0 0 28px;
  width: 28px;
  height: 28px;
`

export const PostTitle = styled.p<{ $pinned: boolean }>`
  display: flex;
  flex: 0 0 ${({ $pinned }) => ($pinned ? '310px' : '348px')};
  align-items: center;
  box-sizing: border-box;
  height: 100%;
  overflow: hidden;
  margin: 0;
  padding: 12px 0;
  color: ${token.colors.gray.gray100};
  ${token.typography('body', 'lg', 'semibold')}
  line-height: 1.2;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const Author = styled.div`
  ${token.flexCenter}
  flex: 0 0 120px;
  gap: 8px;
  box-sizing: border-box;
  height: 100%;
  padding: 12px 4px;
  overflow: hidden;
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
  flex: 0 0 72px;
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
  flex: 0 0 176px;
  box-sizing: border-box;
  height: 100%;
  padding: 10px;
  color: ${token.colors.gray.gray80};
  ${token.typography('body', 'lg', 'medium')}
  line-height: 1.2;
  white-space: nowrap;
`

export const Stats = styled.div`
  ${token.flexCenter}
  flex: 0 0 214px;
  gap: 12px;
  box-sizing: border-box;
  height: 100%;
  padding: 12px 15.5px;
  overflow: hidden;
`

export const Stat = styled.span`
  ${token.flexLeft}
  flex: 0 0 53px;
  gap: 4px;
  width: 53px;
  color: ${token.colors.gray.gray80};
  ${token.typography('body', 'lg', 'medium')}
  line-height: 1;
`

export const StatIcon = styled.img<{ $kind: StatIconKind }>`
  flex: 0 0 auto;
  width: 24px;
  height: 24px;
  object-fit: none;
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
