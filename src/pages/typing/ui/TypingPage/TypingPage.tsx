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
import { TYPING_MODES } from "@/shared/constants/typing";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TypingSentenceModal, type TypingSentenceModalType } from "./TypingSentenceModal";

export function TypingPage() {
  const navigate = useNavigate();
  const [selectedMode, setSelectedMode] = useState<string>("DAILY");
  const [sentenceModal, setSentenceModal] = useState<TypingSentenceModalType>(null);
  const [editingSentence, setEditingSentence] = useState<{
    category: 'DAILY' | 'CODE'
    label: string
    sentence: string
  } | null>(null);
  const selectedModeName = TYPING_MODES.find(
    (mode) => mode.serverValue === selectedMode,
  )?.mode;

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
              value="350"
              unit="타"
            />
            <SummaryCard
              icon={<FaBullseye color="#F0310B" size={36} />}
              label="이전 정확도"
              value="96"
              unit="%"
            />
            <SummaryCard
              icon={<LuClock3 color="#0E90F2" size={38} />}
              label="이전 소요 시간"
              value="1:30"
              unit=""
            />
            <SummaryCard
              icon={<FaRankingStar color="#29C54B" size={38} />}
              label="내 랭킹"
              value="16"
              unit="등"
            />
            <SummaryCard
              icon={<LuTimer color="#898989" size={40} />}
              label="총 훈련 횟수"
              value="3"
              unit="회"
            />
          </S.SummaryContainer>
          <S.RankingContainer>
            <S.RankingTitle>{selectedModeName} 현재 순위</S.RankingTitle>
            <S.Top>
              <TopItem medal={secondMedal} name="전수안" value="300"/>
              <TopItem medal={firstMedal} name="전수안" value="300"/>
              <TopItem medal={thirdMedal} name="전수안" value="300"/>
            </S.Top>
            <S.RankingList>
              <S.RankingItem>
                <S.Rank>4</S.Rank>
                <S.RankName>전수안</S.RankName>
                <S.RankValue>300타</S.RankValue>
              </S.RankingItem>
              <S.RankingItem style={{ width: '98%'}}>
                <S.Rank>5</S.Rank>
                <S.RankName>전수안</S.RankName>
                <S.RankValue>300타</S.RankValue>
              </S.RankingItem>
              <S.RankingItem style={{ borderColor: tokens.colors.primary.primary50}}>
                <S.Rank>39</S.Rank>
                <S.RankName>전수안</S.RankName>
                <S.RankValue>300타</S.RankValue>
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
