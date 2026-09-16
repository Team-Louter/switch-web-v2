import { useEffect, useState } from 'react'
import { PiDotsThreeVertical } from 'react-icons/pi'

import type { MentoringQuestion } from '@/entities/mentoring'
import {
  formatQuestionDate,
  QUESTION_STATUS_COLOR,
  QUESTION_STATUS_LABEL,
} from '@/features/mentoring'
import { ConfirmModal } from '@/shared/ui'

import * as S from './MentoringQuestionList.style'
import * as Menu from './MentoringContextMenu.style'
import { getMenuPlacement, type MenuPlacement } from './menuPlacement'

const QUESTION_MENU_HEIGHT = 40

interface MentoringQuestionListProps {
  onDelete: (question: MentoringQuestion) => Promise<void>
  onSelect: (question: MentoringQuestion) => void
  questions: MentoringQuestion[]
  selectedQuestionId: number | null
}

export function MentoringQuestionList({
  onDelete,
  onSelect,
  questions,
  selectedQuestionId,
}: MentoringQuestionListProps) {
  const [openedMenuQuestionId, setOpenedMenuQuestionId] = useState<
    number | null
  >(null)
  const [menuPlacement, setMenuPlacement] = useState<MenuPlacement>('bottom')
  const [deleteTarget, setDeleteTarget] =
    useState<MentoringQuestion | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  useEffect(() => {
    const handlePointerDown = () => setOpenedMenuQuestionId(null)

    document.addEventListener('mousedown', handlePointerDown)

    return () => document.removeEventListener('mousedown', handlePointerDown)
  }, [])

  const handleDelete = async () => {
    if (!deleteTarget) {
      return
    }

    try {
      setIsDeleting(true)
      await onDelete(deleteTarget)
      setDeleteTarget(null)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      <S.List>
        {questions.length === 0 ? (
          <S.EmptyText>등록된 질문이 없습니다.</S.EmptyText>
        ) : (
          questions.map((question) => (
            <QuestionListItem
              key={question.questionId}
              isSelected={question.questionId === selectedQuestionId}
              menuPlacement={menuPlacement}
              question={question}
              onDelete={setDeleteTarget}
              onSelect={onSelect}
              isMenuOpen={openedMenuQuestionId === question.questionId}
              onMenuToggle={(trigger) => {
                if (openedMenuQuestionId === question.questionId) {
                  setOpenedMenuQuestionId(null)
                  return
                }

                setMenuPlacement(
                  getMenuPlacement(trigger, QUESTION_MENU_HEIGHT),
                )
                setOpenedMenuQuestionId(question.questionId)
              }}
            />
          ))
        )}
      </S.List>

      {deleteTarget && (
        <ConfirmModal
          title="질문 삭제"
          description="이 질문을 삭제하시겠습니까?"
          confirmLabel="삭제"
          isConfirming={isDeleting}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={() => void handleDelete()}
        />
      )}
    </>
  )
}

interface QuestionListItemProps {
  isMenuOpen: boolean
  isSelected: boolean
  menuPlacement: MenuPlacement
  onDelete: (question: MentoringQuestion) => void
  onMenuToggle: (trigger: HTMLButtonElement) => void
  onSelect: (question: MentoringQuestion) => void
  question: MentoringQuestion
}

function QuestionListItem({
  isMenuOpen,
  isSelected,
  menuPlacement,
  onDelete,
  onMenuToggle,
  onSelect,
  question,
}: QuestionListItemProps) {
  return (
    <S.QuestionItem
      $selected={isSelected}
      role="button"
      tabIndex={0}
      onClick={() => onSelect(question)}
      onKeyDown={(event) => {
        if (event.target !== event.currentTarget) {
          return
        }

        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onSelect(question)
        }
      }}
    >
      <S.QuestionBody>
        <S.QuestionHeader>
          <S.QuestionTitle>{question.title}</S.QuestionTitle>
        </S.QuestionHeader>
        <S.StatusRow>
          <S.StatusBadge
            $color={QUESTION_STATUS_COLOR[question.status]}
          >
            {QUESTION_STATUS_LABEL[question.status]}
          </S.StatusBadge>
          <S.QuestionDate>{formatQuestionDate(question.createdAt)}</S.QuestionDate>
        </S.StatusRow>
      </S.QuestionBody>
      <S.QuestionActions>
        <S.MenuButton
          type="button"
          aria-label="질문 관리"
          aria-haspopup="menu"
          aria-expanded={isMenuOpen}
          onClick={(event) => {
            event.stopPropagation()
            onMenuToggle(event.currentTarget)
          }}
        >
          <PiDotsThreeVertical aria-hidden="true" />
        </S.MenuButton>
        {isMenuOpen && (
          <Menu.Panel $placement={menuPlacement} role="menu">
            <Menu.Item
              type="button"
              role="menuitem"
              $danger
              onClick={(event) => {
                event.stopPropagation()
                onDelete(question)
              }}
            >
              삭제하기
            </Menu.Item>
          </Menu.Panel>
        )}
      </S.QuestionActions>
    </S.QuestionItem>
  )
}
