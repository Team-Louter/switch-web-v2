import * as S from "./SummaryCard.style"

type SummaryCardProps = {
  icon: React.ReactNode,
  label: string,
  value: string,
  unit: string
}

export function SummaryCard({ icon, label, value, unit }: SummaryCardProps) {
  return (
    <S.Card>
      <S.IconContainer>{icon}</S.IconContainer>
      <S.Column>
        <S.Label>{label}</S.Label>
        <S.Value>{value}{unit}</S.Value>
      </S.Column>
    </S.Card>
  )
}