import { useEffect, useId, useState } from 'react'

import {
  OverviewAttentionBadge,
  OverviewCard,
  OverviewContent,
  OverviewDonut,
  OverviewDonutCenter,
  OverviewDonutLabel,
  OverviewDonutSegment,
  OverviewDonutSvg,
  OverviewDonutTrack,
  OverviewDonutValue,
  OverviewHeader,
  OverviewLegend,
  OverviewLegendDot,
  OverviewLegendLabel,
  OverviewLegendName,
  OverviewLegendPercent,
  OverviewLegendRow,
  OverviewLegendValue,
  OverviewRollingDigit,
  OverviewRollingDigitValue,
  OverviewRollingDigits,
  OverviewRollingSeparator,
  OverviewRollingStrip,
  OverviewTitle,
  OverviewVisuallyHidden,
} from './MentoringOverviewCard.style'
import type {
  MentoringOverviewCardProps,
  MentoringOverviewSegment,
} from './MentoringOverviewCard.types'

const ROLLING_DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
const ANIMATION_START_DELAY_MS = 50
const DONUT_RADIUS = 40
const DONUT_CIRCUMFERENCE = 2 * Math.PI * DONUT_RADIUS
const DONUT_DRAW_DURATION_MS = 900

interface RollingValueProps {
  value: string
}

function RollingValue({ value }: RollingValueProps) {
  const [displayValue, setDisplayValue] = useState(() =>
    value.replace(/\d/g, '0'),
  )

  useEffect(() => {
    const timeoutId = window.setTimeout(
      () => setDisplayValue(value),
      ANIMATION_START_DELAY_MS,
    )

    return () => window.clearTimeout(timeoutId)
  }, [value])

  return (
    <>
      <OverviewRollingDigits aria-hidden="true">
        {Array.from(displayValue).map((character, index) =>
          /\d/.test(character) ? (
            <OverviewRollingDigit key={index}>
              <OverviewRollingStrip
                style={{ transform: `translateY(-${Number(character)}em)` }}
              >
                {ROLLING_DIGITS.map((digit) => (
                  <OverviewRollingDigitValue key={digit}>
                    {digit}
                  </OverviewRollingDigitValue>
                ))}
              </OverviewRollingStrip>
            </OverviewRollingDigit>
          ) : (
            <OverviewRollingSeparator key={index}>
              {character}
            </OverviewRollingSeparator>
          ),
        )}
      </OverviewRollingDigits>
      <OverviewVisuallyHidden>{value}</OverviewVisuallyHidden>
    </>
  )
}

export function MentoringOverviewCard({
  attentionCount,
  centerLabel,
  centerValue,
  itemUnit,
  items,
  title,
}: MentoringOverviewCardProps) {
  const titleId = useId()
  const [isDonutDrawn, setIsDonutDrawn] = useState(false)
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

  useEffect(() => {
    const timeoutId = window.setTimeout(
      () => setIsDonutDrawn(true),
      ANIMATION_START_DELAY_MS,
    )

    return () => window.clearTimeout(timeoutId)
  }, [])

  return (
    <OverviewCard aria-labelledby={titleId}>
      <OverviewHeader>
        <OverviewTitle id={titleId}>{title}</OverviewTitle>
        {attentionCount !== undefined && (
          <OverviewAttentionBadge $hasAttention={attentionCount > 0}>
            <span>주의 필요</span>
            <strong>
              <RollingValue value={String(attentionCount)} />명
            </strong>
          </OverviewAttentionBadge>
        )}
      </OverviewHeader>
      <OverviewContent>
        <OverviewDonut
          role="img"
          aria-label={`${centerLabel} ${centerValue}. ${chartDescription}`}
        >
          <OverviewDonutSvg viewBox="0 0 100 100" aria-hidden="true">
            <OverviewDonutTrack cx="50" cy="50" r={DONUT_RADIUS} />
            {segments.map((segment, index) => {
              const ratio =
                Math.max(0, segment.endPercent - segment.startPercent) / 100
              const length = ratio * DONUT_CIRCUMFERENCE
              const visibleLength = isDonutDrawn ? length : 0

              return (
                <OverviewDonutSegment
                  key={`${segment.tone}-${index}`}
                  $tone={segment.tone}
                  cx="50"
                  cy="50"
                  r={DONUT_RADIUS}
                  strokeDasharray={`${visibleLength} ${DONUT_CIRCUMFERENCE - visibleLength}`}
                  strokeDashoffset={
                    -(segment.startPercent / 100) * DONUT_CIRCUMFERENCE
                  }
                  style={{
                    transitionDuration: `${Math.max(
                      ratio * DONUT_DRAW_DURATION_MS,
                      1,
                    )}ms`,
                    transitionDelay: `${
                      (segment.startPercent / 100) * DONUT_DRAW_DURATION_MS
                    }ms`,
                  }}
                />
              )
            })}
          </OverviewDonutSvg>
          <OverviewDonutCenter>
            <OverviewDonutLabel>{centerLabel}</OverviewDonutLabel>
            <OverviewDonutValue>
              <RollingValue value={centerValue} />
            </OverviewDonutValue>
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
                  <RollingValue value={String(item.value)} />{itemUnit}{' '}
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
