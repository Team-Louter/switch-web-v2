import type { ReactNode } from 'react'

import * as S from './MyDialog.style'

type MyDialogSize = 'sm' | 'lg'

type MyDialogProps = {
  title: string
  descriptions?: string[]
  children?: ReactNode
  actions: ReactNode
  size?: MyDialogSize
}

export function MyDialog({
  title,
  descriptions = [],
  children,
  actions,
  size = 'lg',
}: MyDialogProps) {
  return (
    <S.Overlay>
      <S.Card $size={size}>
        <S.TextGroup>
          <S.Title>{title}</S.Title>
          {descriptions.map((description) => (
            <S.Description key={description}>{description}</S.Description>
          ))}
        </S.TextGroup>
        {children}
        <S.Actions>{actions}</S.Actions>
      </S.Card>
    </S.Overlay>
  )
}
