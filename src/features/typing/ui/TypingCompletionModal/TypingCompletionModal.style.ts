import styled from 'styled-components'

import { Button } from '@/shared/ui'
import * as token from '@/shared/styles/values/token'

export const Overlay = styled.div`
  position: fixed;
  z-index: 1000;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgb(14 13 12 / 70%);
`

export const Dialog = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 429px;
  height: 468px;
  padding: 31px 20px 20px;
  border-radius: 10px;
  background: ${token.colors.white};
`

export const CompletionImage = styled.img`
  width: 102px;
  height: 102px;
  object-fit: cover;
`

export const Title = styled.h2`
  margin-top: 5px;
  color: ${token.colors.gray.gray100};
  ${token.typography('heading', 'md', 'semibold')}
  line-height: 1;
`

export const Description = styled.p`
  margin-top: 10px;
  color: ${token.colors.gray.gray60};
  ${token.typography('body', 'sm', 'semibold')}
  line-height: 1;
`

export const ResultList = styled.dl`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  margin-top: 17px;
`

export const ResultItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 32px;
  padding: 9px 14px;
  border: 1px solid ${token.colors.primary.primary50};
  border-radius: 6px;
  ${token.typography('caption', 'md', 'medium')}
  line-height: 1;
`

export const ResultLabel = styled.dt`
  color: ${token.colors.gray.gray50};
`

export const ResultValue = styled.dd`
  color: ${token.colors.gray.gray100};
`

export const CloseButton = styled(Button)`
  width: 100%;
  height: 33px;
  margin-top: 10px;
`
