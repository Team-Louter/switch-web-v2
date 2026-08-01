import { useState } from 'react'

import { ScheduleDropdown } from './ScheduleDropdown/ScheduleDropdown'
import type { ScheduleOption } from './ScheduleDropdown/ScheduleDropdown'
import * as S from './MentorTotalStudyModal.style'

interface MentorTotalStudyModalProps {
  isOpen: boolean
  onClose: () => void
}

const SCHEDULES: ScheduleOption[] = [
  { id: 1, title: '테스트', date: '6월 1일' },
  { id: 2, title: '테스트2', date: '6월 1일 ~ 6월 4일' },
  { id: 3, title: '테스트3', date: '6월 2일' },
  { id: 4, title: '테스트4', date: '6월 7일' },
  { id: 5, title: '테스트5', date: '6월 7일 ~ 6월 18일' },
]

const GENERATED_CONTENT = '내용'.repeat(180)

export function MentorTotalStudyModal({
  isOpen,
  onClose,
}: MentorTotalStudyModalProps) {
  const [selectedScheduleIds, setSelectedScheduleIds] = useState<number[]>([1, 5,])
  const [isGenerated, setIsGenerated] = useState(false)
  const [content, setContent] = useState('')

  if (!isOpen) return null

  const handleClose = () => {
    setIsGenerated(false)
    setContent('')
    onClose()
  }

  const handleGenerate = () => {
    setContent(GENERATED_CONTENT)
    setIsGenerated(true)
  }

  return (
    <S.Backdrop>
      {isGenerated ? (
        <S.GeneratedModal>
          <S.Title>6월 1주차 종합 학습일지</S.Title>
          <S.GeneratedContent>
            <S.GeneratedFormRow>
              <S.Label>관련 일정</S.Label>
              <ScheduleDropdown
                options={SCHEDULES}
                selectedIds={selectedScheduleIds}
                onChange={setSelectedScheduleIds}
              />
            </S.GeneratedFormRow>
            <S.GeneratedFormRow $align="center">
              <S.Label htmlFor="total-study-content">내용</S.Label>
              <S.ContentTextarea
                id="total-study-content"
                value={content}
                onChange={(event) => setContent(event.target.value)}
              />
            </S.GeneratedFormRow>
          </S.GeneratedContent>
          <S.GeneratedButtonContainer>
            <S.SubmitButton type="button" onClick={handleGenerate}>
              재생성
            </S.SubmitButton>
            <S.RightButtonGroup>
              <S.CancelButton type="button" onClick={handleClose}>
                취소
              </S.CancelButton>
              <S.SubmitButton type="button" onClick={handleClose}>
                저장
              </S.SubmitButton>
            </S.RightButtonGroup>
          </S.GeneratedButtonContainer>
        </S.GeneratedModal>
      ) : (
        <S.Modal
          role="dialog"
          aria-modal="true"
          aria-labelledby="total-study-create-title"
        >
          <S.Title id="total-study-create-title">
            6월 1주차 종합 학습일지 생성
          </S.Title>
          <S.FormRow>
            <S.Label>관련 일정</S.Label>
            <ScheduleDropdown
              options={SCHEDULES}
              selectedIds={selectedScheduleIds}
              onChange={setSelectedScheduleIds}
            />
          </S.FormRow>
          <S.ButtonContainer>
            <S.CancelButton type="button" onClick={handleClose}>
              취소
            </S.CancelButton>
            <S.SubmitButton
              type="button"
              disabled={selectedScheduleIds.length === 0}
              onClick={handleGenerate}
            >
              생성
            </S.SubmitButton>
          </S.ButtonContainer>
        </S.Modal>
      )}
    </S.Backdrop>
  )
}
