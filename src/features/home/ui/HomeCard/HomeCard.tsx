import type { PropsWithChildren, ReactNode } from 'react'

import * as S from './HomeCard.style'

interface HomeCardProps extends PropsWithChildren {
  title: string
  actions?: ReactNode // 더보기 버튼, 탭 등 헤더 우측 요소
  isEmpty?: boolean
  emptyText?: string
}

export function HomeCard({
  title,
  actions,
  isEmpty = false,
  emptyText = '표시할 내용이 없어요',
  children,
}: HomeCardProps) {
  return (
    <S.Card>
      <S.Header>
        <S.Title>{title}</S.Title>
        {actions && <S.Actions>{actions}</S.Actions>}
      </S.Header>
      <S.Content>
        {/* 조회 결과가 비어 있는 경우 안내 문구를 대신 보여준다. */}
        {isEmpty ? <S.EmptyText>{emptyText}</S.EmptyText> : children}
      </S.Content>
    </S.Card>
  )
}
