import { useEffect, useState } from 'react'

import type { StudyResponse } from '@/entities/study'
import { getAllSchedules } from '@/entities/schedule'
import type { Schedule } from '@/entities/schedule'

import {
  createTotalStudy,
  modifyTotalStudy,
} from '../../api/createTotalStudy'

import { ScheduleDropdown } from './ScheduleDropdown/ScheduleDropdown'
import type { ScheduleOption } from './ScheduleDropdown/ScheduleDropdown'
import * as S from './MentorTotalStudyModal.style'

interface MentorTotalStudyModalProps {
  isOpen: boolean
  onClose: () => void
  year: number
  month: number
  weekNumber: number
  totalStudy?: StudyResponse
  onGenerated?: (totalStudy: StudyResponse) => void
}

const formatScheduleDate = (date: string) => {
  const parsedDate = new Date(date)
  return `${parsedDate.getMonth() + 1}월 ${parsedDate.getDate()}일`
}

const toScheduleOption = (schedule: Schedule): ScheduleOption => {
  const startDate = formatScheduleDate(schedule.startDate)
  const endDate = formatScheduleDate(schedule.endDate)

  return {
    id: schedule.scheduleId,
    title: schedule.title,
    date: startDate === endDate ? startDate : `${startDate} ~ ${endDate}`,
  }
}

const isInMonth = (schedule: Schedule, year: number, month: number) => {
  const monthStart = new Date(year, month - 1, 1)
  const nextMonthStart = new Date(year, month, 1)

  return (
    new Date(schedule.startDate) < nextMonthStart &&
    new Date(schedule.endDate) >= monthStart
  )
}

export function MentorTotalStudyModal({
  isOpen,
  onClose,
  year,
  month,
  weekNumber,
  totalStudy,
  onGenerated,
}: MentorTotalStudyModalProps) {
  const [schedules, setSchedules] = useState<ScheduleOption[]>([])
  const [selectedScheduleIds, setSelectedScheduleIds] = useState<number[]>(
    totalStudy?.scheduleIds ?? [],
  )
  const [isGenerated, setIsGenerated] = useState(totalStudy !== undefined)
  const [isGenerating, setIsGenerating] = useState(false)
  const [content, setContent] = useState(totalStudy?.activityContent ?? '')

  useEffect(() => {
    if (!isOpen) return

    let isCancelled = false

    getAllSchedules()
      .then((allSchedules) => {
        if (!isCancelled) {
          setSchedules(
            allSchedules
              .filter((schedule) => isInMonth(schedule, year, month))
              .map(toScheduleOption),
          )
        }
      })
      .catch((error) => {
        console.error('일정을 불러오지 못했습니다.', error)
      })

    return () => {
      isCancelled = true
    }
  }, [isOpen, month, year])

  if (!isOpen) return null

  const handleClose = () => {
    setIsGenerated(false)
    setSelectedScheduleIds([])
    setContent('')
    onClose()
  }

  const handleGenerate = async () => {
    setIsGenerating(true)

    try {
      const totalStudy = await createTotalStudy({
        scheduleIds: selectedScheduleIds,
        year,
        month,
        weekNumber,
      })

      setContent(totalStudy.activityContent)
      setIsGenerated(true)
      onGenerated?.(totalStudy)
    } catch (error) {
      console.error('종합 학습일지를 생성하지 못했습니다.', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleRegenerate = async () => {
    if (!totalStudy) return

    setIsGenerating(true)

    try {
      const regeneratedStudy = await modifyTotalStudy(totalStudy.clubReportId)
      setContent(regeneratedStudy.activityContent)
      setSelectedScheduleIds(regeneratedStudy.scheduleIds)
      onGenerated?.(regeneratedStudy)
    } catch (error) {
      console.error('종합 학습일지를 재생성하지 못했습니다.', error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <S.Backdrop>
      {isGenerated ? (
        <S.GeneratedModal>
          <S.Title>{month}월 {weekNumber}주차 종합 학습일지</S.Title>
          <S.GeneratedContent>
            <S.GeneratedFormRow>
              <S.Label>관련 일정</S.Label>
              <ScheduleDropdown
                options={schedules}
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
            <S.SubmitButton
              type="button"
              disabled={isGenerating || !totalStudy}
              onClick={() => void handleRegenerate()}
            >
              {isGenerating ? '생성 중...' : '재생성'}
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
            {month}월 {weekNumber}주차 종합 학습일지 생성
          </S.Title>
          <S.FormRow>
            <S.Label>관련 일정</S.Label>
            <ScheduleDropdown
              options={schedules}
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
              disabled={isGenerating || selectedScheduleIds.length === 0}
              onClick={() => void handleGenerate()}
            >
              {isGenerating ? '생성 중...' : '생성'}
            </S.SubmitButton>
          </S.ButtonContainer>
        </S.Modal>
      )}
    </S.Backdrop>
  )
}
