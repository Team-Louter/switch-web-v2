import { CalendarArea, PageContainer } from './HomePage.style'
import * as S from './HomePageSkeleton.style'

export function HomePageSkeleton() {
  return (
    <PageContainer role="status" aria-label="홈을 불러오는 중입니다.">
      <S.Layout aria-hidden="true">
        <CalendarArea>
          <S.Calendar>
            <S.MonthTitle />
            <S.MonthGrid />
          </S.Calendar>
        </CalendarArea>
        <S.Cards>
          <S.Card>
            <S.Profile>
              <S.Avatar />
              <S.Line $width="120px" />
            </S.Profile>
            <S.Line $width="70%" />
          </S.Card>
          <S.Card>
            <S.Line $width="88px" />
            <S.Line $width="90%" />
            <S.Line $width="75%" />
            <S.Line $width="55%" />
          </S.Card>
        </S.Cards>
      </S.Layout>
    </PageContainer>
  )
}
