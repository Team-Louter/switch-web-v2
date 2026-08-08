import { tokens } from "@/shared/styles";
import * as S from "./TypingPage.style"

import { FaBullseye, FaRankingStar, FaTrophy } from "react-icons/fa6";
import { IoSettingsOutline } from "react-icons/io5";
import { LuClock3, LuTimer } from "react-icons/lu";
import { SummaryCard } from "./SummaryCard/SummaryCard";
import { TopItem } from "./TopItem/TopItem";
import firstMedal from "@/shared/assets/1st.svg";
import secondMedal from "@/shared/assets/2nd.svg";
import thirdMedal from "@/shared/assets/3rd.svg";
import { ModeButton } from "./ModeButton/ModeButton";
import { TYPING_MODES } from "@/shared/constants/typing";
import { useState } from "react";

export function TypingPage() {
  const [selectedMode, setSelectedMode] = useState<string>("DAILY");
  const selectedModeName = TYPING_MODES.find(
    (mode) => mode.serverValue === selectedMode,
  )?.mode;

  return (
    <S.TypingContainer>
      <S.PageContainer>
        <S.Column>
          <S.TitleContainer>
            <S.Title>타자 연습</S.Title>
            <S.Description>타자 실력을 길러요!</S.Description>
            <IoSettingsOutline color={tokens.colors.gray.gray50} style={{ marginLeft: 'auto', cursor: 'pointer' }} size={30}/>
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
          <S.StartButton>시작하기</S.StartButton>
        </S.Column>
      </S.PageContainer>
    </S.TypingContainer>
  )
}
