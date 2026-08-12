import { useEffect, useMemo, useState } from 'react'
import {
  PiCaretDown,
  PiCaretUp,
  PiCheck,
  PiMagnifyingGlass,
} from 'react-icons/pi'

import { getMember } from '@/entities/member/getMember'
import type { Member } from '@/entities/member/model/types'

import { createMentoring, modifyMentoring } from '../../api/createMentoring'
import type { MentoringRoomView } from '../../model/types'
import { MemberAvatar } from '../MemberAvatar'
import * as M from '../modalBase.style'
import * as S from './CreateRoomModal.style'

/** 멤버 목록에 노출할 학년 */
const GRADES = [1, 2, 3]

interface CreateRoomModalProps {
  isOpen: boolean
  onClose: () => void
  onSaveSuccess?: () => void | Promise<void>
  room?: MentoringRoomView
}

function CreateRoomModalContent({
  onClose,
  onSaveSuccess,
  room,
}: CreateRoomModalProps) {
  const [members, setMembers] = useState<Member[]>([])
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
        if (!isCancelled) setMembers(allMembers)
      })
      .catch(() => {})

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
        String(member.studentId).includes(trimmedKeyword),
    )
  }, [keyword, members])

  const membersByGrade = useMemo(
    () =>
      GRADES.map((grade) => ({
        grade,
        gradeMembers: searchedMembers.filter(
          (member) => member.grade === grade,
        ),
      })),
    [searchedMembers],
  )

  const isGradeOpened = (grade: number) =>
    openedGrades.includes(grade) || keyword.trim().length > 0

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

  const handleSubmit = async () => {
    if (!mentoringName.trim()) return

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

  return (
    <M.Backdrop>
      <M.Modal>
        <M.Title>{room ? '방 수정하기' : '방 새로 만들기'}</M.Title>
        <M.TextInput
          type="text"
          placeholder="방 제목을 입력해주세요."
          value={mentoringName}
          onChange={(event) => setMentoringName(event.target.value)}
        />
        <S.MemberSection>
          <S.SearchField>
            <S.SearchInput
              type="text"
              placeholder="이름 또는 학번으로 검색"
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
            />
            <PiMagnifyingGlass aria-hidden="true" />
          </S.SearchField>
          <S.MemberList>
            {/* 검색 결과가 없는 경우 안내 문구를 보여준다 */}
            {searchedMembers.length === 0 ? (
              <S.EmptyText>검색된 멤버가 없어요.</S.EmptyText>
            ) : (
              membersByGrade.map(({ grade, gradeMembers }) => {
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
                      <S.CheckBox
                        type="button"
                        role="checkbox"
                        aria-checked={isAllSelected}
                        aria-label={`${grade}학년 전체 선택`}
                        $isChecked={isAllSelected}
                        onClick={() => toggleGradeMembers(gradeMembers)}
                      >
                        {isAllSelected && <PiCheck aria-hidden="true" />}
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
                    </S.GradeRow>
                    {/* 학년을 펼쳤을 때만 멤버를 노출한다 */}
                    {isOpened &&
                      gradeMembers.map((member) => {
                        const isSelected = selectedUserIds.includes(
                          member.userId,
                        )

                        return (
                          <S.MemberRow key={member.userId}>
                            <S.MemberInfo>
                              <MemberAvatar
                                userName={member.userName}
                                profileImageUrl={member.profileImageUrl}
                              />
                              <S.MemberName>{member.userName}</S.MemberName>
                            </S.MemberInfo>
                            <S.CheckBox
                              type="button"
                              role="checkbox"
                              aria-checked={isSelected}
                              aria-label={`${member.userName} 선택`}
                              $isChecked={isSelected}
                              onClick={() => toggleMember(member.userId)}
                            >
                              {isSelected && <PiCheck aria-hidden="true" />}
                            </S.CheckBox>
                          </S.MemberRow>
                        )
                      })}
                  </S.GradeGroup>
                )
              })
            )}
          </S.MemberList>
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
        </S.MemberSection>
        <M.ActionRow>
          <M.ActionButton
            type="button"
            size="md"
            variant="neutral"
            onClick={onClose}
          >
            취소
          </M.ActionButton>
          <M.ActionButton
            type="button"
            size="md"
            variant="primary"
            disabled={isSubmitting || !mentoringName.trim()}
            onClick={() => void handleSubmit()}
          >
            {room ? '수정' : '생성'}
          </M.ActionButton>
        </M.ActionRow>
      </M.Modal>
    </M.Backdrop>
  )
}

export function CreateRoomModal(props: CreateRoomModalProps) {
  if (!props.isOpen) return null

  return <CreateRoomModalContent {...props} />
}
