import { useId } from 'react'

import {
  OverviewAttentionBadge,
  OverviewCard,
  OverviewContent,
  OverviewDonut,
  OverviewDonutCenter,
  OverviewDonutLabel,
  OverviewDonutValue,
  OverviewHeader,
  OverviewLegend,
  OverviewLegendDot,
  OverviewLegendLabel,
  OverviewLegendName,
  OverviewLegendPercent,
  OverviewLegendRow,
  OverviewLegendValue,
  OverviewTitle,
} from './MentoringOverviewCard.style'
import type {
  MentoringOverviewCardProps,
  MentoringOverviewSegment,
} from './MentoringOverviewCard.types'

export function MentoringOverviewCard({
  attentionCount,
  centerLabel,
  centerValue,
  itemUnit,
  items,
  title,
}: MentoringOverviewCardProps) {
  const titleId = useId()
  const totalValue = items.reduce((total, item) => total + item.value, 0)
  const getCumulativePercent = (itemCount: number) => {
    if (totalValue === 0) {
      return 0
    }

    const cumulativeValue = items
      .slice(0, itemCount)
      .reduce((total, item) => total + item.value, 0)

    return (cumulativeValue / totalValue) * 100
  }

  const segments: MentoringOverviewSegment[] = items.map((item, index) => {
    return {
      tone: item.tone,
      startPercent: getCumulativePercent(index),
      endPercent:
        index === items.length - 1 && totalValue > 0
          ? 100
          : getCumulativePercent(index + 1),
    }
  })

  const chartDescription = items
    .map((item) => {
      const percent = totalValue === 0 ? 0 : (item.value / totalValue) * 100

      return `${item.label} ${item.value}${itemUnit} ${percent.toFixed(1)}%`
    })
    .join(', ')

  return (
    <OverviewCard aria-labelledby={titleId}>
      <OverviewHeader>
        <OverviewTitle id={titleId}>{title}</OverviewTitle>
        {attentionCount !== undefined && (
          <OverviewAttentionBadge $hasAttention={attentionCount > 0}>
            <span>주의 필요</span>
            <strong>{attentionCount}명</strong>
          </OverviewAttentionBadge>
        )}
      </OverviewHeader>
      <OverviewContent>
        <OverviewDonut
          $segments={segments}
          $hasValues={totalValue > 0}
          role="img"
          aria-label={`${centerLabel} ${centerValue}. ${chartDescription}`}
        >
          <OverviewDonutCenter>
            <OverviewDonutLabel>{centerLabel}</OverviewDonutLabel>
            <OverviewDonutValue>{centerValue}</OverviewDonutValue>
          </OverviewDonutCenter>
        </OverviewDonut>
        <OverviewLegend aria-label={`${title} 상세 수치`}>
          {items.map((item) => {
            const percent = totalValue === 0 ? 0 : (item.value / totalValue) * 100

            return (
              <OverviewLegendRow key={item.label}>
                <OverviewLegendLabel>
                  <OverviewLegendDot $tone={item.tone} aria-hidden="true" />
                  <OverviewLegendName>{item.label}</OverviewLegendName>
                </OverviewLegendLabel>
                <OverviewLegendValue>
                  {item.value}{itemUnit}{' '}
                  <OverviewLegendPercent>({percent.toFixed(1)}%)</OverviewLegendPercent>
                </OverviewLegendValue>
              </OverviewLegendRow>
            )
          })}
        </OverviewLegend>
      </OverviewContent>
    </OverviewCard>
  )
}
