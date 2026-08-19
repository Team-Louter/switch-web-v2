import { useEffect, useState } from 'react'

import {
  changeAdminMemberRole,
  getAdminMemberEmail,
  getAdminMembers,
  quitAdminMembers,
} from '@/entities/member'

import memberCheckboxIcon from '../assets/member-checkbox.svg'
import memberCloseIcon from '../assets/member-close.svg'
import memberKebabIcon from '../assets/member-kebab.svg'
import memberSearchIcon from '../assets/member-search.svg'
import {
  formatManagedMember,
  memberActionCompleteText,
  memberActionRoleMap,
  memberRoleLabel,
} from '../../model/memberManagementModel'
import { MemberConfirmModal } from './MemberConfirmModal'
import { MemberKebabMenu } from './MemberKebabMenu'
import * as S from './MemberManagementModal.style'

import type {
  ManagedMember,
  MemberConfirmAction,
} from '../../model/memberManagementModel'

type PendingAction = {
  member: ManagedMember
  action: MemberConfirmAction
}

type MemberManagementModalProps = {
  onClose: () => void
  onComplete: (message: string) => void
}

export function MemberManagementModal({
  onClose,
  onComplete,
}: MemberManagementModalProps) {
  const [members, setMembers] = useState<ManagedMember[]>([])
  const [selectedMemberIds, setSelectedMemberIds] = useState<number[]>([])
  const [openedMenuMemberId, setOpenedMenuMemberId] = useState<number | null>(
    null,
  )
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null)
  const [keyword, setKeyword] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  useEffect(() => {
    let shouldIgnore = false
    const timerId = window.setTimeout(async () => {
      try {
        setIsLoading(true)
        const response = await getAdminMembers({
          keyword: keyword.trim() || undefined,
        })

        if (shouldIgnore) {
          return
        }

        setMembers(response.map(formatManagedMember))
        setErrorMessage('')
      } catch {
        if (!shouldIgnore) {
          setErrorMessage('멤버 목록을 불러오지 못했어요')
        }
      } finally {
        if (!shouldIgnore) {
          setIsLoading(false)
        }
      }
    }, 250)

    return () => {
      shouldIgnore = true
      window.clearTimeout(timerId)
    }
  }, [keyword])

  const handleToggleMember = (memberId: number) => {
    setSelectedMemberIds((prevSelectedMemberIds) =>
      prevSelectedMemberIds.includes(memberId)
        ? prevSelectedMemberIds.filter((selectedId) => selectedId !== memberId)
        : [...prevSelectedMemberIds, memberId],
    )
  }

  const handleCopyEmail = async (member: ManagedMember) => {
    setOpenedMenuMemberId(null)

    try {
      const email = await getAdminMemberEmail(member.id)

      await navigator.clipboard?.writeText(email)
      onComplete(`${member.name}의 이메일을 복사했습니다`)
    } catch {
      window.alert('이메일을 복사하지 못했어요')
    }
  }

  const handleOpenConfirm = (
    member: ManagedMember,
    action: MemberConfirmAction,
  ) => {
    setOpenedMenuMemberId(null)
    setPendingAction({ member, action })
  }

  const handleConfirmAction = async () => {
    if (!pendingAction) {
      return
    }

    const { member, action } = pendingAction

    try {
      if (action === 'remove') {
        await quitAdminMembers({
          userIds: [member.id],
        })
        setMembers((prevMembers) =>
          prevMembers.filter((prevMember) => prevMember.id !== member.id),
        )
        setSelectedMemberIds((prevSelectedMemberIds) =>
          prevSelectedMemberIds.filter((selectedId) => selectedId !== member.id),
        )
      } else {
        const updatedMember = await changeAdminMemberRole({
          role: memberActionRoleMap[action],
          userId: member.id,
        })

        setMembers((prevMembers) =>
          prevMembers.map((prevMember) =>
            prevMember.id === member.id
              ? formatManagedMember(updatedMember)
              : prevMember,
          ),
        )
      }

      setPendingAction(null)
      onComplete(`${member.name}을 ${memberActionCompleteText[action]}`)
    } catch {
      window.alert('멤버 정보를 변경하지 못했어요')
    }
  }

  return (
    <S.Overlay>
      <S.Modal role="dialog" aria-modal="true" aria-label="멤버 관리">
        <S.SearchBar>
          <S.SearchIcon src={memberSearchIcon} alt="" />
          <S.SearchInput
            value={keyword}
            placeholder="이름이나 학번을 입력하세요"
            autoFocus
            onChange={(event) => setKeyword(event.target.value)}
          />
          <S.CloseButton type="button" aria-label="닫기" onClick={onClose}>
            <S.CloseIcon src={memberCloseIcon} alt="" />
          </S.CloseButton>
        </S.SearchBar>

        <S.List>
          {isLoading ? (
            <S.Empty>불러오는 중이에요</S.Empty>
          ) : errorMessage ? (
            <S.Empty>{errorMessage}</S.Empty>
          ) : members.length > 0 ? (
            members.map((member) => {
              const isSelected = selectedMemberIds.includes(member.id)
              const isMenuOpen = openedMenuMemberId === member.id

              return (
                <S.Row key={member.id}>
                  <S.Checkbox
                    type="button"
                    $checked={isSelected}
                    aria-label={`${member.name} 선택`}
                    onClick={() => handleToggleMember(member.id)}
                  >
                    {isSelected && (
                      <S.CheckboxIcon src={memberCheckboxIcon} alt="" />
                    )}
                  </S.Checkbox>
                  <S.MemberInfo>
                    <S.TextGroup>
                      <S.Name>{member.name}</S.Name>
                      <S.ClassInfo>{member.classInfo}</S.ClassInfo>
                    </S.TextGroup>
                  </S.MemberInfo>
                  <S.Role>{memberRoleLabel[member.role]}</S.Role>
                  <S.MoreButton
                    type="button"
                    aria-label={`${member.name} 메뉴 열기`}
                    onClick={() =>
                      setOpenedMenuMemberId((prevOpenedMemberId) =>
                        prevOpenedMemberId === member.id ? null : member.id,
                      )
                    }
                  >
                    <S.MoreIcon src={memberKebabIcon} alt="" />
                  </S.MoreButton>
                  {isMenuOpen && (
                    <MemberKebabMenu
                      onCopyEmail={() => handleCopyEmail(member)}
                      onSelectAction={(action) =>
                        handleOpenConfirm(member, action)
                      }
                    />
                  )}
                </S.Row>
              )
            })
          ) : (
            <S.Empty>검색 결과가 없습니다</S.Empty>
          )}
        </S.List>

        <S.Footer>
          <S.SelectedText>
            멤버 {selectedMemberIds.length}명 선택됨
          </S.SelectedText>
          <S.ShortcutGroup type="button" onClick={onClose}>
            <S.ShortcutKey>ESC</S.ShortcutKey>
            닫기
          </S.ShortcutGroup>
        </S.Footer>

        {pendingAction && (
          <MemberConfirmModal
            action={pendingAction.action}
            member={pendingAction.member}
            onCancel={() => setPendingAction(null)}
            onConfirm={handleConfirmAction}
          />
        )}
      </S.Modal>
    </S.Overlay>
  )
}
