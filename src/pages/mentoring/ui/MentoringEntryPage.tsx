import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { PiPlus } from 'react-icons/pi'

import { getMember } from '@/entities/member'
import { getProfile } from '@/entities/member/getProfile'
import type { Profile } from '@/entities/member/model/profile'
import type { Member } from '@/entities/member/model/types'
import {
  getMessages,
  getMentoringMembers,
  getMentorings,
  getQuestions,
} from '@/entities/mentoring'
import type {
  MentoringMessage,
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
import {
  MentoringDetailSkeleton,
  MentoringQuestionListSkeleton,
  MentoringRoomListSkeleton,
} from './MentoringEntryPageSkeleton'
import * as S from './MentoringEntryPage.style'

interface MentoringData {
  members: Member[]
  questions: MentoringQuestion[]
  rooms: MentoringRoomView[]
}

interface MentoringBaseData {
  mentorings: MentoringRoom[]
  questions: MentoringQuestion[]
}

// 빠른 응답에서 스켈레톤이 한 프레임만 보이는 플래시를 방지한다.
const INITIAL_SKELETON_MIN_DURATION_MS = 180
// 외부 프로필 이미지가 응답하지 않아도 전체 화면 로딩이 멈추지 않도록 제한한다.
const MEMBER_IMAGE_PRELOAD_TIMEOUT_MS = 1_500

const wait = (durationMs: number) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, durationMs)
  })

async function fetchMentoringBase(): Promise<MentoringBaseData> {
  const [mentorings, questions] = await Promise.all([
    getMentorings(),
    getQuestions(),
  ])

  return { mentorings, questions }
}

async function hydrateRoomViews(
  mentorings: MentoringRoom[],
  members: Member[],
): Promise<MentoringRoomView[]> {
  const memberByUserId = new Map(
    members.map((member) => [member.userId, member]),
  )
  const toMembers = (userIds: number[]) =>
    [...new Set(userIds)]
      .map((userId) => memberByUserId.get(userId))
      .filter((member): member is Member => member !== undefined)

  return Promise.all(
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
}

/**
 * 스켈레톤을 숨기기 전에 실제 아바타 리소스를 브라우저 캐시에 준비한다.
 * 프로필 목록은 API 응답보다 이미지 로딩이 늦을 수 있어, 준비 전 화면을 노출하면
 * 기본 이미지가 잠시 보이는 플래시가 발생한다.
 */
async function preloadMemberImages(members: Member[]): Promise<void> {
  const imageUrls = [
    ...new Set(
      members
        .map(({ profileImageUrl }) => profileImageUrl)
        .filter((url): url is string => Boolean(url)),
    ),
  ]

  await Promise.all(
    imageUrls.map((url) => {
      return new Promise<void>((resolve) => {
        const image = new Image()

        const settle = () => {
          window.clearTimeout(timeoutId)
          image.onload = null
          image.onerror = null
          resolve()
        }

        image.onload = settle
        image.onerror = settle
        const timeoutId = window.setTimeout(
          settle,
          MEMBER_IMAGE_PRELOAD_TIMEOUT_MS,
        )
        image.src = url
      })
    }),
  )
}

/**
 * 멘토링 방, 방별 멤버, 질문을 v1 화면이 요구하는 단위로 구성한다.
 */
async function fetchMentoring(): Promise<MentoringData> {
  const [{ mentorings, questions }, members] = await Promise.all([
    fetchMentoringBase(),
    getMember(),
  ])
  const rooms = await hydrateRoomViews(mentorings, members)
  await preloadMemberImages(
    rooms.flatMap(({ members: roomMembers }) => roomMembers),
  )

  return {
    members,
    questions,
    rooms,
  }
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
  const [initialMessagesPromise, setInitialMessagesPromise] = useState<
    Promise<MentoringMessage[]> | null
  >(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null)
  const [selectedQuestionId, setSelectedQuestionId] = useState<number | null>(
    null,
  )
  const [isWritingNew, setIsWritingNew] = useState(false)
  const [pendingQuestionId, setPendingQuestionId] = useState<number | null>(
    null,
  )
  const [isCreatingQuestion, setIsCreatingQuestion] = useState(false)
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false)
  const [editingRoom, setEditingRoom] = useState<MentoringRoomView | undefined>(
    undefined,
  )
  const [isStatusUpdating, setIsStatusUpdating] = useState(false)
  const optimisticQuestionIdRef = useRef(-1)

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
    const minimumSkeleton = wait(INITIAL_SKELETON_MIN_DURATION_MS)
    // 방/질문과 답변 요청을 멤버 상세 조회와 동시에 시작한다.
    const baseDataPromise = fetchMentoringBase()
    const membersPromise = getMember().catch(() => [])
    const messagesPromise = getMessages().catch(() => [])

    getProfile()
      .then((myProfile) => {
        if (!isCancelled) {
          setProfile(myProfile)
        }
      })
      .catch(() => {})

    const loadInitialData = async () => {
      try {
        const [{ mentorings, questions }] = await Promise.all([
          baseDataPromise,
          minimumSkeleton,
        ])

        if (isCancelled) {
          return
        }

        setQuestions(questions)

        const members = await membersPromise

        if (isCancelled) {
          return
        }

        setMembers(members)
        const hydratedRooms = await hydrateRoomViews(mentorings, members)
        await preloadMemberImages(
          hydratedRooms.flatMap(({ members: roomMembers }) => roomMembers),
        )

        if (isCancelled) {
          return
        }

        setRooms(hydratedRooms)
        setInitialMessagesPromise(messagesPromise)
        setIsLoading(false)
      } catch {
        await minimumSkeleton

        if (!isCancelled) {
          setIsLoading(false)
        }
      }
    }

    void loadInitialData()

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

  const handleDeleteRoom = async (
    room: MentoringRoomView,
  ): Promise<boolean> => {
    try {
      await deleteMentoring(room.mentoringId)
      await reloadMentoring()
      return true
    } catch {
      // 삭제 실패 시 기존 목록을 유지하고 확인 모달에서 재시도할 수 있게 한다.
      return false
    }
  }

  const handleDeleteQuestion = async (
    question: MentoringQuestion,
  ): Promise<boolean> => {
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
      return true
    } catch {
      // 삭제 실패 시 기존 질문을 유지하고 확인 모달에서 재시도할 수 있게 한다.
      return false
    }
  }

  const handleCreateQuestion = async (content: string, files: File[]) => {
    if (activeRoomId === null || isCreatingQuestion) {
      return
    }

    const optimisticQuestionId = optimisticQuestionIdRef.current
    optimisticQuestionIdRef.current -= 1
    const optimisticQuestion: MentoringQuestion = {
      questionId: optimisticQuestionId,
      mentoringId: activeRoomId,
      userId: profile?.userId ?? 0,
      status: 'PAUSED',
      title: content.length > 20 ? `${content.slice(0, 20)}...` : content,
      content,
      files: [],
      createdAt: new Date().toISOString(),
    }

    setPendingQuestionId(optimisticQuestionId)
    setIsCreatingQuestion(true)
    setQuestions((currentQuestions) => [
      optimisticQuestion,
      ...currentQuestions,
    ])

    try {
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
      setQuestions((currentQuestions) => [
        createdQuestion,
        ...currentQuestions.filter(
          (question) =>
            question.questionId !== optimisticQuestionId &&
            question.questionId !== createdQuestion.questionId,
        ),
      ])
      setSelectedQuestionId(createdQuestion.questionId)
      setIsWritingNew(false)
    } catch (error) {
      setQuestions((currentQuestions) =>
        currentQuestions.filter(
          (question) => question.questionId !== optimisticQuestionId,
        ),
      )
      throw error
    } finally {
      setPendingQuestionId(null)
      setIsCreatingQuestion(false)
    }
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
        <S.LeftArea aria-busy={isLoading}>
          <S.RoomContainer>
            <S.SectionHeader>
              <S.SectionHeading>
                <S.SectionTitle>방</S.SectionTitle>
                {isLoading ? (
                  <S.SkeletonCount aria-hidden="true" />
                ) : (
                  <S.SectionCount>{rooms.length}</S.SectionCount>
                )}
              </S.SectionHeading>
              {isLoading ? (
                <S.SkeletonAction aria-hidden="true" />
              ) : (
                isMentor && (
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
                )
              )}
            </S.SectionHeader>
            <S.ListScroll>
              {isLoading ? (
                <MentoringRoomListSkeleton />
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
                {isLoading ? (
                  <S.SkeletonCount aria-hidden="true" />
                ) : (
                  <S.SectionCount>{roomQuestions.length}</S.SectionCount>
                )}
              </S.SectionHeading>
              {isLoading ? (
                <S.SkeletonAction aria-hidden="true" />
              ) : (
                shouldShowAddQuestion && (
                  <S.AddButton
                    type="button"
                    aria-label="질문 추가"
                    onClick={handleAddQuestion}
                  >
                    <PiPlus aria-hidden="true" />
                    <span>새 질문</span>
                  </S.AddButton>
                )
              )}
            </S.SectionHeader>
            <S.ListScroll>
              {isLoading ? (
                <MentoringQuestionListSkeleton />
              ) : selectedRoom ? (
                <MentoringQuestionList
                  key={activeRoomId}
                  questions={roomQuestions}
                  pendingQuestionId={pendingQuestionId}
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

        <S.RightContainer aria-busy={isLoading}>
          <S.DetailWrapper>
            {isLoading ? (
              <MentoringDetailSkeleton />
            ) : isWritingNew ? (
              <>
                <S.DetailEmpty>질문을 시작해보세요.</S.DetailEmpty>
                <MentoringComposer
                  allowFileOnly={false}
                  isSubmitting={isCreatingQuestion}
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
                messagesPromise={initialMessagesPromise ?? undefined}
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
