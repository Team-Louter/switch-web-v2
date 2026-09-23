import { PiArrowLeft } from 'react-icons/pi'

import {
  BackButton,
  DetailHeader,
  DetailMetric,
  DetailMetrics,
  Header,
  HeaderCopy,
  MentorCell,
  MentorInfo,
  Table,
  TableHeader,
  Toolbar,
  ToolbarLeft,
} from './MentoringPage.style'
import * as S from './MentoringPageSkeleton.style'

interface MentoringMentorDetailSkeletonProps {
  onBack: () => void
}

interface MentoringOverviewCardsSkeletonProps {
  'aria-busy'?: boolean
}

interface MentoringTableRowsSkeletonProps {
  columns: 'mentor' | 'question'
  rowCount?: number
}

export function MentoringDashboardSkeleton() {
  return (
    <S.PageSkeleton role="status" aria-label="멘토링 대시보드를 불러오는 중입니다.">
      <S.DashboardSkeletonHeader aria-hidden="true">
        <S.SkeletonBlock $width="86px" $height="20px" />
        <S.SkeletonBlock $width="180px" $height="38px" />
      </S.DashboardSkeletonHeader>
      <MentoringOverviewCardsSkeleton />
      <DashboardTableSkeleton />
    </S.PageSkeleton>
  )
}

export function MentoringOverviewCardsSkeleton({
  'aria-busy': ariaBusy,
}: MentoringOverviewCardsSkeletonProps = {}) {
  return (
    <S.OverviewSkeletonGrid
      aria-busy={ariaBusy}
      aria-hidden={ariaBusy ? undefined : true}
      role={ariaBusy ? 'status' : undefined}
      aria-label={ariaBusy ? '멘토링 통계를 불러오는 중입니다.' : undefined}
    >
      {[3, 4].map((legendCount, cardIndex) => (
        <S.OverviewSkeletonCard key={cardIndex}>
          <S.OverviewSkeletonTitle $width={cardIndex === 0 ? '116px' : '126px'} />
          <S.OverviewSkeletonContent>
            <S.OverviewSkeletonDonut />
            <S.OverviewSkeletonLegend>
              {Array.from({ length: legendCount }, (_, index) => (
                <S.OverviewSkeletonLegendRow key={index}>
                  <S.SkeletonBlock $width="48%" $height="12px" />
                  <S.SkeletonBlock $width="56px" $height="12px" />
                </S.OverviewSkeletonLegendRow>
              ))}
            </S.OverviewSkeletonLegend>
          </S.OverviewSkeletonContent>
        </S.OverviewSkeletonCard>
      ))}
    </S.OverviewSkeletonGrid>
  )
}

export function MentoringMentorDetailSkeleton({
  onBack,
}: MentoringMentorDetailSkeletonProps) {
  return (
    <S.DetailPageSkeleton role="status" aria-label="멘토 상세를 불러오는 중입니다.">
      <Header>
        <BackButton type="button" aria-label="멘토링 목록으로 돌아가기" onClick={onBack}>
          <PiArrowLeft aria-hidden="true" />
        </BackButton>
        <HeaderCopy aria-hidden="true">
          <S.SkeletonBlock $width="68px" $height="12px" />
          <S.SkeletonBlock $width="188px" $height="30px" />
          <S.SkeletonBlock $width="276px" $height="15px" />
        </HeaderCopy>
      </Header>
      <DetailHeader aria-hidden="true">
        <MentorCell>
          <S.SkeletonAvatar $size="lg" />
          <MentorInfo>
            <S.SkeletonBlock $width="118px" $height="18px" />
            <S.SkeletonBlock $width="150px" $height="13px" />
          </MentorInfo>
        </MentorCell>
        <DetailMetrics>
          {[0, 1, 2, 3].map((item) => (
            <DetailMetric key={item}>
              <S.SkeletonBlock $width="58px" $height="13px" />
              <S.SkeletonBlock $width="48px" $height="18px" />
            </DetailMetric>
          ))}
        </DetailMetrics>
      </DetailHeader>
      <QuestionTableSkeleton />
    </S.DetailPageSkeleton>
  )
}

export function MentoringTableRowsSkeleton({
  columns,
  rowCount = 5,
}: MentoringTableRowsSkeletonProps) {
  return (
    <S.TableSkeletonRows aria-hidden="true">
      {Array.from({ length: rowCount }, (_, rowIndex) => (
        <S.TableSkeletonRow key={rowIndex} $columns={columns}>
          {columns === 'mentor' ? (
            <>
              <S.SkeletonIdentity>
                <S.SkeletonAvatar />
                <S.SkeletonIdentityLines>
                  <S.SkeletonBlock $width="72px" $height="14px" />
                  <S.SkeletonBlock $width="48px" $height="11px" />
                </S.SkeletonIdentityLines>
              </S.SkeletonIdentity>
              <S.SkeletonBlock $width={`${36 + (rowIndex % 3) * 8}px`} $height="13px" />
              <S.SkeletonBlock $width={`${32 + (rowIndex % 2) * 8}px`} $height="13px" />
              <S.SkeletonBlock $width="38px" $height="13px" />
              <S.SkeletonBlock $width="100%" $height="23px" $shape="pill" />
            </>
          ) : (
            <>
              <S.SkeletonBlock $width={`${52 + (rowIndex % 3) * 9}%`} $height="15px" />
              <S.SkeletonIdentity>
                <S.SkeletonAvatar $size="small" />
                <S.SkeletonBlock $width="72px" $height="13px" />
              </S.SkeletonIdentity>
              <S.SkeletonBlock $width="62px" $height="13px" />
              <S.SkeletonBlock $width="62px" $height="13px" />
              <S.SkeletonBlock $width="54px" $height="23px" $shape="pill" />
            </>
          )}
        </S.TableSkeletonRow>
      ))}
    </S.TableSkeletonRows>
  )
}

function DashboardTableSkeleton() {
  return (
    <Table aria-hidden="true">
      <Toolbar>
        <S.SkeletonBlock $width="42px" $height="20px" />
        <S.SkeletonSearch />
      </Toolbar>
      <TableHeader $columns="mentor">
        <span>멘토 정보</span>
        <span>전체 질문</span>
        <span>답변 대기</span>
        <span>최근 활동</span>
        <span>상태</span>
      </TableHeader>
      <MentoringTableRowsSkeleton columns="mentor" />
    </Table>
  )
}

function QuestionTableSkeleton() {
  return (
    <Table aria-hidden="true">
      <Toolbar>
        <ToolbarLeft>
          <S.SkeletonBlock $width="42px" $height="20px" />
          <S.SkeletonFilter $width="126px" />
        </ToolbarLeft>
        <S.SkeletonFilterGroup>
          {[36, 44, 44, 44].map((width, index) => (
            <S.SkeletonFilter key={index} $width={`${width}px`} />
          ))}
        </S.SkeletonFilterGroup>
        <S.SkeletonSearch />
      </Toolbar>
      <TableHeader $columns="question">
        <span>제목</span>
        <span>작성 멘티</span>
        <span>작성일</span>
        <span>마지막 답변일</span>
        <span>상태</span>
      </TableHeader>
      <MentoringTableRowsSkeleton columns="question" />
    </Table>
  )
}
