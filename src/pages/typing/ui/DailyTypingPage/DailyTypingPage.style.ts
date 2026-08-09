import styled from 'styled-components'

import * as token from '@/shared/styles/values/token'

export const Page = styled.main`
  width: 100%;
  min-width: 1024px;
  height: 100dvh;
  padding: clamp(28px, 5.2vh, 50px);
  background: ${token.colors.white};
`

export const PracticeFrame = styled.section`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: clamp(30px, 3.5vh, 34px) clamp(34px, 4.85vw, 70px) 60px;
  border: 1px solid ${token.colors.gray.gray10};
  background: ${token.colors.white};
`

export const Workspace = styled.div`
  display: flex;
  flex: 1;
  min-height: 0;
  padding-top: clamp(52px, 6.4vh, 63px);
`

export const Paper = styled.div`
  position: relative;
  z-index: 0;
  flex: 1;
  min-height: 0;
  padding: clamp(78px, 9.5vh, 92px) clamp(82px, 10.8vw, 156px) 80px;
  border: 17px solid #d9d9d9;
  border-radius: 20px;
  background: ${token.colors.white};

  &::after {
    content: '';
    position: absolute;
    z-index: -1;
    right: 48px;
    bottom: -32px;
    left: 48px;
    height: 32px;
    background: #d9d9d9;
  }
`

export const SentenceRow = styled.div<{ $current?: boolean }>`
  display: grid;
  grid-template-columns: 132px minmax(0, 1fr);
  align-items: start;
  margin: ${({ $current }) => ($current ? 'clamp(64px, 8.5vh, 82px) 0' : '0')};
  font-size: ${({ $current }) => ($current ? '28px' : '22px')};
`

export const Label = styled.p<{ $current?: boolean }>`
  font-weight: ${token.fontWeight.semibold};
  font-size: ${({ $current }) => ($current ? '1.5rem' : '1.2rem')};
`

export const SentenceBlock = styled.div`
  min-width: 0;
`

export const Sentence = styled.p`
  color: #000;
  font-size: inherit;
  line-height: 1.35;
  white-space: nowrap;
`

export const TypedLine = styled.input`
  display: flex;
  align-items: center;
  min-height: 1.35em;
  color: ${token.colors.primary.primary50};
  font-size: inherit;
  line-height: 1.35;
  white-space: nowrap;
  outline: none;
  width: 100%;
  border: 0px solid black;
  width: 100%;
`

export const Caret = styled.span`
  width: 2px;
  height: 1em;
  margin-left: 4px;
  background: #717171;
`

export const Eraser = styled.div`
  position: absolute;
  bottom: -17px;
  left: 7.2%;
  width: 127px;
  height: 31px;
  background: ${token.colors.primary.primary40};
`

export const Podium = styled.div`
  position: absolute;
  right: 4.4%;
  bottom: -15px;
  width: 230px;
  height: 100px;

  i {
    position: absolute;
    width: 125px;
    height: 17px;
    border-radius: 50px;
  }
  i:nth-child(1) { right: 0; bottom: 10px; background: #f64723; }
  i:nth-child(2) { right: 77px; bottom: 2px; background: #000; }
  i:nth-child(3) { right: 34px; bottom: -6px; background: ${token.colors.primary.primary50}; }
  span {
    position: absolute;
    right: 0;
    top: -24px;
    transform: rotate(-19.57deg);
    color: #000;
    ${token.typography('heading', 'md', 'semibold')}
    line-height: 1.2;
    text-align: center;
  }
`
