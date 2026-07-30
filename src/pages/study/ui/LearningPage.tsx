import { useState } from 'react'
import { WriteModal } from '@/features/study'

import * as S from './LearningPage.style.ts'
import { MonthlyJournalWeeks } from './MonthlyStudyWeeks/MonthlyJournalWeeks.tsx'
import { PercentageBar } from './PercentageBar/PercentageBar.tsx'
import decoImg1 from '../assets/deco1.svg'
import decoImg2 from '../assets/spring.svg'
import {
  getCurrentMonth,
  getMonthsFromCurrentMonth,
  getMonthState,
} from '../lib/getMonthsFromCurrentMonth.ts'

export function LearningPage() {
  const submitRate = 0
  const currentMonth = getCurrentMonth()
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false)

  return (
    <S.PageContainer>
      <S.ScrollArea>
        {getMonthsFromCurrentMonth().map((month) => {
          const monthState = getMonthState(month, currentMonth)

          return (
          <S.Column key={month} $state={monthState}>
            <S.MonthRow>
              <S.Month>{month}월</S.Month>
              {monthState === 'current' && <S.Now>Now</S.Now>}
            </S.MonthRow>
            <S.Card $state={monthState}>
              <S.ProgressContent>
                <S.SubmitLabel>제출</S.SubmitLabel>
                <S.SubmitRate>{submitRate}%</S.SubmitRate>
                <PercentageBar value={submitRate} label="과제 제출률" />
                <S.Status>진행중</S.Status>
              </S.ProgressContent>
              <S.DiaryContent>
                <MonthlyJournalWeeks
                  weeks={[
                    { week: 1, status: 'submitted' },
                    { week: 2, status: 'overdue' },
                    { week: 3, status: 'due' },
                    { week: 4, status: 'locked' },
                    { week: 5, status: 'locked' },
                  ]}
                />
                <S.DecoImg src={decoImg1} alt="" />
                <S.ButtonContent>
                  <S.Name>2213 최현수</S.Name>
                  <S.Week>3주차 학습일지</S.Week>
                  <S.WriteButton
                    type="button"
                    disabled={monthState === 'future'}
                    onClick={() => setIsWriteModalOpen(true)}
                  >
                    작성하기
                  </S.WriteButton>
                </S.ButtonContent>
              </S.DiaryContent>
              <S.DecoImg2 src={decoImg2} alt="" />
            </S.Card>
          </S.Column>
          )
        })}
      </S.ScrollArea>
      <WriteModal
        isOpen={isWriteModalOpen}
        onClose={() => setIsWriteModalOpen(false)}
      />
    </S.PageContainer>
  )
}
