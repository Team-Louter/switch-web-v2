import { createPortal } from 'react-dom'
import { useEffect, useMemo, useRef, useState } from 'react'

import {
  changeAdminMemberRole,
  getAdminMemberEmail,
  getMember,
  quitAdminMembers,
} from '@/entities/member'

import {
  formatManagedMember,
  memberActionCompleteText,
  memberActionRoleMap,
  memberRoleLabel,
} from '../../model/memberManagementModel'
import memberCloseIcon from '../assets/member-close.svg'
import memberCrownIcon from '../assets/member-crown.svg'
import memberKebabIcon from '../assets/member-kebab.svg'
import memberSearchIcon from '../assets/member-search.svg'
import { MemberConfirmModal } from './MemberConfirmModal'
import { MemberKebabMenu } from './MemberKebabMenu'
import * as S from './MemberManagementModal.style'

import type {
  ManagedMember,
  MemberConfirmAction,
} from '../../model/memberManagementModel'

interface PendingAction {
  member: ManagedMember
  action: MemberConfirmAction
}

interface MenuPosition {
  right: number
  top: number
}

interface MemberManagementModalProps {
  onClose: () => void
  onComplete: (message: string) => void
}

export function MemberManagementModal({
  onClose,
  onComplete,
}: MemberManagementModalProps) {
  const menuRef = useRef<HTMLDivElement>(null)
  const [members, setMembers] = useState<ManagedMember[]>([])
  const [openedMenuMemberId, setOpenedMenuMemberId] = useState<number | null>(
    null,
  )
  const [menuPosition, setMenuPosition] = useState<MenuPosition | null>(null)
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null)
  const [keyword, setKeyword] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  const filteredMembers = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase()

    if (!normalizedKeyword) {
      return members
    }

    return members.filter(
      (member) =>
        member.name.toLowerCase().includes(normalizedKeyword) ||
        member.classInfo.replace(/\D/g, '').includes(normalizedKeyword),
    )
  }, [keyword, members])
  const openedMenuMember =
    members.find((member) => member.id === openedMenuMemberId) ?? null

  useEffect(() => {
    let shouldIgnore = false

    const fetchMembers = async () => {
      try {
        setIsLoading(true)
        const response = await getMember()

        if (!shouldIgnore) {
          setMembers(response.map(formatManagedMember))
          setErrorMessage('')
        }
      } catch {
        if (!shouldIgnore) {
          setErrorMessage('멤버 목록을 불러오지 못했어요')
        }
      } finally {
        if (!shouldIgnore) {
          setIsLoading(false)
        }
      }
    }

    void fetchMembers()

    return () => {
      shouldIgnore = true
    }
  }, [])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') {
        return
      }

      if (pendingAction) {
        setPendingAction(null)
        return
      }

      if (openedMenuMemberId !== null) {
        setOpenedMenuMemberId(null)
        setMenuPosition(null)
        return
      }

      onClose()
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose, openedMenuMemberId, pendingAction])

  useEffect(() => {
    if (openedMenuMemberId === null) {
      return
    }

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as HTMLElement

      if (target.closest(`[data-member-menu-id="${openedMenuMemberId}"]`)) {
        return
      }

      if (!menuRef.current?.contains(target)) {
        setOpenedMenuMemberId(null)
        setMenuPosition(null)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)

    return () => document.removeEventListener('mousedown', handlePointerDown)
  }, [openedMenuMemberId])

  useEffect(() => {
    if (openedMenuMemberId === null) {
      return
    }

    const closeMenu = () => {
      setOpenedMenuMemberId(null)
      setMenuPosition(null)
    }

    window.addEventListener('scroll', closeMenu, true)

    return () => window.removeEventListener('scroll', closeMenu, true)
  }, [openedMenuMemberId])

  const handleToggleMenu = (
    event: React.MouseEvent<HTMLButtonElement>,
    memberId: number,
  ) => {
    event.stopPropagation()

    if (openedMenuMemberId === memberId) {
      setOpenedMenuMemberId(null)
      setMenuPosition(null)
      return
    }

    const buttonRect = event.currentTarget.getBoundingClientRect()

    setOpenedMenuMemberId(memberId)
    setMenuPosition({
      right: window.innerWidth - buttonRect.right,
      top: buttonRect.bottom + 4,
    })
  }

  const handleCopyEmail = async (member: ManagedMember) => {
    setOpenedMenuMemberId(null)
    setMenuPosition(null)

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
    setMenuPosition(null)
    setPendingAction({ member, action })
  }

  const handleConfirmAction = async () => {
    if (!pendingAction) {
      return
    }

    const { member, action } = pendingAction

    try {
      if (action === 'remove') {
        await quitAdminMembers({ userIds: [member.id] })
        setMembers((currentMembers) =>
          currentMembers.filter(
            (currentMember) => currentMember.id !== member.id,
          ),
        )
      } else {
        const updatedMember = await changeAdminMemberRole({
          role: memberActionRoleMap[action],
          userId: member.id,
        })

        setMembers((currentMembers) =>
          currentMembers.map((currentMember) =>
            currentMember.id === member.id
              ? {
                  ...formatManagedMember(updatedMember),
                  profileImageUrl:
                    updatedMember.profileImageUrl ??
                    currentMember.profileImageUrl,
                }
              : currentMember,
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
    <>
      <S.Overlay onClick={onClose}>
        <S.Modal
          role="dialog"
          aria-modal="true"
          aria-label="멤버 관리"
          onClick={(event) => event.stopPropagation()}
        >
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
              Array.from({ length: 4 }).map((_, index) => (
                <S.SkeletonRow key={index} aria-hidden="true">
                  <S.SkeletonAvatar />
                  <S.SkeletonTextGroup>
                    <S.SkeletonLine $width="70px" />
                    <S.SkeletonLine $width="95px" />
                  </S.SkeletonTextGroup>
                  <S.SkeletonLine $width="80px" />
                </S.SkeletonRow>
              ))
            ) : errorMessage ? (
              <S.Empty>{errorMessage}</S.Empty>
            ) : filteredMembers.length > 0 ? (
              filteredMembers.map((member) => (
                <S.Row key={member.id}>
                  <S.MemberInfo>
                    <S.Avatar>
                      {member.profileImageUrl ? (
                        <S.AvatarImage
                          src={member.profileImageUrl}
                          alt={`${member.name} 프로필`}
                        />
                      ) : (
                        <S.AvatarFallback aria-hidden="true">
                          {member.name.charAt(0)}
                        </S.AvatarFallback>
                      )}
                    </S.Avatar>
                    <S.TextGroup>
                      <S.Name>{member.name}</S.Name>
                      <S.ClassInfo>{member.classInfo}</S.ClassInfo>
                    </S.TextGroup>
                  </S.MemberInfo>
                  <S.Role>
                    {member.role === 'LEADER' && (
                      <S.CrownIcon src={memberCrownIcon} alt="" />
                    )}
                    <span>{memberRoleLabel[member.role]}</span>
                    {member.role === 'LEADER' && <S.CrownSpacer />}
                  </S.Role>
                  <S.MoreButton
                    type="button"
                    data-member-menu-id={member.id}
                    aria-label={`${member.name} 메뉴 열기`}
                    onClick={(event) => handleToggleMenu(event, member.id)}
                  >
                    <S.MoreIcon src={memberKebabIcon} alt="" />
                  </S.MoreButton>
                </S.Row>
              ))
            ) : (
              <S.Empty>검색 결과가 없습니다</S.Empty>
            )}
          </S.List>

          <S.Footer>
            <S.MemberCount>
              {isLoading
                ? '멤버 목록 불러오는 중'
                : `멤버 ${filteredMembers.length}명 표시 중`}
            </S.MemberCount>
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

      {openedMenuMember &&
        menuPosition &&
        createPortal(
          <S.MenuPositioner
            ref={menuRef}
            $right={menuPosition.right}
            $top={menuPosition.top}
            onClick={(event) => event.stopPropagation()}
          >
            <MemberKebabMenu
              memberRole={openedMenuMember.role}
              onCopyEmail={() => handleCopyEmail(openedMenuMember)}
              onSelectAction={(action) =>
                handleOpenConfirm(openedMenuMember, action)
              }
            />
          </S.MenuPositioner>,
          document.body,
        )}
    </>
  )
}
