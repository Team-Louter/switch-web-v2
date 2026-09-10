import styled, { css } from 'styled-components'

import * as token from '@/shared/styles/values/token'

export const Page = styled.section`
  ${token.flexColumn}
  align-items: center;
  justify-content: flex-start;
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
  min-height: calc(100vh - 100px);
  gap: 40px;
`

export const ProfileSection = styled.section`
  ${token.flexLeft}
  align-items: center;
  width: 100%;
  gap: 40px;
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

export const ProfileTitle = styled.span`
  margin: 0;
  color: ${token.colors.primary.text};
  line-height: 1;
  ${token.typography('body', 'lg', 'regular')}
`

export const ProfileName = styled.h1`
  margin: 0;
  color: #FFA20A;
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
  flex: 0 0 auto;
  gap: 10px;
`

export const ActionButton = styled.button<{
  $variant?: 'primary' | 'secondary' | 'outline'
}>`
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
      : $variant === 'secondary'
        ? css`
            background: ${token.colors.gray.gray10};
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

export const PostList = styled.div`
  ${token.flexColumn}
  width: 100%;
  gap: 20px;
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
  margin-top: auto;
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
