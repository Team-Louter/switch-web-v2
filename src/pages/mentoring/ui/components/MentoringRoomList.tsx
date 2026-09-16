import { useEffect, useState } from 'react'
import { PiDotsThreeVertical } from 'react-icons/pi'

import { ConfirmModal } from '@/shared/ui'

import type { MentoringRoomView } from '@/features/mentoring'

import { MemberAvatar } from '@/features/mentoring'

import { getMenuPlacement, type MenuPlacement } from './menuPlacement'
import * as Menu from './MentoringContextMenu.style'
import * as S from './MentoringRoomList.style'

const VISIBLE_AVATAR_COUNT = 4
const ROOM_MENU_HEIGHT = 76

interface MentoringRoomListProps {
  canManageRoom: boolean
  onDelete: (room: MentoringRoomView) => Promise<boolean>
  onEdit: (room: MentoringRoomView) => void
  onSelect: (room: MentoringRoomView) => void
  rooms: MentoringRoomView[]
  selectedRoomId: number | null
}

export function MentoringRoomList({
  canManageRoom,
  onDelete,
  onEdit,
  onSelect,
  rooms,
  selectedRoomId,
}: MentoringRoomListProps) {
  const [openedMenuRoomId, setOpenedMenuRoomId] = useState<number | null>(null)
  const [menuPlacement, setMenuPlacement] = useState<MenuPlacement>('bottom')
  const [deleteTarget, setDeleteTarget] =
    useState<MentoringRoomView | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState(false)
  useEffect(() => {
    const handlePointerDown = () => setOpenedMenuRoomId(null)

    document.addEventListener('mousedown', handlePointerDown)

    return () => document.removeEventListener('mousedown', handlePointerDown)
  }, [])

  const handleRoomKeyDown = (
    event: React.KeyboardEvent<HTMLDivElement>,
    room: MentoringRoomView,
  ) => {
    if (event.target !== event.currentTarget) {
      return
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onSelect(room)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) {
      return
    }

    try {
      setIsDeleting(true)
      const didDelete = await onDelete(deleteTarget)

      if (didDelete) {
        setDeleteTarget(null)
        setDeleteError(false)
      } else {
        setDeleteError(true)
      }
    } catch {
      setDeleteError(true)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      <S.List>
        {rooms.length === 0 ? (
          <S.EmptyText>방이 없습니다.</S.EmptyText>
        ) : (
          rooms.map((room) => {
            const isGroup = room.members.length > 1

            return (
              <S.RoomItem
                key={room.mentoringId}
                $selected={room.mentoringId === selectedRoomId}
                role="button"
                tabIndex={0}
                onClick={() => onSelect(room)}
                onKeyDown={(event) => handleRoomKeyDown(event, room)}
              >
                <S.RoomInfo>
                  <S.AvatarArea>
                    {isGroup ? (
                      <S.AvatarGroup>
                        {room.members
                          .slice(0, VISIBLE_AVATAR_COUNT)
                          .map((member) => (
                            <MemberAvatar
                              key={member.userId}
                              userName={member.userName}
                              profileImageUrl={member.profileImageUrl}
                              size={18}
                              borderWidth={1}
                            />
                          ))}
                      </S.AvatarGroup>
                    ) : (
                      <MemberAvatar
                        userName={room.members[0]?.userName}
                        profileImageUrl={room.members[0]?.profileImageUrl}
                        size={35}
                        borderWidth={1}
                      />
                    )}
                  </S.AvatarArea>
                  <S.RoomName>{room.mentoringName}</S.RoomName>
                </S.RoomInfo>

                {canManageRoom && (
                  <S.RoomActions>
                    <S.MenuButton
                      type="button"
                      aria-label={`${room.mentoringName} 방 관리`}
                      aria-haspopup="menu"
                      aria-expanded={openedMenuRoomId === room.mentoringId}
                      onClick={(event) => {
                        event.stopPropagation()
                        if (openedMenuRoomId === room.mentoringId) {
                          setOpenedMenuRoomId(null)
                          return
                        }

                        setMenuPlacement(
                          getMenuPlacement(
                            event.currentTarget,
                            ROOM_MENU_HEIGHT,
                          ),
                        )
                        setOpenedMenuRoomId(room.mentoringId)
                      }}
                    >
                      <PiDotsThreeVertical aria-hidden="true" />
                    </S.MenuButton>
                    {openedMenuRoomId === room.mentoringId && (
                      <Menu.Panel
                        $placement={menuPlacement}
                        role="menu"
                        onMouseDown={(event) => event.stopPropagation()}
                      >
                        <Menu.Item
                          type="button"
                          role="menuitem"
                          onClick={(event) => {
                            event.stopPropagation()
                            setOpenedMenuRoomId(null)
                            onEdit(room)
                          }}
                        >
                          수정하기
                        </Menu.Item>
                        <Menu.Divider aria-hidden="true" />
                        <Menu.Item
                          type="button"
                          role="menuitem"
                          $danger
                          onClick={(event) => {
                            event.stopPropagation()
                            setOpenedMenuRoomId(null)
                            setDeleteError(false)
                            setDeleteTarget(room)
                          }}
                        >
                          삭제하기
                        </Menu.Item>
                      </Menu.Panel>
                    )}
                  </S.RoomActions>
                )}
              </S.RoomItem>
            )
          })
        )}
      </S.List>

      {deleteTarget && (
        <ConfirmModal
          title="멘토링 방 삭제"
          description={
            deleteError
              ? '멘토링 방 삭제에 실패했습니다. 다시 시도해주세요.'
              : '이 멘토링 방을 삭제하시겠습니까?'
          }
          confirmLabel="삭제"
          isConfirming={isDeleting}
          onCancel={() => {
            setDeleteTarget(null)
            setDeleteError(false)
          }}
          onConfirm={() => void handleDelete()}
        />
      )}
    </>
  )
}
