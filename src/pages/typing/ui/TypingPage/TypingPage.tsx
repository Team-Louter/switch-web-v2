import { tokens } from "@/shared/styles";
import * as S from "./TypingPage.style"

import { FaBullseye, FaRankingStar, FaTrophy } from "react-icons/fa6";
import { IoSettingsOutline } from "react-icons/io5";
import { LuClock3, LuTimer } from "react-icons/lu";
import { SummaryCard } from "../SummaryCard/SummaryCard";
import { TopItem } from "../TopItem/TopItem";
import firstMedal from "@/shared/assets/1st.svg";
import secondMedal from "@/shared/assets/2nd.svg";
import thirdMedal from "@/shared/assets/3rd.svg";
import { ModeButton } from "../ModeButton/ModeButton";
import { TYPING_MODES } from "../../model/typingModes";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TypingSentenceModal, type TypingSentenceModalType } from "@/features/typing";
import {
  getPreviousResult,
  getRankingList,
  type Ranking,
  type RankingList,
  type TypingProblem,
  type TypingResult,
} from "@/entities/typing";

const MEDALS: Partial<Record<Ranking['rank'], string>> = {
  1: firstMedal,
  2: secondMedal,
  3: thirdMedal,
};

const formatElapsedTime = (elapsedTime: number) => {
  const minutes = Math.floor(elapsedTime / 60).toString().padStart(2, '0');
  const seconds = (elapsedTime % 60).toString().padStart(2, '0');

  return `${minutes}:${seconds}`;
};

export function TypingPage() {
  const navigate = useNavigate();
  const [selectedMode, setSelectedMode] = useState<string>("DAILY");
  const [sentenceModal, setSentenceModal] = useState<TypingSentenceModalType>(null);
  const [editingSentence, setEditingSentence] = useState<TypingProblem | null>(null);
  const [rankings, setRankings] = useState<RankingList | null>(null);
  const topFiveRankings = rankings?.topRankings.slice(0, 5) ?? [];
  const medalRankings = topFiveRankings.filter(({ rank }) => MEDALS[rank]);
  const remainingRankings = topFiveRankings.filter(({ rank }) => !MEDALS[rank]).slice(0, 2);
  const emptyRankingCount = 2 - remainingRankings.length;
  const selectedModeName = TYPING_MODES.find(
    (mode) => mode.serverValue === selectedMode,
  )?.mode;
  const [previousResult, setPreviousResult] = useState<TypingResult>({
    resultId: 0,
    accuracy: 0,
    elapsedTime: 0,
    averageSpeed: 0,
    problemType: 'DAILY',
    rank: 0,
    totalPracticeCount: 0
  });

  const handleStart = () => {
    if (selectedMode === "DAILY") {
      navigate("/typing/daily");
      return;
    }

    navigate(`/typing/code/${selectedMode.toLowerCase()}`);
  };

  const handleOpenEditor = () => {
    setEditingSentence(null);
    setSentenceModal('editor');
  };

  const handleEditSentence = (item: NonNullable<typeof editingSentence>) => {
    setEditingSentence(item);
    setSentenceModal('editor');
  };

  const handleDeleteSentence = (item: NonNullable<typeof editingSentence>) => {
    setEditingSentence(item);
    setSentenceModal('delete');
  };

  useEffect(() => {
    const getPrevious = async () => {
      const data = await getPreviousResult();
      setPreviousResult(data);
    }

    void getPrevious();
  }, [])

  useEffect(() => {
    const getRankings = async () => {
      const data = await getRankingList(selectedMode);
      setRankings(data);
    }

    void getRankings();
  }, [selectedMode])

  return (
    <S.TypingContainer>
      <S.PageContainer>
        <S.Column>
          <S.TitleContainer>
            <S.Title>타자 연습</S.Title>
            <S.Description>타자 실력을 길러요!</S.Description>
            <S.SettingsButton aria-label="문장 설정" type="button" onClick={() => setSentenceModal(sentenceModal === 'settings' ? null : 'settings')}>
              <IoSettingsOutline color={tokens.colors.gray.gray50} size={30}/>
            </S.SettingsButton>
          </S.TitleContainer>
          <S.SummaryContainer>
            <SummaryCard
              icon={<FaTrophy color={tokens.colors.primary.primary50} size={36} />}
              label="이전 타수"
              value={previousResult.averageSpeed}
              unit="타"
            />
            <SummaryCard
              icon={<FaBullseye color="#F0310B" size={36} />}
              label="이전 정확도"
              value={previousResult.accuracy}
              unit="%"
            />
            <SummaryCard
              icon={<LuClock3 color="#0E90F2" size={38} />}
              label="이전 소요 시간"
              value={formatElapsedTime(previousResult.elapsedTime)}
              unit=""
            />
            <SummaryCard
              icon={<FaRankingStar color="#29C54B" size={38} />}
              label="내 랭킹"
              value={previousResult.rank || '-'}
              unit="등"
            />
            <SummaryCard
              icon={<LuTimer color="#898989" size={40} />}
              label="총 훈련 횟수"
              value={previousResult.totalPracticeCount}
              unit="회"
            />
          </S.SummaryContainer>
          <S.RankingContainer>
            <S.RankingTitle>{selectedModeName} 현재 순위</S.RankingTitle>
            <S.Top>
              {medalRankings.map(({ userId, rank, userName, averageSpeed }) => (
                <TopItem key={userId} medal={MEDALS[rank]!} name={userName} value={averageSpeed.toString()} />
              ))}
            </S.Top>
            <S.RankingList>
              {remainingRankings.map(({ userId, rank, userName, averageSpeed }) => (
                <S.RankingItem key={userId}>
                  <S.Rank>{rank}</S.Rank>
                  <S.RankName>{userName}</S.RankName>
                  <S.RankValue>{averageSpeed}타</S.RankValue>
                </S.RankingItem>
              ))}
              {Array.from({ length: emptyRankingCount }, (_, index) => (
                <S.RankingItem key={`empty-ranking-${index}`}>
                  <S.Rank>-</S.Rank>
                  <S.RankName>-</S.RankName>
                  <S.RankValue>-</S.RankValue>
                </S.RankingItem>
              ))}
              <S.RankingItem style={{ borderColor: tokens.colors.primary.primary50}}>
                <S.Rank>{rankings?.myRanking?.rank ?? '-'}</S.Rank>
                <S.RankName>{rankings?.myRanking?.userName ?? '-'}</S.RankName>
                <S.RankValue>{rankings?.myRanking ? `${rankings.myRanking.averageSpeed}타` : '-'}</S.RankValue>
              </S.RankingItem>
            </S.RankingList>
          </S.RankingContainer>
          <S.ModeContainer>
            {TYPING_MODES.map((mode) => {
              return (
                <ModeButton 
                  key={mode.mode} 
                  mode={mode.mode} 
                  description={mode.description} 
                  Icon={mode.icon} 
                  serverValue={mode.serverValue} 
                  selected={selectedMode === mode.serverValue} 
                  setSelected={setSelectedMode}
                />
              )
            })}
          </S.ModeContainer>
          <S.StartButton type="button" onClick={handleStart}>
            시작하기
          </S.StartButton>
        </S.Column>
      </S.PageContainer>
      <TypingSentenceModal
        editingItem={editingSentence}
        modalType={sentenceModal}
        onBackToSettings={() => setSentenceModal('settings')}
        onClose={() => setSentenceModal(null)}
        onDelete={handleDeleteSentence}
        onEdit={handleEditSentence}
        onOpenEditor={handleOpenEditor}
      />
    </S.TypingContainer>
  )
}
