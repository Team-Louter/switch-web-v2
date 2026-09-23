import styled from 'styled-components'

import * as token from '@/shared/styles/values/token'

import type {
  MentoringOverviewSegment,
  MentoringOverviewTone,
} from './MentoringOverviewCard.types'

const toneColor: Record<MentoringOverviewTone, string> = {
  success: '#2FBA6D',
  danger: '#F0445E',
  warning: '#FF9F1C',
  info: '#7657F6',
}

export const OverviewCard = styled.section`
  ${token.flexColumnStart}
  gap: 12px;
  min-width: 0;
  min-height: 192px;
  padding: 18px 20px;
  border: 1px solid ${token.colors.gray.gray10};
  border-radius: ${token.shapes.large};
  background: ${token.colors.white};
  ${token.elevation('black_1')}

  @media (max-width: 640px) {
    padding: 18px 16px;
  }
`

export const OverviewHeader = styled.header`
  ${token.flexBetween}
  gap: 12px;
  width: 100%;
  min-height: 22px;
`

export const OverviewTitle = styled.h2`
  min-width: 0;
  margin: 0;
  color: ${token.colors.gray.gray80};
  line-height: 1.25;
  ${token.typography('body', 'md', 'semibold')}
`

export const OverviewAttentionBadge = styled.div<{ $hasAttention: boolean }>`
  ${token.flexLeft}
  flex: 0 0 auto;
  gap: 5px;
  padding: 5px 9px;
  border-radius: ${token.shapes.circle};
  background: ${({ $hasAttention }) =>
    $hasAttention ? token.colors.danger.danger0 : token.colors.gray.gray0};
  color: ${({ $hasAttention }) =>
    $hasAttention ? '#F0445E' : token.colors.gray.gray60};
  white-space: nowrap;
  ${token.typography('caption', 'md', 'medium')}

  strong {
    color: ${token.colors.gray.gray90};
    ${token.typography('caption', 'md', 'semibold')}
  }
`

export const OverviewContent = styled.div`
  display: grid;
  grid-template-columns: 108px minmax(0, 1fr);
  align-items: center;
  gap: 18px;
  width: 100%;
  flex: 1 1 auto;

  @media (max-width: 420px) {
    grid-template-columns: 88px minmax(0, 1fr);
    gap: 12px;
  }
`

export const OverviewDonut = styled.div<{
  $segments: MentoringOverviewSegment[]
  $hasValues: boolean
}>`
  ${token.flexCenter}
  position: relative;
  width: 108px;
  aspect-ratio: 1;
  border-radius: ${token.shapes.circle};
  background: ${({ $segments, $hasValues }) =>
    $hasValues
      ? `conic-gradient(${$segments
          .map(
            ({ tone, startPercent, endPercent }) =>
              `${toneColor[tone]} ${startPercent}% ${endPercent}%`,
          )
          .join(', ')})`
      : token.colors.gray.gray10};

  &::before {
    position: absolute;
    inset: 12px;
    border-radius: inherit;
    background: ${token.colors.white};
    content: '';
  }

  @media (max-width: 420px) {
    width: 88px;

    &::before {
      inset: 10px;
    }
  }
`

export const OverviewDonutCenter = styled.div`
  ${token.flexColumnCenter}
  position: relative;
  max-width: calc(100% - 12px);
  gap: 3px;
  text-align: center;
`

export const OverviewDonutLabel = styled.span`
  color: ${token.colors.gray.gray50};
  line-height: 1.2;
  ${token.typography('caption', 'md', 'medium')}
`

export const OverviewDonutValue = styled.strong`
  color: ${token.colors.gray.gray90};
  line-height: 1.1;
  letter-spacing: -0.03em;
  white-space: nowrap;
  ${token.typography('body', 'lg', 'bold')}
`

export const OverviewLegend = styled.ul`
  ${token.flexColumnStart}
  width: 100%;
  margin: 0;
  padding: 0;
  list-style: none;
`

export const OverviewLegendRow = styled.li`
  ${token.flexBetween}
  gap: 8px;
  width: 100%;
  min-height: 32px;
  padding: 6px 0;
  border-bottom: 1px solid ${token.colors.gray.gray10};

  &:last-child {
    border-bottom: 0;
  }
`

export const OverviewLegendLabel = styled.span`
  ${token.flexLeft}
  min-width: 0;
  gap: 8px;
  color: ${token.colors.gray.gray70};
  line-height: 1.2;
  ${token.typography('body', 'sm', 'medium')}
`

export const OverviewLegendDot = styled.span<{ $tone: MentoringOverviewTone }>`
  flex: 0 0 auto;
  width: 8px;
  height: 8px;
  border-radius: ${token.shapes.circle};
  background: ${({ $tone }) => toneColor[$tone]};
`

export const OverviewLegendName = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const OverviewLegendValue = styled.strong`
  flex: 0 0 auto;
  color: ${token.colors.gray.gray90};
  line-height: 1.2;
  white-space: nowrap;
  ${token.typography('body', 'sm', 'semibold')}
`

export const OverviewLegendPercent = styled.span`
  color: ${token.colors.gray.gray50};
  ${token.typography('caption', 'md', 'medium')}
`
