export type MentoringOverviewTone = 'success' | 'danger' | 'warning' | 'info'

export interface MentoringOverviewItem {
  label: string
  value: number
  tone: MentoringOverviewTone
}

export interface MentoringOverviewSegment {
  tone: MentoringOverviewTone
  startPercent: number
  endPercent: number
}

export interface MentoringOverviewCardProps {
  title: string
  centerLabel: string
  centerValue: string
  itemUnit: string
  items: MentoringOverviewItem[]
  attentionCount?: number
}
