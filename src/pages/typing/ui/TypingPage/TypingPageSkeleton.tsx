import * as Summary from '../SummaryCard/SummaryCard.style'
import * as Top from '../TopItem/TopItem.style'
import * as Page from './TypingPage.style'
import * as S from './TypingPageSkeleton.style'

export function TypingSummarySkeleton() {
  return Array.from({ length: 5 }, (_, index) => (
    <Summary.Card key={index} aria-hidden="true">
      <Summary.IconContainer>
        <S.Placeholder $width="36px" $height="36px" />
      </Summary.IconContainer>
      <Summary.Column>
        <S.Lines>
          <S.Placeholder $width="72px" $height="16px" />
          <S.Placeholder $width="48px" $height="24px" />
        </S.Lines>
      </Summary.Column>
    </Summary.Card>
  ))
}

export function TypingRankingSkeleton() {
  return (
    <>
      <Page.Top aria-hidden="true">
        {Array.from({ length: 3 }, (_, index) => (
          <Top.Card key={index}>
            <S.Medal $width="60px" $height="60px" />
            <Top.Column>
              <S.Lines>
                <S.Placeholder $width="72px" $height="24px" />
                <S.Placeholder $width="48px" $height="20px" />
              </S.Lines>
            </Top.Column>
          </Top.Card>
        ))}
      </Page.Top>
      <Page.RankingList aria-hidden="true">
        {Array.from({ length: 3 }, (_, index) => (
          <Page.RankingItem key={index}>
            <S.Placeholder $width="16px" $height="20px" />
            <S.Placeholder $width="88px" $height="20px" />
            <S.RankingValue $width="48px" $height="18px" />
          </Page.RankingItem>
        ))}
      </Page.RankingList>
    </>
  )
}

export function TypingPageSkeleton() {
  return (
    <Page.TypingContainer role="status" aria-label="타자연습 화면을 불러오는 중입니다." aria-busy="true">
      <Page.PageContainer aria-hidden="true">
        <Page.Column>
          <Page.TitleContainer>
            <Page.Title>타자 연습</Page.Title>
            <Page.Description>타자 실력을 길러요!</Page.Description>
          </Page.TitleContainer>
          <Page.SummaryContainer>
            <TypingSummarySkeleton />
          </Page.SummaryContainer>
          <Page.RankingContainer>
            <Page.RankingTitle>일상 영어 현재 순위</Page.RankingTitle>
            <TypingRankingSkeleton />
          </Page.RankingContainer>
          <Page.ModeContainer>
            {Array.from({ length: 3 }, (_, index) => (
              <S.Mode key={index}>
                <S.Lines>
                  <S.Placeholder $width="80px" $height="24px" />
                  <S.Placeholder $width="140px" $height="18px" />
                </S.Lines>
              </S.Mode>
            ))}
          </Page.ModeContainer>
          <Page.StartButton disabled>시작하기</Page.StartButton>
        </Page.Column>
      </Page.PageContainer>
    </Page.TypingContainer>
  )
}
