import { useCallback, useEffect, useMemo, useState } from 'react'
import { PiPlus } from 'react-icons/pi'

import { getMember } from '@/entities/member'
import { getProfile } from '@/entities/member/getProfile'
import type { Profile } from '@/entities/member/model/profile'
import type { Member } from '@/entities/member/model/types'
import {
  getMentoringMembers,
  getMentorings,
  getQuestions,
} from '@/entities/mentoring'
import type {
  MentoringQuestion,
  MentoringRoom,
} from '@/entities/mentoring'
import {
  changeQuestionStatus,
  createQuestion,
  CreateRoomModal,
  deleteMentoring,
  deleteQuestion,
  MentoringComposer,
  QuestionDetailPanel,
  uploadMentoringFile,
} from '@/features/mentoring'
import type { MentoringRoomView } from '@/features/mentoring'

import { MentoringQuestionList } from './components/MentoringQuestionList'
import { MentoringRoomList } from './components/MentoringRoomList'
import * as S from './MentoringEntryPage.style'

interface MentoringData {
  members: Member[]
  questions: MentoringQuestion[]
  rooms: MentoringRoomView[]
}

/**
 * 멘토링 방, 방별 멤버, 질문을 v1 화면이 요구하는 단위로 구성한다.
 */
async function fetchMentoring(): Promise<MentoringData> {
  const [mentorings, members, questions] = await Promise.all([
    getMentorings(),
    getMember(),
    getQuestions(),
  ])
  const memberByUserId = new Map(
    members.map((member) => [member.userId, member]),
  )
  const toMembers = (userIds: number[]) =>
    [...new Set(userIds)]
      .map((userId) => memberByUserId.get(userId))
      .filter((member): member is Member => member !== undefined)

  const rooms = await Promise.all(
    mentorings.map(async (room: MentoringRoom) => {
      const [leaders, mentors, mentees] = await Promise.all([
        getMentoringMembers(room.mentoringId, 'LEADER').catch(() => []),
        getMentoringMembers(room.mentoringId, 'MENTOR').catch(() => []),
        getMentoringMembers(room.mentoringId, 'MENTEE').catch(() => []),
      ])
      const leaderMembers = toMembers(leaders.map(({ userId }) => userId))
      const mentorMembers = toMembers(mentors.map(({ userId }) => userId))
      const menteeMembers = toMembers(mentees.map(({ userId }) => userId))

      return {
        ...room,
        mentors: mentorMembers,
        members: [...leaderMembers, ...mentorMembers, ...menteeMembers].filter(
          (member, index, roomMembers) =>
            roomMembers.findIndex(
              ({ userId }) => userId === member.userId,
            ) === index,
        ),
      }
    }),
  )

  return { members, questions, rooms }
}

function applyMentoringData(
  data: MentoringData,
  setMembers: (members: Member[]) => void,
  setQuestions: (questions: MentoringQuestion[]) => void,
  setRooms: (rooms: MentoringRoomView[]) => void,
) {
  setMembers(data.members)
  setQuestions(data.questions)
  setRooms(data.rooms)
}

export function MentoringEntryPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [members, setMembers] = useState<Member[]>([])
  const [rooms, setRooms] = useState<MentoringRoomView[]>([])
  const [questions, setQuestions] = useState<MentoringQuestion[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null)
  const [selectedQuestionId, setSelectedQuestionId] = useState<number | null>(
    null,
  )
  const [isWritingNew, setIsWritingNew] = useState(false)
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false)
  const [editingRoom, setEditingRoom] = useState<MentoringRoomView | undefined>(
    undefined,
  )
  const [isStatusUpdating, setIsStatusUpdating] = useState(false)

  const isMentor = profile?.role === 'MENTOR' || profile?.role === 'LEADER'

  const reloadMentoring = useCallback(async () => {
    try {
      const data = await fetchMentoring()
      applyMentoringData(data, setMembers, setQuestions, setRooms)
      return data
    } catch {
      return null
    }
  }, [])

  useEffect(() => {
    let isCancelled = false

    getProfile()
      .then((myProfile) => {
        if (!isCancelled) {
          setProfile(myProfile)
        }
      })
      .catch(() => {})

    fetchMentoring()
      .then((data) => {
        if (!isCancelled) {
          applyMentoringData(data, setMembers, setQuestions, setRooms)
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!isCancelled) {
          setIsLoading(false)
        }
      })

    return () => {
      isCancelled = true
    }
  }, [])

  const activeRoomId =
    selectedRoomId !== null &&
    rooms.some((room) => room.mentoringId === selectedRoomId)
      ? selectedRoomId
      : (rooms[0]?.mentoringId ?? null)

  const roomQuestions = useMemo(() => {
    return questions
      .filter((question) => question.mentoringId === activeRoomId)
      .sort((first, second) => {
        const firstOrder = first.status === 'DONE' ? 1 : 0
        const secondOrder = second.status === 'DONE' ? 1 : 0

        return (
          firstOrder - secondOrder ||
          new Date(second.createdAt).getTime() -
            new Date(first.createdAt).getTime() ||
          second.questionId - first.questionId
        )
      })
  }, [activeRoomId, questions])

  const membersByUserId = useMemo(
    () =>
      Object.fromEntries(members.map((member) => [member.userId, member])) as
        Record<number, Member>,
    [members],
  )

  const selectedRoom = rooms.find(
    (room) => room.mentoringId === activeRoomId,
  )
  const activeQuestionId =
    !isWritingNew &&
    selectedQuestionId !== null &&
    roomQuestions.some((question) => question.questionId === selectedQuestionId)
      ? selectedQuestionId
      : !isWritingNew
        ? (roomQuestions[0]?.questionId ?? null)
        : null
  const selectedQuestion = roomQuestions.find(
    (question) => question.questionId === activeQuestionId,
  )
  const shouldShowCompleteAction = Boolean(
    isMentor && selectedQuestion && selectedQuestion.status !== 'DONE',
  )
  const shouldShowAddQuestion = Boolean(selectedRoom)

  const handleSelectRoom = (room: MentoringRoomView) => {
    setSelectedRoomId(room.mentoringId)
    setSelectedQuestionId(null)
    setIsWritingNew(false)
  }

  const handleDeleteRoom = async (room: MentoringRoomView) => {
    try {
      await deleteMentoring(room.mentoringId)
      await reloadMentoring()
    } catch {
      // 삭제 실패 시 기존 목록을 유지한다.
    }
  }

  const handleDeleteQuestion = async (question: MentoringQuestion) => {
    try {
      await deleteQuestion(question.questionId)
      setQuestions((currentQuestions) =>
        currentQuestions.filter(
          ({ questionId }) => questionId !== question.questionId,
        ),
      )
      if (selectedQuestionId === question.questionId) {
        setSelectedQuestionId(null)
      }
    } catch {
      // 삭제 실패 시 기존 질문을 유지한다.
    }
  }

  const handleCreateQuestion = async (content: string, files: File[]) => {
    if (activeRoomId === null) {
      return
    }

    const uploadedFiles = await Promise.all(
      files.map((file) => uploadMentoringFile(file)),
    )
    const createdQuestion = await createQuestion({
      mentoringId: activeRoomId,
      title: content.length > 20 ? `${content.slice(0, 20)}...` : content,
      content,
      files: uploadedFiles,
    })

    await reloadMentoring()
    setSelectedQuestionId(createdQuestion.questionId)
    setIsWritingNew(false)
  }

  const handleCompleteQuestion = async () => {
    if (!selectedQuestion || isStatusUpdating) {
      return
    }

    try {
      setIsStatusUpdating(true)
      await changeQuestionStatus(selectedQuestion.questionId, 'DONE')
      setQuestions((currentQuestions) =>
        currentQuestions.map((question) =>
          question.questionId === selectedQuestion.questionId
            ? { ...question, status: 'DONE' }
            : question,
        ),
      )
    } catch {
      // 상태 변경 실패 시 기존 상태를 유지한다.
    } finally {
      setIsStatusUpdating(false)
    }
  }

  const handleAddQuestion = () => {
    if (!selectedRoom) {
      return
    }

    setSelectedQuestionId(null)
    setIsWritingNew(true)
  }

  return (
    <S.Page>
      <S.Container>
        <S.LeftArea>
          <S.RoomContainer>
            <S.SectionHeader>
              <S.SectionHeading>
                <S.SectionTitle>방</S.SectionTitle>
                {!isLoading && <S.SectionCount>{rooms.length}</S.SectionCount>}
              </S.SectionHeading>
              {isMentor && (
                <S.AddButton
                  type="button"
                  aria-label="멘토링 방 추가"
                  onClick={() => {
                    setEditingRoom(undefined)
                    setIsRoomModalOpen(true)
                  }}
                >
                  <PiPlus aria-hidden="true" />
                  <span>새 방</span>
                </S.AddButton>
              )}
            </S.SectionHeader>
            <S.ListScroll>
              {isLoading ? (
                <S.DetailEmpty>방을 불러오는 중이에요.</S.DetailEmpty>
              ) : (
                <MentoringRoomList
                  rooms={rooms}
                  selectedRoomId={activeRoomId}
                  canManageRoom={Boolean(isMentor)}
                  onSelect={handleSelectRoom}
                  onEdit={(room) => {
                    setEditingRoom(room)
                    setIsRoomModalOpen(true)
                  }}
                  onDelete={handleDeleteRoom}
                />
              )}
            </S.ListScroll>
          </S.RoomContainer>

          <S.QuestionContainer>
            <S.SectionHeader>
              <S.SectionHeading>
                <S.SectionTitle>질문</S.SectionTitle>
                {!isLoading && (
                  <S.SectionCount>{roomQuestions.length}</S.SectionCount>
                )}
              </S.SectionHeading>
              {shouldShowAddQuestion && (
                <S.AddButton
                  type="button"
                  aria-label="질문 추가"
                  onClick={handleAddQuestion}
                >
                  <PiPlus aria-hidden="true" />
                  <span>새 질문</span>
                </S.AddButton>
              )}
            </S.SectionHeader>
            <S.ListScroll>
              {isLoading ? (
                <S.DetailEmpty>질문을 불러오는 중이에요.</S.DetailEmpty>
              ) : selectedRoom ? (
                <MentoringQuestionList
                  questions={roomQuestions}
                  selectedQuestionId={activeQuestionId}
                  onSelect={(question) => {
                    setSelectedQuestionId(question.questionId)
                    setIsWritingNew(false)
                  }}
                  onDelete={handleDeleteQuestion}
                />
              ) : (
                <S.DetailEmpty>등록된 질문이 없습니다.</S.DetailEmpty>
              )}
            </S.ListScroll>
          </S.QuestionContainer>
        </S.LeftArea>

        <S.RightContainer>
          <S.DetailWrapper>
            {isLoading ? (
              <S.DetailEmpty>멘토링 정보를 불러오는 중이에요.</S.DetailEmpty>
            ) : isWritingNew ? (
              <>
                <S.DetailEmpty>질문을 시작해보세요.</S.DetailEmpty>
                <MentoringComposer
                  placeholder="질문을 남겨보세요."
                  onSubmit={handleCreateQuestion}
                />
              </>
            ) : selectedQuestion ? (
              <QuestionDetailPanel
                embedded
                question={selectedQuestion}
                roomName={selectedRoom?.mentoringName ?? ''}
                currentUserId={profile?.userId}
                canChangeStatus={false}
                membersByUserId={membersByUserId}
                showCompleteAction={shouldShowCompleteAction}
                isCompleting={isStatusUpdating}
                onClose={() => setSelectedQuestionId(null)}
                onComplete={() => void handleCompleteQuestion()}
                onStatusChange={async () => {
                  await reloadMentoring()
                }}
              />
            ) : (
              <S.DetailEmpty>선택된 질문이 없습니다.</S.DetailEmpty>
            )}
          </S.DetailWrapper>
        </S.RightContainer>
      </S.Container>

      <CreateRoomModal
        isOpen={isRoomModalOpen}
        room={editingRoom}
        onClose={() => setIsRoomModalOpen(false)}
        onSaveSuccess={async () => {
          await reloadMentoring()
        }}
      />
    </S.Page>
  )
}
