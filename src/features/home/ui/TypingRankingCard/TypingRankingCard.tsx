import type { TypingProblemType, TypingRanking } from '@/entities/typing'

import medal1stIcon from '../../assets/medal-1st.svg'
import medal2ndIcon from '../../assets/medal-2nd.svg'
import medal3rdIcon from '../../assets/medal-3rd.svg'
import { TYPING_RANKING_TABS } from '../../lib/typingRankingTab'
import { HomeCard } from '../HomeCard'
import * as S from './TypingRankingCard.style'

const MEDAL_ICONS: Record<number, string> = {
  1: medal1stIcon,
  2: medal2ndIcon,
  3: medal3rdIcon,
}

interface TypingRankingCardProps {
  rankings: TypingRanking[]
  selectedType: TypingProblemType
  onTypeChange: (problemType: TypingProblemType) => void
}

export function TypingRankingCard({
  rankings,
  selectedType,
  onTypeChange,
}: TypingRankingCardProps) {
  return (
    <HomeCard
      title="타자 랭킹"
      actions={TYPING_RANKING_TABS.map(({ id, label }) => (
        <S.Tab
          key={id}
          type="button"
          $active={id === selectedType}
          onClick={() => onTypeChange(id)}
        >
          {label}
        </S.Tab>
      ))}
      isEmpty={rankings.length === 0}
      emptyText="랭킹이 없어요"
    >
      <S.List>
        {rankings.map(({ userId, rank, userName, averageSpeed }) => (
          <S.Item key={userId}>
            <S.Label>
              {/* 1~3위만 메달을 보여주고 나머지는 등수를 숫자로 보여준다. */}
              {MEDAL_ICONS[rank] ? (
                <S.MedalIcon src={MEDAL_ICONS[rank]} alt={`${rank}위`} />
              ) : (
                <S.RankText>{rank}</S.RankText>
              )}
              <S.UserName>{userName}</S.UserName>
            </S.Label>
            <S.Speed>{Math.round(averageSpeed)}타</S.Speed>
          </S.Item>
        ))}
      </S.List>
    </HomeCard>
  )
}
