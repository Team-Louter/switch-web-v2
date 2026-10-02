import styled from "styled-components";

import * as token from '@/shared/styles/values/token'

export const TypingContainer = styled.section`
  ${token.flexCenter}
  box-sizing: border-box;
  min-height: 100dvh;
  padding: 48px;
  background: ${token.colors.white};
  height: 100dvh;

  @media (min-width: 769px) and (max-width: 1180px) {
    align-items: flex-start;
    height: auto;
    min-height: 100dvh;
    padding: 28px 24px 40px;
  }

  @media (max-width: 768px) {
    align-items: flex-start;
    height: auto;
    padding: 24px 16px 48px;
  }
`

export const PageContainer = styled.section`
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: ${token.colors.white};
  display: flex;

  @media (max-width: 768px) { height: auto; overflow: visible; }

  @media (min-width: 769px) and (max-width: 1180px) {
    height: auto;
    overflow: visible;
  }
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
  @media (max-width: 600px) { flex-wrap: wrap; gap: 8px 12px; }
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

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
  }

  @media (min-width: 769px) and (max-width: 1180px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 12px;
  }
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

  @media (min-width: 769px) and (max-width: 1180px) {
    height: auto;
    min-height: 460px;
    gap: 24px;
    padding: 28px 32px;
  }

  @media (max-width: 768px) {
    height: auto;
    gap: 24px;
    padding: 24px 16px;
  }
`;

export const RankingTitle = styled.h2`
  ${token.typography('heading', 'sm', 'medium')};
`;

export const Top = styled.div`
  display: flex;
  gap: 80px;
  width: 100%;
  justify-content: center;
  @media (max-width: 768px) {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    align-items: start;
    gap: 10px;
  }

  @media (min-width: 769px) and (max-width: 1180px) {
    gap: clamp(20px, 5vw, 52px);
  }
`;

export const RankingList = styled.div`
  width: 100%;
  height: 50%;
  ${token.flexColumnCenter};
  gap: 10px;
  @media (max-width: 768px) { height: auto; }
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
  @media (max-width: 768px) { min-height: 52px; flex: 0 0 auto; }
`;

export const Rank = styled.span`
  ${token.typography('body', 'md', 'medium')};
  color: ${token.colors.primary.primary50};
`;

export const RankName = styled.span`
  ${token.typography('body', 'md', 'medium')};
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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
  padding-block: 4px;
  @media (min-width: 601px) and (max-width: 1180px) { height: auto; gap: 14px; }
  @media (min-width: 601px) and (max-width: 1050px) { grid-template-columns: 1fr; }
  @media (max-width: 600px) { height: auto; grid-template-columns: 1fr; gap: 12px; padding-block: 8px; }
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
