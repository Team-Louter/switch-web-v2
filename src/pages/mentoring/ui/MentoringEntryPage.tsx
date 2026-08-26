import { useCallback, useEffect, useMemo, useState } from 'react'

import { Button } from '@/shared/ui'
import { getMember } from '@/entities/member'
import { getProfile } from '@/entities/member/getProfile'
import type { Profile } from '@/entities/member/model/profile'
import type { Member } from '@/entities/member/model/types'
import {
  getMentoringMembers,
  getMentorings,
  getQuestions,
} from '@/entities/mentoring'
import type { MentoringQuestion } from '@/entities/mentoring'
import {
  CreateQuestionModal,
  CreateRoomModal,
  MentoringRoomColumn,
  MyMentorChip,
  QuestionDetailPanel,
} from '@/features/mentoring'
import type { MentoringRoomView } from '@/features/mentoring'
import { deleteMentoring } from '@/features/mentoring'

import { useMentoringEntryPage } from '../model/useMentoringEntryPage'
import * as S from './MentoringEntryPage.style'

interface MentoringData {
  members: Member[]
  questions: MentoringQuestion[]
  rooms: MentoringRoomView[]
}

/**
 * 멘토링 방과 방별 멤버, 질문을 한 번에 불러온다.
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
    userIds
      .map((userId) => memberByUserId.get(userId))
      .filter((member): member is Member => member !== undefined)

  const rooms = await Promise.all(
    mentorings.map(async (room) => {
      const [mentors, mentees] = await Promise.all([
        getMentoringMembers(room.mentoringId, 'MENTOR').catch(() => []),
        getMentoringMembers(room.mentoringId, 'MENTEE').catch(() => []),
      ])
      const mentorMembers = toMembers(mentors.map(({ userId }) => userId))
      const menteeMembers = toMembers(mentees.map(({ userId }) => userId))

      return {
        ...room,
        mentors: mentorMembers,
        members: [...mentorMembers, ...menteeMembers],
      }
    }),
  )

  return { members, questions, rooms }
}

export function MentoringEntryPage() {
  const { handleDashboardClick } = useMentoringEntryPage()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [members, setMembers] = useState<Member[]>([])
  const [rooms, setRooms] = useState<MentoringRoomView[]>([])
  const [questions, setQuestions] = useState<MentoringQuestion[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedQuestionId, setSelectedQuestionId] = useState<number | null>(
    null,
  )
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false)
  const [editingRoom, setEditingRoom] = useState<MentoringRoomView | undefined>(
    undefined,
  )
  const [askingRoomId, setAskingRoomId] = useState<number | null>(null)

  // 역할을 확인하기 전에는 멘토 / 멘티 전용 요소를 노출하지 않는다.
  const isMentor = profile?.role === 'MENTOR' || profile?.role === 'LEADER'
  const isMentee = profile?.role === 'MENTEE' || profile?.role === 'STUDENT'

  /**
   * 멘토링 목록을 다시 불러와 화면 상태에 반영한다.
   */
  const reloadMentoring = useCallback(() => {
    fetchMentoring()
      .then(({ members: loadedMembers, questions: loadedQuestions, rooms: loadedRooms }) => {
        setMembers(loadedMembers)
        setQuestions(loadedQuestions)
        setRooms(loadedRooms)
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    let isCancelled = false

    getProfile()
      .then((myProfile) => {
        if (!isCancelled) setProfile(myProfile)
      })
      .catch(() => {})

    fetchMentoring()
      .then(({ members: loadedMembers, questions: loadedQuestions, rooms: loadedRooms }) => {
        if (isCancelled) return

        setMembers(loadedMembers)
        setQuestions(loadedQuestions)
        setRooms(loadedRooms)
      })
      .catch(() => {})
      .finally(() => {
        if (!isCancelled) setIsLoading(false)
      })

    return () => {
      isCancelled = true
    }
  }, [])

  const membersByUserId = useMemo(
    () =>
      Object.fromEntries(members.map((member) => [member.userId, member])) as
        Record<number, Member>,
    [members],
  )

  const myMentors = useMemo(() => {
    const mentorByUserId = new Map(
      rooms
        .flatMap((room) => room.mentors)
        .map((mentor) => [mentor.userId, mentor]),
    )

    return [...mentorByUserId.values()]
  }, [rooms])

  const selectedQuestion = questions.find(
    (question) => question.questionId === selectedQuestionId,
  )
  const selectedRoom = rooms.find(
    (room) => room.mentoringId === selectedQuestion?.mentoringId,
  )

  const handleDeleteRoom = async (room: MentoringRoomView) => {
    try {
      await deleteMentoring(room.mentoringId)
      reloadMentoring()
    } catch {
      // 실패 시 기존 목록을 유지한다.
    }
  }

  return (
    <S.PageContainer>
      <S.Header>
        <S.TitleGroup>
          <S.Title>멘토링</S.Title>
          <S.Subtitle>
            {isMentor
              ? '멘티의 성장을 도와주세요!'
              : '멘토와 함께 한 단계 성장해 볼까요?'}
          </S.Subtitle>
        </S.TitleGroup>
        {isMentor && (
          <Button
            type="button"
            size="md"
            variant="neutral"
            onClick={handleDashboardClick}
          >
            대시보드로 이동
          </Button>
        )}
        {isMentee && <MyMentorChip mentors={myMentors} />}
      </S.Header>
      <S.QuestionSection>
        <S.SectionHeader>
          <S.SectionTitle>질문 목록</S.SectionTitle>
          {/* 방 생성은 멘토만 할 수 있다 */}
          {isMentor && (
            <Button
              type="button"
              size="md"
              variant="primary"
              onClick={() => {
                setEditingRoom(undefined)
                setIsRoomModalOpen(true)
              }}
            >
              방 새로 만들기
            </Button>
          )}
        </S.SectionHeader>
        {/* 목록을 불러오는 중이거나 참여 중인 방이 없는 경우를 구분해 안내한다 */}
        {isLoading ? (
          <S.StateText>멘토링 방을 불러오는 중이에요.</S.StateText>
        ) : rooms.length === 0 ? (
          <S.StateText>참여 중인 멘토링 방이 없어요.</S.StateText>
        ) : (
          <S.RoomScroll>
            {rooms.map((room) => (
              <MentoringRoomColumn
                key={room.mentoringId}
                room={room}
                questions={questions.filter(
                  (question) => question.mentoringId === room.mentoringId,
                )}
                canManageRoom={isMentor}
                canAskQuestion={isMentee}
                onSelectQuestion={(question) =>
                  setSelectedQuestionId(question.questionId)
                }
                onAskQuestion={({ mentoringId }) =>
                  setAskingRoomId(mentoringId)
                }
                onEditRoom={(selectedRoomView) => {
                  setEditingRoom(selectedRoomView)
                  setIsRoomModalOpen(true)
                }}
                onDeleteRoom={(selectedRoomView) =>
                  void handleDeleteRoom(selectedRoomView)
                }
              />
            ))}
          </S.RoomScroll>
        )}
      </S.QuestionSection>
      {/* 질문을 선택한 경우에만 상세 패널을 띄운다 */}
      {selectedQuestion && (
        <QuestionDetailPanel
          question={selectedQuestion}
          roomName={selectedRoom?.mentoringName ?? ''}
          currentUserId={profile?.userId}
          canChangeStatus={isMentor}
          membersByUserId={membersByUserId}
          onClose={() => setSelectedQuestionId(null)}
          onStatusChange={() => reloadMentoring()}
        />
      )}
      <CreateRoomModal
        isOpen={isRoomModalOpen}
        room={editingRoom}
        onClose={() => setIsRoomModalOpen(false)}
        onSaveSuccess={() => reloadMentoring()}
      />
      {/* 질문하기를 누른 방이 있을 때만 생성 모달을 띄운다 */}
      {askingRoomId !== null && (
        <CreateQuestionModal
          isOpen
          mentoringId={askingRoomId}
          onClose={() => setAskingRoomId(null)}
          onCreateSuccess={() => reloadMentoring()}
        />
      )}
    </S.PageContainer>
  )
}
