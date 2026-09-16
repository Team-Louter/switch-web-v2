import styled from 'styled-components'

import * as token from '@/shared/styles/values/token'

export const Page = styled.section`
  box-sizing: border-box;
  width: 100%;
  min-height: 100dvh;
  padding: clamp(20px, 2vw, 30px) clamp(20px, 2vw, 30px)
    clamp(20px, 2vw, 30px) 0;
  overflow-y: auto;
  background: ${token.colors.white};
`

export const Container = styled.div`
  display: grid;
  grid-template-columns: minmax(260px, 320px) minmax(0, 1fr);
  gap: 20px;
  width: 100%;
  height: calc(100dvh - clamp(40px, 4vw, 60px));
  min-height: 640px;
  margin: 0 auto;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    height: auto;
    min-height: 0;
  }
`

export const LeftArea = styled.div`
  ${token.flexColumn}
  box-sizing: border-box;
  min-width: 0;
  min-height: 0;
  gap: 0;
  padding: 0;
  overflow: hidden;
  border: 1px solid ${token.colors.gray.gray10};
  border-radius: ${token.shapes.xlarge};
  background: ${token.colors.gray.gray0};
  ${token.elevation('black_1')}

  @media (max-width: 900px) {
    min-height: 560px;
  }
`

const ListContainer = styled.section`
  ${token.flexColumnStart}
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  min-height: 0;
  gap: 12px;
  padding: 20px 16px;
  overflow: hidden;
`

export const RoomContainer = styled(ListContainer)`
  flex: 1 1 0;
`

export const QuestionContainer = styled(ListContainer)`
  flex: 1 1 0;
  border-top: 1px solid ${token.colors.gray.gray10};

  @media (max-width: 900px) {
    min-height: 300px;
  }
`

export const SectionHeader = styled.div`
  ${token.flexBetween}
  width: 100%;
  min-height: 32px;
  flex-shrink: 0;
`

export const SectionHeading = styled.div`
  ${token.flexRow}
  align-items: center;
  gap: 7px;
  min-width: 0;
`

export const SectionTitle = styled.h2`
  margin: 0;
  color: ${token.colors.gray.gray90};
  line-height: 1;
  ${token.typography('body', 'md', 'semibold')}
`

export const SectionCount = styled.span`
  ${token.flexCenter}
  min-width: 22px;
  height: 22px;
  padding: 0 7px;
  border-radius: ${token.shapes.circle};
  background: ${token.colors.white};
  color: ${token.colors.gray.gray50};
  line-height: 1;
  ${token.typography('caption', 'md', 'semibold')}
`

export const AddButton = styled.button`
  ${token.flexCenter}
  box-sizing: border-box;
  height: 32px;
  gap: 5px;
  padding: 0 10px;
  border: 0;
  border-radius: ${token.shapes.small};
  background: ${token.colors.gray.gray90};
  color: ${token.colors.white};
  cursor: pointer;
  ${token.typography('caption', 'lg', 'semibold')}

  svg {
    width: 16px;
    height: 16px;
  }

  &:hover,
  &:focus-visible {
    background: ${token.colors.gray.gray100};
  }

  &:focus-visible {
    outline: 2px solid ${token.colors.primary.primary30};
    outline-offset: 2px;
  }
`

export const ListScroll = styled.div`
  width: 100%;
  min-height: 0;
  flex: 1 1 0;
  overflow-y: auto;
  overscroll-behavior: contain;
  scrollbar-color: ${token.colors.gray.gray30} transparent;
  scrollbar-width: thin;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    border: 2px solid transparent;
    border-radius: ${token.shapes.circle};
    background: ${token.colors.gray.gray30};
    background-clip: padding-box;
  }
`

export const RightContainer = styled.section`
  ${token.flexColumn}
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  min-height: 0;
  gap: 16px;
  padding: 20px 24px 24px;
  overflow: hidden;
  border: 1px solid ${token.colors.gray.gray10};
  border-radius: ${token.shapes.xlarge};
  background: ${token.colors.white};
  ${token.elevation('black_1')}

  @media (max-width: 900px) {
    min-height: 620px;
  }
`

export const TopActionRow = styled.div`
  ${token.flexBetween}
  flex: 0 0 auto;
  width: 100%;
  min-height: 40px;
  gap: 12px;
`

export const EndContainer = styled.div`
  ${token.flexCenter}
  min-width: 0;
  flex: 1 1 auto;
`

export const EndWrap = styled.div`
  ${token.flexRow}
  align-items: center;
  max-width: 100%;
  gap: 10px;
  padding: 8px 14px;
  border: 1px solid ${token.colors.gray.gray10};
  border-radius: ${token.shapes.medium};
  background: ${token.colors.gray.gray0};
  color: ${token.colors.gray.gray60};
  white-space: nowrap;
  ${token.typography('body', 'sm', 'medium')}

  @media (max-width: 600px) {
    white-space: normal;
  }
`

export const EndButton = styled.button`
  flex-shrink: 0;
  padding: 7px 12px;
  border: 0;
  border-radius: ${token.shapes.xsmall};
  background: ${token.colors.gray.gray90};
  color: ${token.colors.white};
  white-space: nowrap;
  cursor: pointer;
  ${token.typography('body', 'sm', 'semibold')}

  &:hover {
    background: ${token.colors.gray.gray100};
  }

  &:disabled {
    background: ${token.colors.gray.gray30};
    cursor: not-allowed;
  }
`

export const DetailWrapper = styled.div`
  ${token.flexColumn}
  width: 100%;
  min-height: 0;
  flex: 1 1 0;
  overflow: hidden;
`

export const DetailEmpty = styled.div`
  ${token.flexCenter}
  flex: 1 1 0;
  width: 100%;
  min-height: 180px;
  color: ${token.colors.gray.gray50};
  text-align: center;
  ${token.typography('body', 'sm', 'medium')}
`
