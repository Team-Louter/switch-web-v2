import styled, { css } from 'styled-components'

import * as token from '@/shared/styles/values/token'

export const Page = styled.section`
  ${token.flexColumnCenter}
  box-sizing: border-box;
  width: 100%;
  min-width: 1060px;
  min-height: 100vh;
  gap: 40px;
  padding: 50px 30px;
  background: ${token.colors.white};
`

export const Content = styled.div`
  ${token.flexColumn}
  align-items: center;
  width: 1000px;
  gap: 40px;
`

export const ProfileSection = styled.section`
  ${token.flexLeft}
  width: 100%;
  gap: 40px;
`

export const ProfileImageWrap = styled.div`
  flex: 0 0 200px;
  width: 200px;
  height: 200px;
  overflow: hidden;
  border-radius: ${token.shapes.circle};
  background: ${token.colors.white};
`

export const ProfileImage = styled.img`
  width: 212px;
  height: 212px;
  margin-left: -6px;
  object-fit: cover;
`

export const ProfileInfo = styled.div`
  ${token.flexBetween}
  align-items: flex-start;
  flex: 1 1 0;
  min-width: 0;
`

export const ProfileTextGroup = styled.div`
  ${token.flexColumn}
  align-items: flex-start;
  gap: 20px;
`

export const ProfileIdentity = styled.div`
  ${token.flexColumn}
  align-items: flex-start;
  gap: 10px;
`

export const ProfileName = styled.h1`
  margin: 0;
  color: ${token.colors.gray.gray80};
  line-height: 1;
  ${token.typography('heading', 'lg', 'bold')}
`

export const ProfileDescription = styled.p`
  margin: 0;
  color: ${token.colors.gray.gray60};
  line-height: 1;
  ${token.typography('body', 'md', 'regular')}
`

export const ProfileEmail = styled.p`
  margin: 0;
  color: ${token.colors.gray.gray60};
  line-height: 1;
  ${token.typography('body', 'md', 'regular')}
`

export const ProfileActions = styled.div`
  ${token.flexLeft}
  gap: 10px;
`

export const ActionButton = styled.button<{ $variant?: 'primary' | 'outline' }>`
  ${token.flexCenter}
  padding: 10px 20px;
  border-radius: ${token.shapes.small};
  color: ${token.colors.gray.gray100};
  line-height: 1;
  ${token.typography('body', 'sm', 'medium')}

  ${({ $variant = 'primary' }) =>
    $variant === 'primary'
      ? css`
          background: ${token.colors.primary.primary50};
        `
      : css`
          border: 1px solid ${token.colors.gray.gray80};
          color: ${token.colors.gray.gray80};
          background: ${token.colors.white};
        `}
`

export const StatBar = styled.section`
  ${token.flexBetween}
  width: 100%;
  box-sizing: border-box;
  padding: 20px 30px;
  border-radius: ${token.shapes.medium};
  background: ${token.colors.gray.gray0};
`

export const StatItem = styled.div`
  ${token.flexLeft}
  gap: 15px;
`

export const StatLabelGroup = styled.div`
  ${token.flexLeft}
  gap: 5px;
`

export const StatIcon = styled.span`
  ${token.flexCenter}
  flex: 0 0 auto;
  width: 24px;
  height: 22px;
  color: ${token.colors.primary.primary60};

  svg {
    display: block;
    flex: 0 0 auto;
  }
`

export const StatLabel = styled.span`
  color: ${token.colors.primary.primary70};
  line-height: 1;
  ${token.typography('body', 'md', 'medium')}
`

export const StatValue = styled.span`
  color: ${token.colors.primary.primary100};
  line-height: 1;
  ${token.typography('body', 'md', 'medium')}
`

export const Divider = styled.div`
  width: 100%;
  height: 1px;
  background: ${token.colors.gray.gray20};
`

export const ActivitySection = styled.section`
  ${token.flexColumn}
  align-items: flex-start;
  width: 100%;
  gap: 20px;
`

export const ActivityHeader = styled.div`
  ${token.flexColumn}
  align-items: flex-start;
  gap: 10px;
`

export const SectionTitle = styled.h2`
  margin: 0;
  color: ${token.colors.gray.gray80};
  line-height: 1;
  ${token.typography('heading', 'sm', 'medium')}
`

export const TabList = styled.div`
  ${token.flexLeft}
  gap: 10px;
`

export const TabButton = styled.button<{ $active: boolean }>`
  ${token.flexCenter}
  padding: 10px 20px;
  border-radius: ${token.shapes.small};
  background: ${({ $active }) =>
    $active ? token.colors.gray.gray10 : token.colors.white};
  color: ${token.colors.gray.gray100};
  line-height: 1;
  ${token.typography('body', 'sm', 'medium')}
`

export const PostList = styled.div`
  ${token.flexColumn}
  width: 100%;
  gap: 0;
`

export const PostRow = styled.article`
  ${token.flexLeft}
  width: 100%;
  height: 72px;
  box-sizing: border-box;
  gap: 10px;
  padding: 10px;
  background: ${token.colors.white};
`

export const CommentPostRow = styled(PostRow)`
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 4px;
`

export const PostMainLine = styled.div`
  ${token.flexLeft}
  width: 100%;
  gap: 10px;
`

export const CategoryBadge = styled.span`
  ${token.flexCenter}
  flex: 0 0 80px;
  width: 80px;
  box-sizing: border-box;
  padding: 6px 12px;
  border-radius: ${token.shapes.small};
  background: ${token.colors.primary.primary40};
  color: ${token.colors.gray.gray100};
  line-height: 1;
  ${token.typography('caption', 'lg', 'bold')}
`

export const PostTitle = styled.p`
  flex: 0 0 348px;
  width: 348px;
  min-width: 0;
  margin: 0;
  overflow: hidden;
  color: ${token.colors.gray.gray100};
  line-height: 1;
  text-overflow: ellipsis;
  white-space: nowrap;
  ${token.typography('body', 'md', 'semibold')}
`

export const AuthorCell = styled.div`
  ${token.flexCenter}
  flex: 0 0 120px;
  width: 120px;
  gap: 8px;
`

export const AuthorAvatar = styled.img`
  width: 32px;
  height: 32px;
  border: 1px solid ${token.colors.gray.gray10};
  border-radius: ${token.shapes.circle};
  object-fit: cover;
`

export const AuthorName = styled.span`
  width: 72px;
  color: ${token.colors.gray.gray80};
  line-height: 1;
  ${token.typography('body', 'md', 'medium')}
`

export const DateCell = styled.span`
  ${token.flexCenter}
  flex: 0 0 176px;
  width: 176px;
  color: ${token.colors.gray.gray80};
  line-height: 1;
  white-space: nowrap;
  ${token.typography('body', 'md', 'medium')}
`

export const Metrics = styled.div`
  ${token.flexCenter}
  flex: 0 0 214px;
  width: 214px;
  gap: 12px;
`

export const Metric = styled.span`
  ${token.flexLeft}
  width: 53px;
  gap: 4px;
  color: ${token.colors.gray.gray80};
  line-height: 1;
  ${token.typography('body', 'md', 'medium')}
`

export const MaskIcon = styled.span<{ $src: string; $active?: boolean }>`
  display: inline-block;
  flex: 0 0 24px;
  width: 24px;
  height: 24px;
  background: ${({ $active }) =>
    $active ? token.colors.danger.danger20 : token.colors.gray.gray30};
  mask-image: url(${({ $src }) => $src});
  mask-position: center;
  mask-repeat: no-repeat;
  mask-size: contain;
`

export const CommentPreview = styled.p`
  margin: 0 0 0 89px;
  color: ${token.colors.gray.gray50};
  line-height: 1;
  white-space: nowrap;
  ${token.typography('caption', 'md', 'medium')}
`

export const EmptyState = styled.div`
  ${token.flexCenter}
  flex: 1 1 0;
  min-height: 236px;
  width: 100%;
  color: ${token.colors.gray.gray50};
  line-height: 1;
  text-align: center;
  ${token.typography('caption', 'md', 'medium')}
`

export const FooterActions = styled.div`
  ${token.flexLeft}
  width: 100%;
  gap: 20px;
`

export const FooterButton = styled.button<{ $danger?: boolean }>`
  ${token.flexCenter}
  flex: 1 1 0;
  min-width: 0;
  padding: 10px 20px;
  border-radius: ${token.shapes.small};
  color: ${({ $danger }) =>
    $danger ? token.colors.danger.danger20 : token.colors.primary.primary100};
  line-height: 1;
  ${token.typography('body', 'sm', 'medium')}
`

export const FooterDivider = styled.div`
  width: 1px;
  height: 20px;
  background: ${token.colors.gray.gray20};
`
