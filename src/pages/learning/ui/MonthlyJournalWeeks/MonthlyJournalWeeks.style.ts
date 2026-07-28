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
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  width: 100%;
  max-width: 280px;
  gap: 10px 0px;
`

export const WeekItem = styled.div<{ $status: WeekStatus }>`
  ${token.typography('heading', 'sm', 'semibold')};
  display: flex;
  align-items: center;
  width: 130px;
  height: 25px;
  padding: 0 10px;
  border: 1px solid ${({ $status }) => statusColor[$status]};
  border-radius: ${token.shapes.xsmall};
  background: ${token.colors.white};
  color: ${({ $status }) =>
    $status === 'locked' ? token.colors.gray.gray20 : token.colors.gray.gray70};
`

export const LeadingIcon = styled.span<{ $locked: boolean }>`
  display: inline-flex;
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
  color: ${token.colors.gray.gray70};
`

export const StatusMark = styled.span<{
  $status: Exclude<WeekStatus, 'locked'>
}>`
  display: inline-flex;
  width: 12px;
  height: 12px;
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
