import styled from 'styled-components'

import * as token from '@/shared/styles/values/token'

type PeriodState = 'past' | 'current' | 'future'

export const PageContainer = styled.section`
  width: 100%;
  height: 100vh;
  padding: 48px;
  overflow: hidden;
  background: ${token.colors.white};
`

export const ScrollArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  height: 100%;
  min-height: 0;
  overflow-y: auto;
`

export const Column = styled.div<{ $state: PeriodState }>`
  ${token.flexColumn};
  width: 100%;
  flex: 0 0 auto;
  opacity: ${({ $state }) => ($state === 'future' ? 0.35 : 1)};
  transition: opacity 200ms ease;
`;

export const ProgressContent = styled.div`
  ${token.flexColumn};
  width: 144px;
  height: 100%;
`

export const Month = styled.span`
  ${token.typography('heading', 'md', 'semibold')}
`;

export const MonthRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

export const MonthHeading = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const Now = styled.span`
  ${token.typography('body', 'sm', 'medium')};
  color: ${token.colors.primary.text};
`;

export const TotalStudyButton = styled.button`
  ${token.typography('body', 'sm', 'medium')};
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 0;
  border: 0;
  color: ${token.colors.primary.text};
  background: transparent;
  cursor: pointer;

  svg {
    flex: 0 0 auto;
  }

  &:focus-visible {
    border-radius: ${token.shapes.xsmall};
    outline: 2px solid ${token.colors.primary.primary50};
    outline-offset: 2px;
  }
`;

export const Card = styled.div<{ $state: PeriodState }>`
  background-color: white;
  border: 2px solid
    ${({ $state }) =>
      $state === 'current'
        ? token.colors.primary.primary50
        : token.colors.gray.gray10};
  width: 100%;
  height: 170px;
  border-radius: ${token.shapes.xlarge};
  border-top-left-radius: 0;
  padding: 16px 25px;
  margin-top: 3px;
  display: flex;
  flex-direction: row;
  gap: 30px;
  position: relative;
`;

export const SubmitLabel = styled.span`
  ${token.typography('body', 'sm', 'semibold')};
  color: ${token.colors.gray.gray50};
`;

export const SubmitRate = styled.span`
  ${token.typography('heading', 'md', 'semibold')};
  color: ${token.colors.gray.gray70};
  margin-bottom: 5px;
`;

export const Status = styled.span`
  ${token.typography('caption', 'lg', 'medium')};
  color: ${token.colors.primary.text};
  margin-top: auto;
`;

export const DiaryContent = styled.div`
  position: relative;
  overflow: hidden;
  border: 2px solid ${token.colors.gray.gray10};
  flex: 1;
  border-radius: ${token.shapes.small};
  padding: 16px;
  display: flex;
  flex-direction: row;
`;

export const DecoImg = styled.img`
  position: absolute;
  top: 0;
  right: 170px;
  width: auto;
  height: 100%;
  object-fit: contain;
  pointer-events: none;
`;

export const ButtonContent = styled.div`
  width: 150px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-left: auto;
  align-items: flex-end;
`;

export const Name = styled.span`
  ${token.typography('caption', 'lg', 'semibold')};
  color: ${token.colors.gray.gray70};
`;

export const Week = styled.span`
  ${token.typography('heading', 'md', 'semibold')};
  color: ${token.colors.gray.gray70};
`;

export const WriteButton = styled.button`
  ${token.typography('caption', 'lg', 'medium')};
  color: ${token.colors.white};
  background-color: ${token.colors.gray.gray70};
  border-radius: ${token.shapes.xsmall};
  padding: 5px 35px;
  cursor: pointer;

  &:not(:disabled):hover {
    background-color: ${token.colors.gray.gray80};
  }

  &:disabled {
    background-color: ${token.colors.gray.gray50};
    cursor: not-allowed;
  }
`;

export const DecoImg2 = styled.img`
  position: absolute;
  top: 30px;
  right: 0px;
`;
