import styled from 'styled-components'

import codeTypingBackground from '@/shared/assets/code-typing-background.jpg'
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
  padding: clamp(30px, 3.5vh, 34px) clamp(34px, 4.85vw, 70px) 0;
  overflow: hidden;
  border: 1px solid ${token.colors.gray.gray10};
  background: ${token.colors.white};
`

export const Workspace = styled.div`
  display: flex;
  flex: 1;
  min-height: 0;
  justify-content: center;
  padding-top: clamp(52px, 6.4vh, 63px);
`

export const Monitor = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`

export const Screen = styled.div`
  position: relative;
  z-index: 2;
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: min(592px, calc(100% - 130px));
  min-height: 470px;
  padding: 41px 5% 44px;
  border: 17px solid #d9d9d9;
  border-radius: 20px;
  background: url(${codeTypingBackground}) center / cover no-repeat;
`

export const Editor = styled.div`
  width: 41.2%;
  height: 100%;
  overflow: hidden;
  border-radius: 10px;
  background: #212326;
  color: #e0e0e0;
`

export const EditorHeader = styled.div`
  display: flex;
  align-items: center;
  height: 35px;
  padding: 0 10px;
  border-bottom: 1px solid #444649;
`

export const WindowButtons = styled.div`
  display: flex;
  gap: 5px;

  i { width: 13px; height: 13px; border-radius: 50%; }
  i:nth-child(1) { background: #ff5f57; }
  i:nth-child(2) { background: #ffbd2e; }
  i:nth-child(3) { background: #28c840; }
`

export const EditorTitle = styled.p`
  margin-left: 12px;
  color: ${token.colors.white};
  ${token.typography('caption', 'lg', 'semibold')};
`

export const EditorBody = styled.div`
  height: calc(100% - 35px);
  overflow: hidden;

  .monaco-editor,
  .monaco-editor-background,
  .monaco-editor .margin {
    background: #212326;
  }

  .typing-error {
    color: #ff5f57 !important;
  }
`

export const MonitorNeck = styled.div`
  position: absolute;
  z-index: 1;
  top: min(592px, calc(100% - 130px));
  left: 42%;
  width: 16%;
  height: 100px;
  background: #d9d9d9;

  &::before { content: ''; display: block; width: 100%; height: 22px; background: #c6c6c6; }
`

export const MonitorBase = styled.div`
  position: absolute;
  z-index: 1;
  top: calc(min(592px, calc(100% - 130px)) + 78px);
  left: 22%;
  width: 56%;
  height: 108px;
  border-radius: 50% 50% 0 0;
  background: #d9d9d9;
`
