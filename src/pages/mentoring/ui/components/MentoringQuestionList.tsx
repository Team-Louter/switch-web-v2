import { useEffect, useState } from 'react'
import { PiCheck, PiDotsThreeVertical, PiSpinnerGap } from 'react-icons/pi'

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
  onDelete: (question: MentoringQuestion) => Promise<boolean>
  onSelect: (question: MentoringQuestion) => void
  pendingQuestionId?: number | null
  questions: MentoringQuestion[]
  selectedQuestionId: number | null
}

export function MentoringQuestionList({
  onDelete,
  onSelect,
  pendingQuestionId = null,
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
  const [deleteError, setDeleteError] = useState(false)
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
        {questions.length === 0 ? (
          <S.EmptyText>등록된 질문이 없습니다.</S.EmptyText>
        ) : (
          questions.map((question) => (
            <QuestionListItem
              isPending={question.questionId === pendingQuestionId}
              key={question.questionId}
              isSelected={question.questionId === selectedQuestionId}
              menuPlacement={menuPlacement}
              question={question}
              onDelete={(nextQuestion) => {
                setDeleteError(false)
                setDeleteTarget(nextQuestion)
              }}
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
          description={
            deleteError
              ? '질문 삭제에 실패했습니다. 다시 시도해주세요.'
              : '이 질문을 삭제하시겠습니까?'
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

interface QuestionListItemProps {
  isPending: boolean
  isMenuOpen: boolean
  isSelected: boolean
  menuPlacement: MenuPlacement
  onDelete: (question: MentoringQuestion) => void
  onMenuToggle: (trigger: HTMLButtonElement) => void
  onSelect: (question: MentoringQuestion) => void
  question: MentoringQuestion
}

function QuestionListItem({
  isPending,
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
      $pending={isPending}
      $selected={isSelected}
      role="button"
      tabIndex={isPending ? -1 : 0}
      aria-busy={isPending}
      onClick={() => {
        if (!isPending) {
          onSelect(question)
        }
      }}
      onKeyDown={(event) => {
        if (isPending || event.target !== event.currentTarget) {
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
            $isDone={question.status === 'DONE' && !isPending}
            $isPending={isPending}
          >
            {isPending ? (
              <PiSpinnerGap aria-hidden="true" />
            ) : (
              question.status === 'DONE' && <PiCheck aria-hidden="true" />
            )}
            {isPending ? '질문 생성 중' : QUESTION_STATUS_LABEL[question.status]}
          </S.StatusBadge>
          <S.QuestionDate>{formatQuestionDate(question.createdAt)}</S.QuestionDate>
        </S.StatusRow>
      </S.QuestionBody>
      {!isPending && (
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
            <Menu.Panel
              $placement={menuPlacement}
              role="menu"
              onMouseDown={(event) => event.stopPropagation()}
            >
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
      )}
    </S.QuestionItem>
  )
}
