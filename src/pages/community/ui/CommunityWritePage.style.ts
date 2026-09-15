import styled, { keyframes } from 'styled-components';

import * as token from '@/shared/styles/values/token';

export const Page = styled.section`
  box-sizing: border-box;
  height: 100dvh;
  min-height: 100dvh;
  padding: clamp(32px, 5.1dvh, 50px) clamp(24px, 8.31%, 100px);
  overflow: hidden;
  container-name: community-write;
  container-type: inline-size;
  background: ${token.colors.white};
`;

export const Content = styled.div`
  ${token.flexColumn}
  gap: 20px;
  width: 100%;
  max-width: calc(1003px / 0.9);
  height: 100%;
  min-height: 0;
  overflow: hidden;
  margin: 0 auto;
  zoom: 0.9;
`;

export const Header = styled.header`
  ${token.flexColumn}
  flex: 0 0 auto;
  gap: 24px;
  width: 100%;
`;

export const BackButton = styled.button`
  ${token.flexLeft}
  align-self: flex-start;
  gap: 8px;
  height: 21px;
  padding: 0;
  border: 0;
  color: ${token.colors.gray.gray50};
  background: transparent;
  ${token.typography('body', 'lg', 'medium')}
  line-height: 1;
  cursor: pointer;
`;

export const BackIcon = styled.img`
  width: 9.257px;
  height: 16px;
  transform: rotate(180deg);
`;

export const WriteForm = styled.form`
  ${token.flexColumn}
  gap: 20px;
  width: 100%;
`;

export const TitleRow = styled.div`
  ${token.flexBetween}
  gap: 20px;
  width: 100%;
  min-height: 39px;
`;

export const Heading = styled.h1`
  margin: 0;
  color: ${token.colors.gray.gray100};
  ${token.typography('heading', 'lg', 'semibold')}
  line-height: 1.18;
`;

export const Fields = styled.div`
  ${token.flexRow}
  gap: 12px;
  width: 100%;
  height: 52px;

  @container community-write (max-width: 560px) {
    flex-direction: column;
    height: auto;
  }
`;

export const CategoryField = styled.div`
  position: relative;
  flex: 0 0 162px;
  height: 52px;

  @container community-write (max-width: 560px) {
    flex-basis: 52px;
    width: 100%;
  }
`;

export const CategoryTrigger = styled.button`
  display: flex;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  padding: 12px 44px 12px 12px;
  overflow: hidden;
  border: 1px solid ${token.colors.gray.gray10};
  border-radius: ${token.shapes.medium};
  outline: none;
  color: ${token.colors.gray.gray60};
  background: ${token.colors.white};
  ${token.typography('body', 'md', 'medium')}
  line-height: 1;
  text-align: left;
  cursor: pointer;

  &:focus-visible {
    outline: 2px solid ${token.colors.primary.primary50};
    outline-offset: -2px;
  }

  &:disabled {
    cursor: default;
  }
`;

export const CategoryChevron = styled.img<{ $open: boolean }>`
  position: absolute;
  top: 21px;
  right: 12px;
  width: 16px;
  height: 10px;
  pointer-events: none;
  transform: rotate(${({ $open }) => ($open ? '0deg' : '180deg')});
  transition: transform 150ms ease;
`;

const categoryOptionsEnter = keyframes`
  from {
    opacity: 0;
    transform: translateY(-4px) scaleY(.96);
  }

  to {
    opacity: 1;
    transform: translateY(0) scaleY(1);
  }
`;

export const CategoryOptions = styled.div`
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  left: 0;
  z-index: 20;
  display: flex;
  flex-direction: column;
  padding: 6px;
  border: 1px solid ${token.colors.gray.gray10};
  border-radius: ${token.shapes.medium};
  background: ${token.colors.white};
  box-shadow: 0 8px 20px rgb(0 0 0 / 12%);
  transform-origin: top center;
  animation: ${categoryOptionsEnter} 160ms ease-out;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

export const CategoryOption = styled.button<{ $selected: boolean }>`
  width: 100%;
  min-height: 36px;
  padding: 8px;
  border: 0;
  border-radius: ${token.shapes.small};
  color: ${({ $selected }) =>
    $selected ? token.colors.gray.gray100 : token.colors.gray.gray60};
  background: ${({ $selected }) =>
    $selected ? token.colors.primary.primary10 : 'transparent'};
  ${token.typography('body', 'sm', 'medium')}
  text-align: left;
  cursor: pointer;

  &:hover,
  &:focus-visible {
    outline: none;
    background: ${token.colors.gray.gray0};
  }
`;

export const TitleField = styled.div`
  position: relative;
  flex: 1 1 0;
  min-width: 0;
`;

export const TitleInput = styled.input<{ $isOverLimit: boolean }>`
  width: 100%;
  box-sizing: border-box;
  min-width: 0;
  height: 52px;
  padding: 12px 82px 12px 20px;
  border: 1px solid ${token.colors.gray.gray10};
  border-radius: ${token.shapes.medium};
  outline: ${({ $isOverLimit }) =>
    $isOverLimit ? `2px solid ${token.colors.danger.danger30}` : 'none'};
  color: ${token.colors.gray.gray100};
  background: ${token.colors.white};
  ${token.typography('body', 'md', 'medium')}
  line-height: 1;

  &::placeholder {
    color: ${token.colors.gray.gray40};
    opacity: 1;
  }

  &:focus-visible {
    outline: ${({ $isOverLimit }) =>
      $isOverLimit
        ? `2px solid ${token.colors.danger.danger30}`
        : `2px solid ${token.colors.primary.primary50}`};
    outline-offset: -2px;
  }
`;

export const TitleCounter = styled.span<{ $isOverLimit: boolean }>`
  position: absolute;
  top: 50%;
  right: 16px;
  color: ${({ $isOverLimit }) =>
    $isOverLimit ? token.colors.danger.danger30 : token.colors.gray.gray40};
  ${token.typography('caption', 'sm', 'medium')}
  line-height: 1;
  pointer-events: none;
  transform: translateY(-50%);
`;

export const ContentCounter = styled.span`
  flex: 0 0 auto;
  align-self: flex-end;
  color: ${token.colors.gray.gray40};
  ${token.typography('caption', 'sm', 'medium')}
  line-height: 1;
`;

interface EditorProps {
  $selectedBlockId: string | null;
}

export const Editor = styled.section<EditorProps>`
  ${token.flexColumn}
  position: relative;
  flex: 1 1 0;
  gap: 16px;
  box-sizing: border-box;
  width: 100%;
  min-height: 0;
  max-height: 100%;
  padding: 16px;
  overflow: hidden;
  border: 1px solid ${token.colors.gray.gray10};
  border-radius: ${token.shapes.small};
  background: ${token.colors.white};

  .community-toolbar-actions {
    display: flex;
    flex: 0 1 auto;
    flex-wrap: wrap;
    align-items: center;
    gap: 12px;
  }

  .community-toolbar-button {
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 0 0 24px;
    min-width: 0;
    width: 24px;
    height: 24px;
    padding: 0;
    border: 0;
    border-radius: 2px;
    background: transparent;
    cursor: pointer;

    &:disabled {
      cursor: not-allowed;
      opacity: 0.45;
    }

    &:not(:disabled):hover {
      background: ${token.colors.gray.gray10};
    }

    &:focus-visible {
      outline: 2px solid ${token.colors.primary.primary50};
      outline-offset: 2px;
    }

    img {
      display: block;
      flex: 0 0 auto;
      width: auto;
      height: 20px;
      max-width: 20px;
    }
  }

  .community-image-input {
    display: none;
  }

  .community-file-input {
    display: none;
  }

  .community-block-editor {
    flex: 1 1 0;
    box-sizing: border-box;
    min-width: 0;
    max-width: none;
    min-height: 0;
    margin-right: -16px;
    padding-right: 16px;
    overflow-x: hidden;
    overflow-y: auto;
    overscroll-behavior: contain;
    scrollbar-color: ${token.colors.gray.gray40} transparent;
    scrollbar-width: thin;

    &::-webkit-scrollbar {
      width: 8px;
      background: transparent;
    }

    &::-webkit-scrollbar-track,
    &::-webkit-scrollbar-corner {
      background: transparent;
    }

    &::-webkit-scrollbar-thumb {
      border-radius: 999px;
      background: ${token.colors.gray.gray40};
    }
  }

  .community-block-editor .bn-root {
    --bn-colors-editor-text: ${token.colors.gray.gray100};
    --bn-colors-editor-background: transparent;
    --bn-colors-menu-text: ${token.colors.gray.gray100};
    --bn-colors-menu-background: ${token.colors.white};
    --bn-colors-hovered-text: ${token.colors.gray.gray100};
    --bn-colors-hovered-background: ${token.colors.gray.gray10};
    --bn-colors-selected-background: ${token.colors.gray.gray100};
    --bn-colors-side-menu: ${token.colors.gray.gray40};
    --bn-colors-border: ${token.colors.gray.gray20};
    --bn-font-family: ${token.fontFamily.system};
  }

  .community-block-editor .bn-editor {
    box-sizing: border-box;
    min-height: 100%;
    padding: 8px 54px 32px;
    background: transparent;
    ${token.typography('body', 'lg', 'medium')}
    line-height: 1.5;
  }

  .community-block-editor .bn-block-outer,
  .community-block-editor .bn-block,
  .community-block-editor .bn-block-content {
    width: 100%;
  }

  .community-block-editor .bn-block-content {
    box-sizing: border-box;
    min-height: 30px;
    padding-left: 8px;
    overflow-wrap: anywhere;
  }

  ${({ $selectedBlockId }) =>
    $selectedBlockId
      ? `
          .community-block-editor
            .bn-block-outer[data-id='${$selectedBlockId}'] {
            border-radius: ${token.shapes.small};
            background: ${token.colors.info.info0};
            transition: background-color 120ms ease-out;
          }
        `
      : ''}

  .community-block-editor
    .bn-block-content:has(.ProseMirror-trailingBreak:only-child):after {
    color: ${token.colors.gray.gray30};
    font-style: normal;
    transform: none;
  }

  .community-block-editor .bn-inline-content {
    overflow-wrap: anywhere;
  }

  .community-block-editor [data-file-block] .bn-file-block-content-wrapper,
  .community-block-editor [data-file-block] .bn-visual-media-wrapper {
    box-sizing: border-box;
    max-width: 100% !important;
  }

  .community-block-editor [data-file-block] .bn-visual-media {
    display: block;
    width: auto !important;
    max-width: 100% !important;
    max-height: 520px;
    height: auto !important;
    object-fit: contain;
  }

  .community-block-editor .bn-block-content[data-content-type='heading'] {
    padding-top: 12px;
    font-weight: ${token.fontWeight.semibold};
    line-height: 1.25;
  }

  .community-block-editor
    .bn-block-outer:not([data-prev-type])
    > .bn-block
    > .bn-block-content[data-content-type='heading'] {
    font-size: ${token.fontSize.heading.lg};
  }

  .community-block-editor
    .bn-block-outer:not([data-prev-type])
    > .bn-block
    > .bn-block-content[data-content-type='heading'][data-level='2'] {
    font-size: ${token.fontSize.heading.md};
  }

  .community-block-editor
    .bn-block-outer:not([data-prev-type])
    > .bn-block
    > .bn-block-content[data-content-type='heading'][data-level='3'] {
    font-size: ${token.fontSize.heading.sm};
  }

  .community-block-editor
    .bn-block-outer:not([data-prev-type])
    > .bn-block
    > .bn-block-content[data-content-type='heading'][data-level='4'] {
    font-size: ${token.fontSize.body.lg};
  }

  .community-block-editor
    .bn-block-outer:not([data-prev-type])
    > .bn-block
    > .bn-block-content[data-content-type='heading'][data-level='5'],
  .community-block-editor
    .bn-block-outer:not([data-prev-type])
    > .bn-block
    > .bn-block-content[data-content-type='heading'][data-level='6'] {
    font-size: ${token.fontSize.body.md};
  }

  .community-block-editor .bn-editor em {
    display: inline-block;
    font-style: italic;
    transform: skewX(-12deg);
    transform-origin: left center;
  }

  @container community-write (max-width: 560px) {
    flex-basis: 0;
    min-height: 0;

    .community-block-editor .bn-editor {
      padding-inline: 54px;
    }
  }
`;

export const BlockSideMenu = styled.div`
  display: flex;
  color: ${token.colors.gray.gray40};
  --bn-colors-side-menu: ${token.colors.gray.gray40};

  .bn-side-menu {
    gap: 2px;
  }

  .bn-side-menu .mantine-UnstyledButton-root:not(.mantine-Menu-item) {
    box-sizing: border-box;
    width: 24px;
    min-width: 24px;
    height: 24px;
    min-height: 24px;
    padding: 3px;
    color: ${token.colors.gray.gray40};
  }

  .bn-side-menu .mantine-UnstyledButton-root:not(.mantine-Menu-item) svg {
    width: 18px;
    height: 18px;
    color: ${token.colors.gray.gray40};
  }

  .bn-side-menu [draggable='true'] {
    width: 18px;
    min-width: 18px;
    padding-inline: 0;
    cursor: grab;
  }

  .bn-side-menu [draggable='true']:active {
    cursor: grabbing;
  }

  .bn-drag-handle-menu {
    top: 32px !important;
    left: 0 !important;
  }

  .bn-color-picker-dropdown {
    top: 0 !important;
    left: calc(100% + 4px) !important;
    max-height: 360px !important;
    overflow-y: auto;
  }
`;

export const BlockDropIndicator = styled.div<{
  $left: number;
  $top: number;
  $width: number;
}>`
  position: absolute;
  z-index: 50;
  top: ${({ $top }) => $top}px;
  left: ${({ $left }) => $left}px;
  width: ${({ $width }) => $width}px;
  height: 2px;
  border-radius: ${token.shapes.circle};
  background: ${token.colors.info.info10};
  pointer-events: none;
  transform: translateY(-1px);
`;

export const Toolbar = styled.div`
  ${token.flexBetween}
  flex: 0 0 auto;
  flex-wrap: wrap;
  gap: 12px;
  width: 100%;
  min-height: 24px;
`;

export const AnonymousLabel = styled.label`
  ${token.flexLeft}
  gap: 6px;
  margin-left: auto;
  color: ${token.colors.gray.gray40};
  ${token.typography('body', 'md', 'medium')}
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
`;

export const AnonymousToggle = styled.input`
  position: relative;
  box-sizing: border-box;
  width: 36.69px;
  height: 19px;
  margin: 0;
  border: 0;
  border-radius: 10.483px;
  outline: none;
  background: ${token.colors.gray.gray30};
  appearance: none;
  cursor: pointer;
  transition: background-color 180ms ease-out;

  &::after {
    position: absolute;
    top: 2px;
    left: 2px;
    width: 15px;
    height: 15px;
    border-radius: ${token.shapes.circle};
    background: ${token.colors.white};
    content: '';
    transition: transform 180ms ease-out;
  }

  &:checked {
    background: ${token.colors.primary.primary50};
  }

  &:checked::after {
    transform: translateX(17.69px);
  }

  &:focus-visible {
    outline: 2px solid ${token.colors.primary.primary50};
    outline-offset: 2px;
  }
`;

export const EditorDivider = styled.hr`
  flex: 0 0 1px;
  width: 100%;
  height: 1px;
  margin: 4px 0 -4px;
  border: 0;
  background: ${token.colors.gray.gray10};
`;

const uploadSkeletonShimmer = keyframes`
  from {
    background-position: 200% 0;
  }

  to {
    background-position: -200% 0;
  }
`;

export const FileUploadSkeleton = styled.div`
  display: grid;
  grid-template-columns: 42px minmax(0, 1fr);
  gap: 12px;
  align-items: center;
  box-sizing: border-box;
  width: calc(100% - 66px);
  min-height: 76px;
  margin: 12px 12px 12px 54px;
  padding: 12px;
  overflow: hidden;
  border-radius: ${token.shapes.small};
  background: ${token.colors.white};
  pointer-events: none;

  &::before,
  &::after {
    display: block;
    border-radius: ${token.shapes.xsmall};
    background: linear-gradient(
      90deg,
      ${token.colors.gray.gray0} 25%,
      ${token.colors.gray.gray10} 50%,
      ${token.colors.gray.gray0} 75%
    );
    background-size: 200% 100%;
    animation: ${uploadSkeletonShimmer} 1.4s ease-in-out infinite;
    content: '';
  }

  &::before {
    width: 42px;
    height: 42px;
  }

  &::after {
    width: 72%;
    height: 18px;
  }

  @media (prefers-reduced-motion: reduce) {
    &::before,
    &::after {
      animation: none;
    }
  }

  @container community-write (max-width: 560px) {
    width: calc(100% - 66px);
    margin-left: 54px;
  }
`;

export const SubmitError = styled.p`
  position: fixed;
  z-index: 20;
  right: 32px;
  bottom: 32px;
  max-width: 420px;
  margin: 0;
  padding: 12px 16px;
  border-radius: ${token.shapes.small};
  color: ${token.colors.danger.danger30};
  background: ${token.colors.danger.danger0};
  ${token.typography('body', 'md', 'medium')}
  line-height: 1.4;

  @media (max-width: 700px) {
    right: 24px;
    bottom: 24px;
    left: 24px;
    max-width: none;
  }
`;

export const FileUploadStatus = styled.p`
  position: fixed;
  z-index: 20;
  right: 32px;
  bottom: 32px;
  margin: 0;
  padding: 12px 16px;
  border-radius: ${token.shapes.small};
  color: ${token.colors.white};
  background: ${token.colors.gray.gray90};
  ${token.typography('body', 'md', 'medium')}
  line-height: 1.4;

  @media (max-width: 700px) {
    right: 24px;
    bottom: 24px;
    left: 24px;
  }
`;
