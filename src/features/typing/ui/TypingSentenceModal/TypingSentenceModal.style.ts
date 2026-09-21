import styled from 'styled-components'

import * as token from '@/shared/styles/values/token'

export const Overlay = styled.div`
  position: fixed;
  z-index: 1000;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgb(14 13 12 / 70%);
`

export const SettingsDialog = styled.div`
  width: 600px;
  height: 588px;
  padding: 37px 38px;
  overflow: hidden;
  border-radius: ${token.shapes.medium};
  background: ${token.colors.white};
`

export const EditorDialog = styled(SettingsDialog)``

export const ModalHeader = styled.div`
  ${token.flexRow}
  align-items: center;
  justify-content: space-between;
  height: 29px;
  margin-bottom: 15px;
`

export const ModalTitle = styled.h2`
  color: ${token.colors.gray.gray100};
  line-height: 1;
  ${token.typography('heading', 'md', 'semibold')}
`

export const IconButton = styled.button`
  ${token.flexCenter}
  width: 24px;
  height: 24px;
  color: ${token.colors.gray.gray100};
  cursor: pointer;
`

export const SentenceList = styled.div`
  ${token.flexColumn}
  height: calc(100% - 44px);
  gap: 10px;
  overflow-y: auto;
  overscroll-behavior: contain;
`

export const SentenceItem = styled.div`
  ${token.flexRow}
  flex: 0 0 50px;
  align-items: center;
  width: 100%;
  height: 50px;
  gap: 10px;
  padding: 10px;
  border: 1px solid ${token.colors.gray.gray10};
  border-radius: ${token.shapes.small};
`

export const CategoryBadge = styled.span`
  ${token.flexCenter}
  flex: 0 0 54px;
  width: 54px;
  height: 28px;
  border-radius: 6px;
  background: ${token.colors.primary.primary50};
  color: ${token.colors.primary.foreground};
  line-height: 1;
  ${token.typography('caption', 'lg', 'medium')}
`

export const SentenceText = styled.span`
  flex: 1 1 auto;
  min-width: 0;
  overflow: hidden;
  color: ${token.colors.gray.gray100};
  line-height: 1;
  text-overflow: ellipsis;
  white-space: nowrap;
  ${token.typography('body', 'md', 'medium')}
`

export const RowActions = styled.div`
  ${token.flexRow}
  flex: 0 0 auto;
  gap: 8px;
`

export const RowAction = styled.button<{ $danger?: boolean }>`
  ${token.flexCenter}
  width: 24px;
  height: 24px;
  color: ${({ $danger }) => $danger ? token.colors.danger.danger20 : token.colors.gray.gray50};
  cursor: pointer;
`

export const EditorForm = styled.form`
  ${token.flexColumn}
  height: 470px;
  gap: 12px;
`

export const Field = styled.div<{ $grow?: boolean }>`
  ${token.flexColumn}
  flex: ${({ $grow }) => $grow ? '1 1 auto' : '0 0 auto'};
  align-items: stretch;
  gap: 7px;
  min-height: 0;
`

export const FieldLabel = styled.label`
  color: ${token.colors.gray.gray100};
  line-height: 1;
  ${token.typography('body', 'md', 'medium')}
`

export const SelectWrap = styled.div`
  position: relative;
  height: 49px;

  > svg {
    position: absolute;
    top: 50%;
    right: 18px;
    color: ${token.colors.gray.gray50};
    pointer-events: none;
    transform: translateY(-50%);
  }
`

export const Select = styled.select`
  width: 100%;
  height: 49px;
  padding: 0 48px 0 20px;
  border: 1px solid ${token.colors.gray.gray30};
  border-radius: ${token.shapes.medium};
  outline: none;
  appearance: none;
  background: ${token.colors.white};
  color: ${token.colors.gray.gray100};
  ${token.typography('body', 'md', 'medium')}
`

export const Textarea = styled.textarea`
  flex: 1 1 auto;
  width: 100%;
  min-height: 0;
  padding: 16px;
  resize: none;
  border: 1px solid ${token.colors.gray.gray30};
  border-radius: ${token.shapes.medium};
  outline: none;
  background: ${token.colors.white};
  color: ${token.colors.gray.gray100};
  font-size: 0.875rem;
  line-height: 1.45;
`

export const CodeEditorWrap = styled.div`
  flex: 1 1 auto;
  min-height: 0;
  overflow: hidden;
  border-radius: ${token.shapes.medium};
  background: #40403f;

  .monaco-editor,
  .monaco-editor-background,
  .monaco-editor .margin {
    background: #40403f;
  }

  .monaco-editor .line-numbers {
    color: ${token.colors.gray.gray10};
    transform: translateX(8px);
  }
`

export const SubmitButton = styled.button`
  ${token.flexCenter}
  flex: 0 0 33px;
  width: 100%;
  height: 33px;
  border-radius: ${token.shapes.small};
  background: ${token.colors.primary.primary50};
  color: ${token.colors.primary.foreground};
  cursor: pointer;
  ${token.typography('caption', 'lg', 'medium')}
`

export const DeleteDialog = styled.div`
  width: 330px;
  height: 172px;
  padding: 30px 22px;
  overflow: hidden;
  border: 1px solid ${token.colors.gray.gray30};
  border-radius: ${token.shapes.medium};
  background: ${token.colors.white};
`

export const DeleteTitle = styled.h2`
  color: ${token.colors.gray.gray100};
  line-height: 1;
  text-align: center;
  ${token.typography('body', 'lg', 'semibold')}
`

export const DeleteSentence = styled.p`
  margin-top: 20px;
  overflow: hidden;
  color: ${token.colors.gray.gray100};
  line-height: 1;
  text-overflow: ellipsis;
  white-space: nowrap;
  ${token.typography('caption', 'lg', 'regular')}
`

export const DeleteActions = styled.div`
  ${token.flexRow}
  gap: 24px;
  margin-top: 19px;
`

export const CancelButton = styled.button`
  ${token.flexCenter}
  width: 130px;
  height: 39px;
  border-radius: ${token.shapes.small};
  background: ${token.colors.gray.gray10};
  color: ${token.colors.gray.gray100};
  cursor: pointer;
  ${token.typography('body', 'md', 'medium')}
`

export const DeleteButton = styled(CancelButton)`
  background: ${token.colors.primary.primary50};
`
