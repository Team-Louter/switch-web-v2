import styled from "styled-components";

import { Container } from '@/pages/temp-page.style'
import * as token from '@/shared/styles/values/token'

export const TypingContainer = styled(Container)`
  height: 100dvh;
`

export const PageContainer = styled.section`
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: ${token.colors.white};
  display: flex;
`

export const Column = styled.div`
  ${token.flexColumn};
  flex: 1;
  min-width: 0;
  min-height: 0;
  gap: 20px;
`;

export const TitleContainer = styled.div`
  ${token.flexRow};
  align-items: center;
`;

export const Title = styled.h1`
  ${token.typography('heading', 'lg', 'semibold')};
`;

export const Description = styled.p`
  ${token.typography('body', 'lg', 'medium')};
  color: ${token.colors.gray.gray50};
  margin-left: 16px;
`; 

export const SettingsButton = styled.button`
  ${token.flexCenter};
  width: 30px;
  height: 30px;
  margin-left: auto;
  cursor: pointer;
`;

export const SummaryContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 16px;
  background-color: ${token.colors.primary.primary0};
  padding: 16px;
  border-radius: ${token.shapes.medium};
`;

export const RankingContainer = styled.div`
  border: 1px solid ${token.colors.gray.gray20};
  border-radius: ${token.shapes.medium};
  width: 100%;
  height: 60%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px 50px;
  justify-content: space-between;
`;

export const RankingTitle = styled.h2`
  ${token.typography('heading', 'sm', 'medium')};
`;

export const Top = styled.div`
  display: flex;
  gap: 80px;
  width: 100%;
  justify-content: center;
`;

export const RankingList = styled.div`
  width: 100%;
  height: 50%;
  ${token.flexColumnCenter};
  gap: 10px;
`

export const RankingItem = styled.div`
  ${token.flexRow};
  align-items: center;
  gap: 20px;
  flex: 1;
  min-height: 0;
  padding: 0 3%;
  border: 1px solid ${token.colors.gray.gray10};
  border-radius: ${token.shapes.large};
  width: 100%;
`;

export const Rank = styled.span`
  ${token.typography('body', 'md', 'medium')};
  color: ${token.colors.primary.primary50};
`;

export const RankName = styled.span`
  ${token.typography('body', 'md', 'medium')};
`;

export const RankValue = styled.span`
  ${token.typography('body', 'sm', 'medium')};
  color: ${token.colors.gray.gray50};
  margin-left: auto;
`;

export const ModeContainer = styled.div`
  width: 100%;
  height: 15%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
`;

export const StartButton = styled.button`
  width: 100%;
  height: 50px;
  background-color: ${token.colors.primary.primary50};
  color: ${token.colors.gray.gray100};
  border-radius: ${token.shapes.small};
  ${token.typography('body', 'lg', 'medium')};
  cursor: pointer;

  &:hover {
    background-color: ${token.colors.primary.primary60};
  }
`;
