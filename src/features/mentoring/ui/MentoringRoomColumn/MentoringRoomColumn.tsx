import { useEffect, useRef, useState } from 'react'
import { PiDotsThreeVertical, PiPlus } from 'react-icons/pi'

import type { MentoringQuestion } from '@/entities/mentoring'

import type { MentoringRoomView } from '../../model/types'
import { MemberAvatar } from '../MemberAvatar'
import { QuestionCard } from '../QuestionCard'
import * as S from './MentoringRoomColumn.style'

/** 방 헤더에 노출할 최대 프로필 수 */
const VISIBLE_AVATAR_COUNT = 4

interface MentoringRoomColumnProps {
  room: MentoringRoomView
  questions: MentoringQuestion[]
  canManageRoom: boolean
  canAskQuestion: boolean
  onSelectQuestion: (question: MentoringQuestion) => void
  onAskQuestion: (room: MentoringRoomView) => void
  onEditRoom: (room: MentoringRoomView) => void
  onDeleteRoom: (room: MentoringRoomView) => void
}

export function MentoringRoomColumn({
  room,
  questions,
  canManageRoom,
  canAskQuestion,
  onSelectQuestion,
  onAskQuestion,
  onEditRoom,
  onDeleteRoom,
}: MentoringRoomColumnProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const headerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseDown = (event: MouseEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) {
        setIsMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleMouseDown)
    return () => document.removeEventListener('mousedown', handleMouseDown)
  }, [])

  return (
    <S.Column>
      <S.Header ref={headerRef}>
        <S.HeaderInfo>
          <S.AvatarGroup>
            {room.members.slice(0, VISIBLE_AVATAR_COUNT).map((member) => (
              <MemberAvatar
                key={member.userId}
                userName={member.userName}
                profileImageUrl={member.profileImageUrl}
              />
            ))}
          </S.AvatarGroup>
          <S.RoomName>{room.mentoringName}</S.RoomName>
        </S.HeaderInfo>
        {canManageRoom && (
          <S.MenuButton
            type="button"
            aria-label={`${room.mentoringName} 방 관리`}
            aria-haspopup="menu"
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            <PiDotsThreeVertical aria-hidden="true" />
          </S.MenuButton>
        )}
        {/* 방 관리 메뉴를 연 경우에만 노출한다 */}
        {isMenuOpen && (
          <S.Menu role="menu">
            <S.MenuItem
              type="button"
              role="menuitem"
              onClick={() => {
                setIsMenuOpen(false)
                onEditRoom(room)
              }}
            >
              방 수정하기
            </S.MenuItem>
            <S.MenuItem
              type="button"
              role="menuitem"
              $isDanger
              onClick={() => {
                setIsMenuOpen(false)
                onDeleteRoom(room)
              }}
            >
              방 삭제하기
            </S.MenuItem>
          </S.Menu>
        )}
      </S.Header>
      {canAskQuestion && (
        <S.AskButton type="button" onClick={() => onAskQuestion(room)}>
          <PiPlus aria-hidden="true" />
          질문하기
        </S.AskButton>
      )}
      {/* 질문이 없는 방은 안내 문구를 대신 보여준다 */}
      {questions.length === 0 ? (
        <S.EmptyText>아직 등록된 질문이 없어요.</S.EmptyText>
      ) : (
        questions.map((question) => (
          <QuestionCard
            key={question.questionId}
            question={question}
            onSelect={onSelectQuestion}
          />
        ))
      )}
    </S.Column>
  )
}
