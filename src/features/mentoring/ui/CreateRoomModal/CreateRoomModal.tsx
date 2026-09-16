import { useEffect, useMemo, useState } from 'react'
import {
  PiCaretDown,
  PiCaretUp,
  PiMagnifyingGlass,
  PiSpinnerGap,
  PiX,
} from 'react-icons/pi'

import { getMember } from '@/entities/member'
import type { Member, MemberRole } from '@/entities/member/model/types'

import { createMentoring, modifyMentoring } from '../../api/createMentoring'
import type { MentoringRoomView } from '../../model/types'
import { MemberAvatar } from '../MemberAvatar'
import * as S from './CreateRoomModal.style'

const ROLE_LABELS: Record<MemberRole, string> = {
  LEADER: '부장 (Leader)',
  MENTOR: '멘토 (Mentor)',
  MENTEE: '멘티 (Mentee)',
  STUDENT: '학생 (Student)',
}

// 방 목록에서 한 줄로 안정적으로 읽히도록 방 제목을 30자로 제한한다.
const MAX_ROOM_NAME_LENGTH = 30
const SKELETON_ROWS = [0, 1, 2, 3]

interface CreateRoomModalProps {
  isOpen: boolean
  onClose: () => void
  onSaveSuccess?: () => void | Promise<void>
  room?: MentoringRoomView
}

interface GradeGroup {
  grade: number
  members: Member[]
}

function toGradeGroups(members: Member[]): GradeGroup[] {
  const gradeMap = new Map<number, Member[]>()

  members.forEach((member) => {
    const gradeMembers = gradeMap.get(member.grade)

    if (gradeMembers) {
      gradeMembers.push(member)
      return
    }

    gradeMap.set(member.grade, [member])
  })

  return Array.from(gradeMap.entries())
    .sort(([firstGrade], [secondGrade]) => firstGrade - secondGrade)
    .map(([grade, gradeMembers]) => ({ grade, members: gradeMembers }))
}

function getRoleLabel(role: MemberRole) {
  return ROLE_LABELS[role]
}

function CreateRoomModalContent({
  onClose,
  onSaveSuccess,
  room,
}: CreateRoomModalProps) {
  const [members, setMembers] = useState<Member[]>([])
  const [isMembersLoading, setIsMembersLoading] = useState(true)
  const [hasMemberLoadError, setHasMemberLoadError] = useState(false)
  const [mentoringName, setMentoringName] = useState(room?.mentoringName ?? '')
  const [keyword, setKeyword] = useState('')
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>(
    room?.members.map(({ userId }) => userId) ?? [],
  )
  const [openedGrades, setOpenedGrades] = useState<number[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    let isCancelled = false

    getMember()
      .then((allMembers) => {
        if (!isCancelled) {
          setMembers(allMembers)
          // v1과 같이 멤버 목록을 처음 열었을 때 모든 학년을 펼쳐 둔다.
          setOpenedGrades(toGradeGroups(allMembers).map(({ grade }) => grade))
        }
      })
      .catch(() => {
        if (!isCancelled) {
          setHasMemberLoadError(true)
        }
      })
      .finally(() => {
        if (!isCancelled) {
          setIsMembersLoading(false)
        }
      })

    return () => {
      isCancelled = true
    }
  }, [])

  const searchedMembers = useMemo(() => {
    const trimmedKeyword = keyword.trim()

    if (!trimmedKeyword) return members

    return members.filter(
      (member) =>
        member.userName.includes(trimmedKeyword) ||
        String(member.studentId).includes(trimmedKeyword) ||
        String(member.number).includes(trimmedKeyword),
    )
  }, [keyword, members])

  const isSearching = keyword.trim().length > 0
  const membersByGrade = useMemo(
    () => toGradeGroups(searchedMembers),
    [searchedMembers],
  )

  const isGradeOpened = (grade: number) => openedGrades.includes(grade)

  const toggleGrade = (grade: number) => {
    setOpenedGrades((grades) =>
      grades.includes(grade)
        ? grades.filter((openedGrade) => openedGrade !== grade)
        : [...grades, grade],
    )
  }

  const toggleMember = (userId: number) => {
    setSelectedUserIds((userIds) =>
      userIds.includes(userId)
        ? userIds.filter((selectedUserId) => selectedUserId !== userId)
        : [...userIds, userId],
    )
  }

  const toggleGradeMembers = (gradeMembers: Member[]) => {
    const gradeUserIds = gradeMembers.map(({ userId }) => userId)
    const isAllSelected = gradeUserIds.every((userId) =>
      selectedUserIds.includes(userId),
    )

    setSelectedUserIds((userIds) =>
      isAllSelected
        ? userIds.filter((userId) => !gradeUserIds.includes(userId))
        : [...new Set([...userIds, ...gradeUserIds])],
    )
  }

  const isFormValid =
    mentoringName.trim().length > 0 && selectedUserIds.length > 0

  const handleSubmit = async () => {
    if (!isFormValid || isSubmitting) return

    const data = {
      mentoringName: mentoringName.trim(),
      memberIds: selectedUserIds,
    }

    try {
      setIsSubmitting(true)

      if (room) {
        await modifyMentoring(room.mentoringId, data)
      } else {
        await createMentoring(data)
      }

      onClose()
      void onSaveSuccess?.()
    } catch {
      // 실패 시 모달을 유지해 사용자가 다시 시도할 수 있게 한다.
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderMemberRow = (member: Member) => {
    const isSelected = selectedUserIds.includes(member.userId)

    return (
      <S.MemberRow key={member.userId}>
        <MemberAvatar
          userName={member.userName}
          profileImageUrl={member.profileImageUrl}
          size={40}
        />
        <S.MemberInfo>
          <S.MemberName>{member.userName}</S.MemberName>
          <S.MemberMeta>
            {member.grade}학년 {member.classRoom}반 {member.number}번
          </S.MemberMeta>
        </S.MemberInfo>
        <S.RoleText>{getRoleLabel(member.role)}</S.RoleText>
        <S.CheckBox
          type="button"
          role="checkbox"
          aria-checked={isSelected}
          aria-label={`${member.userName} 선택`}
          $isChecked={isSelected}
          onClick={() => toggleMember(member.userId)}
        >
          {isSelected && <S.CheckMark aria-hidden="true" />}
        </S.CheckBox>
      </S.MemberRow>
    )
  }

  return (
    <S.Overlay onClick={onClose}>
      <S.Container
        role="dialog"
        aria-modal="true"
        aria-labelledby="mentoring-room-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <S.Header>
          <S.HeaderSpacer aria-hidden="true" />
          <S.Title id="mentoring-room-modal-title">
            {room ? '멘토링 방 수정' : '멘토링 방 생성'}
          </S.Title>
          <S.CloseButton type="button" aria-label="모달 닫기" onClick={onClose}>
            <PiX aria-hidden="true" />
          </S.CloseButton>
        </S.Header>

        <S.RoomNameField>
          <S.RoomName
            type="text"
            maxLength={MAX_ROOM_NAME_LENGTH}
            placeholder="방 제목을 입력해 주세요."
            value={mentoringName}
            aria-describedby="mentoring-room-name-count"
            onChange={(event) =>
              setMentoringName(
                event.target.value.slice(0, MAX_ROOM_NAME_LENGTH),
              )
            }
          />
          <S.RoomNameCount id="mentoring-room-name-count">
            {mentoringName.length}/{MAX_ROOM_NAME_LENGTH}
          </S.RoomNameCount>
        </S.RoomNameField>

        <S.MemberList
          key={isMembersLoading ? 'member-list-loading' : 'member-list-ready'}
          aria-busy={isMembersLoading}
        >
          <S.SearchField>
            <PiMagnifyingGlass aria-hidden="true" />
            <S.SearchInput
              type="text"
              placeholder="이름이나 학번을 입력하세요."
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
            />
            {keyword && (
              <S.ClearSearchButton
                type="button"
                aria-label="검색어 지우기"
                onClick={() => setKeyword('')}
              >
                <PiX aria-hidden="true" />
              </S.ClearSearchButton>
            )}
          </S.SearchField>

          <S.MemberListBody
            $loaded={!isMembersLoading && !hasMemberLoadError}
          >
            {isMembersLoading ? (
              <S.MemberSkeletonList
                role="status"
                aria-label="멤버 목록을 불러오는 중입니다."
              >
                {SKELETON_ROWS.map((row) => (
                  <S.MemberSkeletonRow key={row} aria-hidden="true">
                    <S.MemberSkeletonAvatar />
                    <S.MemberSkeletonInfo>
                      <S.MemberSkeletonLabel />
                      <S.MemberSkeletonMeta />
                    </S.MemberSkeletonInfo>
                    <S.MemberSkeletonRole />
                    <S.MemberSkeletonAction />
                  </S.MemberSkeletonRow>
                ))}
              </S.MemberSkeletonList>
            ) : hasMemberLoadError ? (
              <S.EmptyText>멤버 목록을 불러오지 못했어요.</S.EmptyText>
            ) : searchedMembers.length === 0 ? (
              <S.EmptyText>검색 결과가 없습니다.</S.EmptyText>
            ) : isSearching ? (
              searchedMembers.map(renderMemberRow)
            ) : (
              membersByGrade.map(({ grade, members: gradeMembers }) => {
                const isOpened = isGradeOpened(grade)
                const isAllSelected =
                  gradeMembers.length > 0 &&
                  gradeMembers.every(({ userId }) =>
                    selectedUserIds.includes(userId),
                  )

                return (
                  <S.GradeGroup key={grade}>
                    <S.GradeRow>
                      <S.GradeLabel
                        type="button"
                        aria-expanded={isOpened}
                        onClick={() => toggleGrade(grade)}
                      >
                        {grade}학년
                      </S.GradeLabel>
                      <S.GradeActions>
                        <S.CheckBox
                          type="button"
                          role="checkbox"
                          aria-checked={isAllSelected}
                          aria-label={`${grade}학년 전체 선택`}
                          $isChecked={isAllSelected}
                          onClick={() => toggleGradeMembers(gradeMembers)}
                        >
                          {isAllSelected && <S.CheckMark aria-hidden="true" />}
                        </S.CheckBox>
                        <S.CaretButton
                          type="button"
                          aria-expanded={isOpened}
                          aria-label={`${grade}학년 ${isOpened ? '접기' : '펼치기'}`}
                          onClick={() => toggleGrade(grade)}
                        >
                          {isOpened ? (
                            <PiCaretUp aria-hidden="true" />
                          ) : (
                            <PiCaretDown aria-hidden="true" />
                          )}
                        </S.CaretButton>
                      </S.GradeActions>
                    </S.GradeRow>
                    {isOpened && gradeMembers.map(renderMemberRow)}
                  </S.GradeGroup>
                )
              })
            )}
          </S.MemberListBody>

          <S.SelectionRow>
            <S.SelectionCount>
              멤버 {selectedUserIds.length}명 선택됨
            </S.SelectionCount>
            <S.ClearButton
              type="button"
              onClick={() => setSelectedUserIds([])}
            >
              전체 선택 취소
            </S.ClearButton>
          </S.SelectionRow>
        </S.MemberList>

        <S.DoneButton
          type="button"
          disabled={isSubmitting || isMembersLoading || !isFormValid}
          aria-busy={isSubmitting}
          onClick={() => void handleSubmit()}
        >
          {isSubmitting ? (
            <>
              <S.SubmitSpinner aria-hidden="true">
                <PiSpinnerGap />
              </S.SubmitSpinner>
              저장 중
            </>
          ) : room ? (
            '수정 완료'
          ) : (
            '생성'
          )}
        </S.DoneButton>
      </S.Container>
    </S.Overlay>
  )
}

export function CreateRoomModal(props: CreateRoomModalProps) {
  if (!props.isOpen) return null

  return <CreateRoomModalContent {...props} />
}
