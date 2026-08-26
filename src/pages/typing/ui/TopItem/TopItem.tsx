import * as S from './TopItem.style'

interface TopItemProps {
  medal: string,
  name: string,
  value: string
}

export function TopItem({ medal, name, value }: TopItemProps) {
  return (
    <S.Card>
      <S.MedalContainer src={medal} />
      <S.Column>
        <S.Name>{name}</S.Name>
        <S.Value>{value === '-' ? value : `${value}타`}</S.Value>
      </S.Column>
    </S.Card>
  )
}
