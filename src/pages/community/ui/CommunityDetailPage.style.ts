import styled from 'styled-components'

import * as token from '@/shared/styles/values/token'

export const Page = styled.section`
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
  margin: 0 auto;
  zoom: min(1, calc(100cqw / 1003px));
`

export const BackButton = styled.button`
  ${token.flexLeft}
  align-self: flex-start;
  gap: 8px;
  height: 21px;
  padding: 0;
  border: 0;
  color: ${token.colors.gray.gray50};
  background: transparent;
  ${token.typography('body', 'lg', 'medium')}
  line-height: 1;
  cursor: pointer;
`

export const BackIcon = styled.img`
  width: 9.257px;
  height: 16px;
  transform: rotate(180deg);
`

export const Article = styled.article`
  ${token.flexColumn}
  gap: 28px;
  width: 100%;
`

export const ArticleHeading = styled.div`
  ${token.flexColumn}
  gap: 20px;
  width: 100%;
`

export const TitleBlock = styled.div`
  ${token.flexColumn}
  gap: 16px;
  width: 100%;
`

export const CategoryBadge = styled.span`
  ${token.flexCenter}
  box-sizing: border-box;
  width: 80px;
  min-height: 29px;
  padding: 6px 12px;
  border-radius: ${token.shapes.small};
  color: ${token.colors.gray.gray100};
  background: ${token.colors.primary.primary40};
  ${token.typography('body', 'sm', 'bold')}
  line-height: 1.2;
  white-space: nowrap;
`

export const TitleRow = styled.div`
  ${token.flexBetween}
  width: 100%;
`

export const Title = styled.h1`
  margin: 0;
  color: ${token.colors.gray.gray100};
  ${token.typography('heading', 'lg', 'semibold')}
  line-height: 1.18;
  white-space: nowrap;
`

export const PostMeta = styled.div`
  ${token.flexLeft}
  flex: 0 0 auto;
  gap: 12px;
  height: 34px;
`

export const PostAuthor = styled.div`
  ${token.flexLeft}
  gap: 8px;
`

export const PostAuthorImage = styled.img`
  width: 22px;
  height: 22px;
  border: 1px solid ${token.colors.gray.gray10};
  border-radius: ${token.shapes.circle};
  object-fit: cover;
`

export const PostAuthorName = styled.span`
  color: ${token.colors.gray.gray80};
  ${token.typography('body', 'md', 'medium')}
  line-height: 1;
  white-space: nowrap;
`

export const MetaDot = styled.span`
  width: 4px;
  height: 4px;
  border-radius: ${token.shapes.circle};
  background: ${token.colors.gray.gray40};
`

export const PostDate = styled.time`
  color: ${token.colors.gray.gray50};
  ${token.typography('body', 'md', 'regular')}
  line-height: 1;
  white-space: nowrap;
`

export const Divider = styled.hr`
  width: 100%;
  height: 1px;
  margin: 0;
  border: 0;
  background: ${token.colors.gray.gray10};
`

export const BodyText = styled.p`
  margin: 0;
  color: ${token.colors.gray.gray100};
  ${token.typography('body', 'lg', 'medium')}
  line-height: 1.4;
  white-space: pre-line;
`

export const Engagement = styled.section`
  ${token.flexColumn}
  gap: 28px;
  width: 100%;
`

export const EngagementRow = styled.div`
  ${token.flexLeft}
  gap: 16px;
  height: 36px;
`

export const StatGroup = styled.div`
  ${token.flexLeft}
  gap: 20px;
  box-sizing: border-box;
  height: 36px;
  padding: 8px 12px;
  border-radius: ${token.shapes.small};
  background: #f5f5f5;
`

export const Stat = styled.span`
  ${token.flexLeft}
  gap: 6px;
  color: ${token.colors.gray.gray80};
  ${token.typography('body', 'md', 'semibold')}
  line-height: 1;
  white-space: nowrap;
`

export const StatIcon = styled.img`
  width: 20px;
  height: 20px;
  object-fit: none;
`

export const AttachmentButton = styled.button`
  ${token.flexLeft}
  gap: 12px;
  box-sizing: border-box;
  height: 36px;
  padding: 8px 12px;
  overflow: hidden;
  border: 0;
  border-radius: ${token.shapes.small};
  color: ${token.colors.gray.gray70};
  background: #f5f5f5;
  cursor: pointer;
`

export const AttachmentLabel = styled.span`
  ${token.flexLeft}
  gap: 4px;
  ${token.typography('body', 'md', 'medium')}
  line-height: 1;
  white-space: nowrap;
`

export const AttachmentIcon = styled.img`
  width: 20px;
  height: 20px;
`

export const AttachmentDivider = styled.span`
  width: 1px;
  height: 22px;
  background: ${token.colors.gray.gray20};
`

export const AttachmentChevron = styled.img`
  width: 20px;
  height: 12px;
  object-fit: contain;
  transform: rotate(180deg);
`

export const Comments = styled.section`
  ${token.flexColumn}
  gap: 20px;
  width: 100%;
`

export const CommentComposer = styled.div`
  ${token.flexColumn}
  align-items: flex-end;
  gap: 12px;
  width: 100%;
`

export const CommentForm = styled.div`
  ${token.flexColumn}
  gap: 16px;
  width: 100%;
`

export const CommentHeading = styled.h2`
  margin: 0;
  color: ${token.colors.gray.gray100};
  ${token.typography('heading', 'sm', 'semibold')}
  line-height: 1.2;
`

export const CommentInputRow = styled.div`
  ${token.flexBetween}
  box-sizing: border-box;
  width: 100%;
  height: 52px;
  padding: 10px 20px;
  overflow: hidden;
  border-radius: ${token.shapes.medium};
  background: ${token.colors.gray.gray0};
`

export const CommentInput = styled.input`
  flex: 1 1 0;
  min-width: 0;
  border: 0;
  outline: 0;
  color: ${token.colors.gray.gray80};
  background: transparent;
  ${token.typography('body', 'lg', 'medium')}
  line-height: 1;

  &::placeholder {
    color: ${token.colors.gray.gray40};
  }
`

export const SendButton = styled.button`
  ${token.flexCenter}
  flex: 0 0 32px;
  width: 32px;
  height: 32px;
  padding: 0;
  border: 0;
  background: transparent;
  cursor: pointer;
`

export const SendIcon = styled.img`
  width: 32px;
  height: 32px;
`

export const AnonymousLabel = styled.label`
  ${token.flexLeft}
  gap: 8px;
  color: ${token.colors.gray.gray70};
  ${token.typography('body', 'lg', 'medium')}
  line-height: 1;
  cursor: pointer;
`

export const AnonymousCheckbox = styled.input`
  appearance: none;
  width: 20px;
  height: 20px;
  margin: 0;
  border: 1.6px solid ${token.colors.gray.gray40};
  border-radius: ${token.shapes.xsmall};
  background: ${token.colors.white};
  cursor: pointer;

  &:checked {
    border-color: ${token.colors.primary.primary50};
    background: ${token.colors.primary.primary50};
    box-shadow: inset 0 0 0 4px ${token.colors.white};
  }
`

export const CommentList = styled.div`
  ${token.flexColumn}
  box-sizing: border-box;
  width: 100%;
  padding: 5px 4px;
  overflow: hidden;
`

export const CommentRow = styled.article`
  ${token.flexLeft}
  gap: 10px;
  width: 100%;
  height: 80px;
`

export const ReplyGuide = styled.span`
  position: relative;
  align-self: stretch;
  flex: 0 0 24px;

  &::after {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 12px;
    width: 1px;
    background: ${token.colors.gray.gray10};
    content: '';
  }
`

export const CommentItem = styled.div`
  display: flex;
  flex: 0 0 521px;
  gap: 6px;
  align-items: flex-start;
`

export const CommentAuthorImage = styled.img`
  flex: 0 0 32px;
  width: 32px;
  height: 32px;
  border: 1px solid ${token.colors.gray.gray10};
  border-radius: ${token.shapes.circle};
  object-fit: cover;
`

export const CommentContent = styled.div`
  ${token.flexColumn}
  flex: 0 0 483px;
  gap: 8px;
`

export const CommentHeader = styled.div`
  ${token.flexLeft}
  gap: 28px;
  height: 32px;
`

export const CommentMeta = styled.div`
  ${token.flexLeft}
  gap: 8px;
  padding: 4px 0;
`

export const CommentAuthor = styled.span`
  color: #404040;
  ${token.typography('heading', 'sm', 'semibold')}
  line-height: 1.2;
  white-space: nowrap;
`

export const CommentDate = styled.time`
  color: ${token.colors.gray.gray40};
  ${token.typography('body', 'md', 'regular')}
  line-height: 1;
  white-space: nowrap;
`

export const CommentMenuButton = styled.button`
  ${token.flexCenter}
  width: 24px;
  height: 24px;
  padding: 0;
  border: 0;
  background: transparent;
  cursor: pointer;
`

export const CommentMenuIcon = styled.img`
  width: 24px;
  height: 24px;
`

export const CommentText = styled.p`
  margin: 0;
  color: #404040;
  ${token.typography('body', 'lg', 'medium')}
  line-height: 1.17;
`
