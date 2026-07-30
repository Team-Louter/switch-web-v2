import { CLUB_MEMBER } from '@/shared/constants/clubMember'

import * as S from './LearningPage.style'
import { MonthlyStudyWeeks } from './MonthlyStudyWeeks/MonthlyJournalWeeks'
import { PercentageBar } from './PercentageBar/PercentageBar'
import decoImg1 from '../assets/deco1.svg'
import decoImg2 from '../assets/spring.svg'
import { getWeeksForCurrentYear } from '../lib/getWeeksForCurrentYear'

export function MentorLearningPage() {
  const submitRate = 40

  return (
    <S.PageContainer>
      <S.ScrollArea>
        {getWeeksForCurrentYear().map(
          ({ id, month, weekNumber, state }) => (
            <S.Column key={id} $state={state}>
              <S.MonthRow>
                <S.Month>
                  {month}월 {weekNumber}주차
                </S.Month>
                {state === 'current' && <S.Now>Now</S.Now>}
              </S.MonthRow>
              <S.Card $state={state}>
                <S.ProgressContent>
                  <S.SubmitLabel>멘티 제출</S.SubmitLabel>
                  <S.SubmitRate>{submitRate}%</S.SubmitRate>
                  <PercentageBar value={submitRate} label="멘티 과제 제출률" />
                  <S.Status>멘티 학습 현황</S.Status>
                </S.ProgressContent>
                <S.DiaryContent>
                  <MonthlyStudyWeeks
                    items={CLUB_MEMBER.map((name, index) => ({
                      id: name,
                      label: name,
                      status:
                        index === 6
                          ? 'overdue'
                          : index === 7
                            ? 'due'
                            : 'submitted',
                    }))}
                  />
                  <S.DecoImg src={decoImg1} alt="" />
                  <S.ButtonContent>
                    <S.Name>2213 최현수 멘티</S.Name>
                    <S.Week>3주차 학습일지</S.Week>
                    <S.WriteButton
                      type="button"
                      disabled={state === 'future'}
                    >
                      확인하기
                    </S.WriteButton>
                  </S.ButtonContent>
                </S.DiaryContent>
                <S.DecoImg2 src={decoImg2} alt="" />
              </S.Card>
            </S.Column>
          ),
        )}
      </S.ScrollArea>
    </S.PageContainer>
  )
}
