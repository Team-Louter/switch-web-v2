import styled from 'styled-components'

import * as token from '@/shared/styles/values/token'

export const Page = styled.section`
  ${token.flexColumn}
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  min-width: 1060px;
  min-height: 100dvh;
  padding: 50px 30px;
  background: ${token.colors.white};
`

export const Content = styled.div`
  ${token.flexColumn}
  align-items: flex-start;
  width: 1000px;
  min-height: calc(100dvh - 100px);
  gap: 40px;
`

export const ProfileImageSection = styled.section`
  ${token.flexLeft}
  width: 100%;
  gap: 40px;
`

export const ProfileImageWrap = styled.div`
  flex: 0 0 200px;
  width: 200px;
  height: 200px;
  overflow: hidden;
  border: 1px solid ${token.colors.gray.gray30};
  border-radius: ${token.shapes.circle};
  background: ${token.colors.white};
`

export const ProfileImage = styled.img`
  width: 212px;
  height: 212px;
  margin-top: -1px;
  margin-left: -7px;
  object-fit: cover;
`

export const ImageActions = styled.div`
  ${token.flexLeft}
  gap: 10px;
`

const BaseLineButton = styled.button`
  ${token.flexCenter}
  padding: 10px 20px;
  border-radius: ${token.shapes.small};
  background: ${token.colors.white};
  line-height: 1;
  ${token.typography('body', 'md', 'medium')}
`

export const LineButton = styled(BaseLineButton)`
  border: 1px solid ${token.colors.primary.primary70};
  color: ${token.colors.primary.primary70};
`

export const DangerLineButton = styled(BaseLineButton)`
  border: 1px solid ${token.colors.danger.danger20};
  color: ${token.colors.danger.danger20};
`

export const FormRows = styled.div`
  ${token.flexColumn}
  width: 100%;
  gap: 40px;
`

export const FieldRow = styled.div`
  ${token.flexLeft}
  align-items: flex-start;
  width: 100%;
  gap: 20px;
`

export const IconSlot = styled.span`
  flex: 0 0 auto;
  width: 22px;
  height: 21px;
  border-radius: 4px;
  background: ${token.colors.gray.gray30};
`

export const SaveButtonWrap = styled.div`
  width: 100%;
  margin-top: auto;

  button {
    width: 100%;
    color: ${token.colors.primary.primary80};
  }
`
