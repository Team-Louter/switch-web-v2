import MonacoEditor, { loader } from '@monaco-editor/react'
import * as monaco from 'monaco-editor'
import { type MouseEvent, useEffect, useState } from 'react'
import {
  IoChevronDown,
  IoClose,
  IoPencil,
  IoTrashOutline,
} from 'react-icons/io5'
import { LuPlus } from 'react-icons/lu'

import { getProblems, type TypingProblem } from '@/entities/typing'

import { createProblem } from '../../api/createProblem'
import { deleteProblem } from '../../api/deleteProblem'
import { updateProblem } from '../../api/updateProblem'
import * as S from './TypingSentenceModal.style'

export type TypingSentenceModalType = 'settings' | 'editor' | 'delete' | null

type SentenceCategory = 'DAILY' | 'CODE'

type TypingSentenceModalProps = {
  editingItem: TypingProblem | null
  modalType: TypingSentenceModalType
  onBackToSettings: () => void
  onClose: () => void
  onDelete: (item: TypingProblem) => void
  onEdit: (item: TypingProblem) => void
  onOpenEditor: () => void
}

loader.config({ monaco })

export function TypingSentenceModal({
  editingItem,
  modalType,
  onBackToSettings,
  onClose,
  onDelete,
  onEdit,
  onOpenEditor,
}: TypingSentenceModalProps) {
  useEffect(() => {
    if (!modalType) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [modalType])

  if (!modalType) {
    return null
  }

  const handleOverlayClick = (event: MouseEvent<HTMLDivElement>) => {
    if (modalType === 'settings' && event.target === event.currentTarget) {
      onClose()
    }
  }

  return (
    <S.Overlay onClick={handleOverlayClick}>
      {modalType === 'settings' && (
        <SettingsModal onDelete={onDelete} onEdit={onEdit} onOpenEditor={onOpenEditor} />
      )}
      {modalType === 'editor' && <SentenceEditor editingItem={editingItem} onBackToSettings={onBackToSettings} />}
      {modalType === 'delete' && editingItem && <DeleteModal item={editingItem} onBackToSettings={onBackToSettings} onClose={onClose} />}
    </S.Overlay>
  )
}

type SettingsModalProps = Pick<TypingSentenceModalProps, 'onDelete' | 'onEdit' | 'onOpenEditor'>

function SettingsModal({ onDelete, onEdit, onOpenEditor }: SettingsModalProps) {
  const [problems, setProblems] = useState<TypingProblem[]>([])

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const data = await getProblems()
        setProblems([...data].sort((a, b) => b.problemId - a.problemId))
      } catch {
        // 조회 실패 시 빈 목록을 유지한다.
      }
    }

    void fetchProblems()
  }, [])

  const getProblemLabel = (problemType: string) => {
    if (problemType === 'DAILY') return '일상'
    if (problemType === 'JAVASCRIPT') return 'JS'
    return 'Java'
  }

  return (
    <S.SettingsDialog aria-modal="true" role="dialog">
      <S.ModalHeader>
        <S.ModalTitle>문장 설정</S.ModalTitle>
        <S.IconButton aria-label="문장 추가" type="button" onClick={onOpenEditor}>
          <LuPlus size={24} />
        </S.IconButton>
      </S.ModalHeader>
      <S.SentenceList>
        {problems.map((item) => (
          <S.SentenceItem key={item.problemId}>
            <S.CategoryBadge>{getProblemLabel(item.problemType)}</S.CategoryBadge>
            <S.SentenceText>{item.content}</S.SentenceText>
            <S.RowActions>
              <S.RowAction aria-label={`${getProblemLabel(item.problemType)} 문장 수정`} type="button" onClick={() => onEdit(item)}>
                <IoPencil size={24} />
              </S.RowAction>
              <S.RowAction $danger aria-label={`${getProblemLabel(item.problemType)} 문장 삭제`} type="button" onClick={() => onDelete(item)}>
                <IoTrashOutline size={24} />
              </S.RowAction>
            </S.RowActions>
          </S.SentenceItem>
        ))}
      </S.SentenceList>
    </S.SettingsDialog>
  )
}

type SentenceEditorProps = Pick<TypingSentenceModalProps, 'editingItem' | 'onBackToSettings'>

function SentenceEditor({ editingItem, onBackToSettings }: SentenceEditorProps) {
  const [category, setCategory] = useState<SentenceCategory>(editingItem?.problemType === 'DAILY' ? 'DAILY' : 'CODE')
  const [language, setLanguage] = useState(editingItem?.problemType === 'JAVA' ? 'java' : 'javascript')
  const [sentence, setSentence] = useState(editingItem?.content ?? '')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const isCode = category === 'CODE'

  const handleCategoryChange = (nextCategory: SentenceCategory) => {
    setCategory(nextCategory)

    const editingCategory = editingItem?.problemType === 'DAILY' ? 'DAILY' : 'CODE'

    if (editingItem && editingCategory === nextCategory) {
      setSentence(editingItem.content)
      return
    }

    setSentence('')
  }

  const handleSubmit = async () => {
    const problemType = category === 'DAILY' ? 'DAILY' : language.toUpperCase()

    try {
      setIsSubmitting(true)
      if (editingItem) {
        await updateProblem(editingItem.problemId, problemType, sentence)
      } else {
        await createProblem(problemType, sentence)
      }
      onBackToSettings()
    } catch {
      // 실패 시 입력 내용을 유지해 다시 시도할 수 있게 한다.
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <S.EditorDialog aria-modal="true" role="dialog">
      <S.ModalHeader>
        <S.ModalTitle>{editingItem ? '문장 수정' : '문장 추가'}</S.ModalTitle>
        <S.IconButton aria-label="문장 설정으로 돌아가기" type="button" onClick={onBackToSettings}>
          <IoClose size={24} />
        </S.IconButton>
      </S.ModalHeader>
      <S.EditorForm onSubmit={(event) => { event.preventDefault(); void handleSubmit() }}>
        <S.Field>
          <S.FieldLabel htmlFor="sentence-category">카테고리</S.FieldLabel>
          <S.SelectWrap>
            <S.Select id="sentence-category" value={category} onChange={(event) => handleCategoryChange(event.target.value as SentenceCategory)}>
              <option value="CODE">개발 언어</option>
              <option value="DAILY">일상 영어</option>
            </S.Select>
            <IoChevronDown aria-hidden size={20} />
          </S.SelectWrap>
        </S.Field>
        {isCode && (
          <S.Field>
            <S.FieldLabel htmlFor="sentence-language">언어 선택</S.FieldLabel>
            <S.SelectWrap>
              <S.Select id="sentence-language" value={language} onChange={(event) => setLanguage(event.target.value)}>
                <option value="javascript">Javascript</option>
                <option value="java">Java</option>
              </S.Select>
              <IoChevronDown aria-hidden size={20} />
            </S.SelectWrap>
          </S.Field>
        )}
        <S.Field $grow>
          <S.FieldLabel htmlFor="sentence-content">문장</S.FieldLabel>
          {isCode ? (
            <S.CodeEditorWrap>
              <MonacoEditor
                language={language}
                value={sentence}
                onChange={(value) => setSentence(value ?? '')}
                theme="vs-dark"
                options={{
                  ariaLabel: '개발 언어 문장 에디터',
                  automaticLayout: true,
                  autoClosingBrackets: 'always',
                  autoClosingQuotes: 'always',
                  editContext: false,
                  folding: false,
                  fontFamily: "'Roboto Mono', monospace",
                  fontSize: 14,
                  glyphMargin: false,
                  lineDecorationsWidth: 18,
                  lineHeight: 20,
                  lineNumbers: 'on',
                  lineNumbersMinChars: 2,
                  minimap: { enabled: false },
                  padding: { top: 8, bottom: 8 },
                  renderLineHighlight: 'none',
                  scrollBeyondLastLine: false,
                  tabSize: 2,
                  wordWrap: 'on',
                  wrappingIndent: 'indent',
                }}
              />
            </S.CodeEditorWrap>
          ) : (
            <S.Textarea id="sentence-content" value={sentence} onChange={(event) => setSentence(event.target.value)} />
          )}
        </S.Field>
        <S.SubmitButton disabled={isSubmitting} type="submit">{editingItem ? '수정' : '추가'}</S.SubmitButton>
      </S.EditorForm>
    </S.EditorDialog>
  )
}

type DeleteModalProps = Pick<TypingSentenceModalProps, 'onBackToSettings' | 'onClose'> & { item: TypingProblem }

function DeleteModal({ item, onBackToSettings, onClose }: DeleteModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleDelete = async () => {
    try {
      setIsSubmitting(true)
      await deleteProblem(item.problemId)
      onBackToSettings()
    } catch {
      // 실패 시 삭제 확인 모달을 유지해 다시 시도할 수 있게 한다.
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <S.DeleteDialog aria-modal="true" role="alertdialog">
      <S.DeleteTitle>문장을 삭제하시겠습니까?</S.DeleteTitle>
      <S.DeleteSentence>{item.content}</S.DeleteSentence>
      <S.DeleteActions>
        <S.CancelButton type="button" onClick={onClose}>취소</S.CancelButton>
        <S.DeleteButton disabled={isSubmitting} type="button" onClick={() => { void handleDelete() }}>삭제</S.DeleteButton>
      </S.DeleteActions>
    </S.DeleteDialog>
  )
}
