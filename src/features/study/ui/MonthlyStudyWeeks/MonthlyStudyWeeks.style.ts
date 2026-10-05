import styled from 'styled-components'

import * as token from '@/shared/styles/values/token'

export type WeekStatus = 'submitted' | 'due' | 'overdue' | 'locked'

const statusColor: Record<WeekStatus, string> = {
  submitted: token.colors.success.success10,
  due: token.colors.warning.warning10,
  overdue: token.colors.danger.danger10,
  locked: token.colors.gray.gray20,
}

export const Grid = styled.div`
  display: flex;
  flex: 1 1 auto;
  flex-flow: column wrap;
  align-content: flex-start;
  height: 100%;
  gap: 10px 16px;

  @container learning-week (max-width: 980px) {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
    width: 100%;
    height: auto;
    gap: 10px 12px;
  }

  @media (max-width: 768px) {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    width: 100%;
    height: auto;
    gap: 10px;
  }

  @media (max-width: 380px) {
    grid-template-columns: 1fr;
  }
`

export const StudyItem = styled.button<{ $status: WeekStatus }>`
  ${token.typography('heading', 'sm', 'semibold')};
  display: flex;
  flex: 0 0 25px;
  align-items: center;
  width: 130px;
  height: 25px;
  padding: 0 5px 0px 10px;
  border: 1px solid ${({ $status }) => statusColor[$status]};
  border-radius: ${token.shapes.xsmall};
  background-color: ${token.colors.white};
  color: ${({ $status }) =>
    $status === 'locked' ? token.colors.gray.gray20 : token.colors.gray.gray70};
  cursor: ${({ $status }) => ($status === 'locked' ? 'not-allowed' : 'pointer')};
  text-align: left;
  z-index: 1;

  @container learning-week (max-width: 980px) {
    width: 100%;
    height: 34px;
    min-width: 0;
    flex-basis: auto;
    padding-inline: 10px 8px;
  }

  @media (max-width: 768px) {
    width: 100%;
    height: 40px;
    min-width: 0;
    flex-basis: auto;
    padding-inline: 10px 8px;
  }
`

export const LeadingIcon = styled.span<{ $locked: boolean }>`
  display: inline-flex;
  flex-shrink: 0;
  width: 12px;
  height: 12px;
  margin-right: 10px;
  color: ${({ $locked }) =>
    $locked ? token.colors.gray.gray20 : token.colors.gray.gray60};

  svg {
    width: 100%;
    height: 100%;
    fill: ${({ $locked }) => ($locked ? 'currentColor' : 'none')};
    stroke: ${({ $locked }) => ($locked ? 'none' : 'currentColor')};
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
`

export const Label = styled.span`
  ${token.typography('caption', 'sm', 'semibold')};
  min-width: 0;
  overflow: hidden;
  color: ${token.colors.gray.gray70};
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const StatusMark = styled.span<{
  $status: Exclude<WeekStatus, 'locked'>
}>`
  display: inline-flex;
  flex-shrink: 0;
  width: 15px;
  height: 15px;
  margin-left: auto;
  color: ${({ $status }) => statusColor[$status]};

  svg {
    width: 100%;
    height: 100%;
    fill: currentColor;
    stroke: ${token.colors.white};
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
`
