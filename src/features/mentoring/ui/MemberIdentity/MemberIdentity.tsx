import { FaHammer } from 'react-icons/fa'

import { UserName } from '@/entities/user'
import { getNameStyleKey } from '@/shared/styles'
import type { ProfileAvatarEquippedItems } from '@/shared/ui'

import * as S from './MemberIdentity.style'

interface MemberIdentityProps {
  userName?: string
  equippedItems?: ProfileAvatarEquippedItems
  fallbackName?: string
  className?: string
}

export function MemberIdentity({
  userName,
  equippedItems,
  fallbackName = '멤버',
  className,
}: MemberIdentityProps) {
  const nameColor = equippedItems?.nameColor
  const nameStyleKey = getNameStyleKey(
    nameColor?.styleKey ??
      nameColor?.valueColor ??
      nameColor?.value_color ??
      nameColor?.valueText ??
      nameColor?.itemName,
  )
  const titleText =
    equippedItems?.title?.valueText ?? equippedItems?.title?.itemName
  const displayName = userName ?? fallbackName

  return (
    <S.Identity className={className}>
      <S.Name>
        {nameStyleKey ? (
          <UserName styleKey={nameStyleKey}>{displayName}</UserName>
        ) : (
          displayName
        )}
      </S.Name>
      {titleText && (
        <S.Title title={titleText}>
          {titleText === '최초의 개발자' && (
            <FaHammer size={12} aria-hidden="true" focusable="false" />
          )}
          <span>{titleText}</span>
        </S.Title>
      )}
    </S.Identity>
  )
}
