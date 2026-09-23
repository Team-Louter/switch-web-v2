import styled, { keyframes } from 'styled-components'

import * as token from '@/shared/styles/values/token'

type Status = '-' | '원활' | '답변 지연' | '비활성' | '대기' | '진행' | '완료'

const statusColor: Record<Status, string> = {
  '-': token.colors.gray.gray50,
  원활: token.colors.info.info20,
  '답변 지연': token.colors.warning.warning30,
  비활성: token.colors.danger.danger20,
  대기: token.colors.warning.warning30,
  진행: token.colors.info.info20,
  완료: token.colors.gray.gray50,
}

const statusSurface: Record<Status, string> = {
  '-': token.colors.gray.gray0,
  원활: token.colors.info.info0,
  '답변 지연': token.colors.warning.warning0,
  비활성: token.colors.danger.danger0,
  대기: token.colors.warning.warning0,
  진행: token.colors.info.info0,
  완료: token.colors.gray.gray0,
}

const slideInFromRight = keyframes`
  from {
    opacity: 0;
    transform: translateX(100%);
  }

  to {
    opacity: 1;
    transform: translateX(0);
  }
`

const slideOutToRight = keyframes`
  from {
    opacity: 1;
    transform: translateX(0);
  }

  to {
    opacity: 0;
    transform: translateX(100%);
  }
`

export const MentoringLayout = styled.section`
  position: relative;
  display: flex;
  min-height: 100dvh;
  width: 100%;
  overflow: hidden;
  background: ${token.colors.gray.gray0};
`

export const Content = styled.div`
  ${token.flexColumnStart}
  flex: 1 1 auto;
  gap: 28px;
  width: 100%;
  max-width: 1660px;
  min-width: 0;
  min-height: 100dvh;
  margin: 0 auto;
  padding: clamp(32px, 4.8vw, 72px) clamp(22px, 5vw, 80px);

  @media (max-width: 1180px) {
    padding: 48px 36px;
  }

  @media (max-width: 640px) {
    gap: 22px;
    padding: 32px 18px 40px;
  }
`

export const Header = styled.div`
  ${token.flexLeft}
  align-items: flex-start;
  gap: 16px;
  width: 100%;
`

export const HeaderCopy = styled.div`
  ${token.flexColumnStart}
  gap: 9px;
  min-width: 0;
`

export const HeaderEyebrow = styled.span`
  color: ${token.colors.gray.gray50};
  letter-spacing: 0.12em;
  line-height: 1;
  text-transform: uppercase;
  ${token.typography('caption', 'lg', 'bold')}
`

export const HeaderTitle = styled.h1`
  flex: 0 0 auto;
  color: ${token.colors.gray.gray100};
  letter-spacing: -0.04em;
  line-height: 1.1;
  ${token.typography('heading', 'xxl', 'bold')}

  @media (max-width: 640px) {
    ${token.typography('heading', 'xl', 'bold')}
  }
`

export const HeaderDescription = styled.p`
  color: ${token.colors.gray.gray60};
  line-height: 1.45;
  ${token.typography('body', 'md', 'regular')}
`

export const BackButton = styled.button`
  ${token.flexCenter}
  flex: 0 0 42px;
  width: 42px;
  height: 42px;
  margin-top: 4px;
  border: 1px solid ${token.colors.gray.gray10};
  border-radius: ${token.shapes.medium};
  background: ${token.colors.white};
  color: ${token.colors.gray.gray80};
  transition:
    color 140ms ease,
    background-color 140ms ease,
    transform 140ms ease;

  svg {
    width: 18px;
    height: 18px;
  }

  &:hover {
    transform: translateX(-2px);
    background: ${token.colors.primary.primary10};
    color: ${token.colors.gray.gray100};
  }

  &:focus-visible {
    outline: 2px solid ${token.colors.primary.primary50};
    outline-offset: 2px;
  }

  line-height: 1;
`

export const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
  width: 100%;

  @media (max-width: 1180px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 520px) {
    grid-template-columns: 1fr;
  }
`

type StatTone = 'danger' | 'warning' | 'info' | 'success'

const statToneColor: Record<StatTone, string> = {
  danger: token.colors.danger.danger20,
  warning: token.colors.warning.warning20,
  info: token.colors.info.info20,
  success: token.colors.success.success20,
}

const statToneSurface: Record<StatTone, string> = {
  danger: token.colors.danger.danger0,
  warning: token.colors.warning.warning0,
  info: token.colors.info.info0,
  success: token.colors.success.success0,
}

export const StatCard = styled.article<{ $tone: StatTone }>`
  ${token.flexColumnStart}
  position: relative;
  min-height: 164px;
  gap: 12px;
  padding: 18px 18px 16px;
  overflow: hidden;
  border: 1px solid ${token.colors.gray.gray10};
  border-top: 3px solid ${({ $tone }) => statToneColor[$tone]};
  border-radius: ${token.shapes.large};
  background: ${token.colors.white};
  ${token.elevation('black_1')}

  @media (hover: hover) {
    transition:
      transform 160ms ease,
      box-shadow 160ms ease;

    &:hover {
      transform: translateY(-2px);
      ${token.elevation('black_2')}
    }

    @media (prefers-reduced-motion: reduce) {
      transition: none;

      &:hover {
        transform: none;
      }
    }
  }
`

export const StatHeader = styled.div`
  ${token.flexBetween}
  width: 100%;
`

export const StatLabel = styled.span`
  color: ${token.colors.gray.gray60};
  line-height: 1.2;
  ${token.typography('body', 'sm', 'semibold')}
`

export const StatIcon = styled.span<{ $tone: StatTone }>`
  ${token.flexCenter}
  width: 32px;
  height: 32px;
  border-radius: ${token.shapes.small};
  background: ${({ $tone }) => statToneSurface[$tone]};
  color: ${({ $tone }) => statToneColor[$tone]};

  svg {
    width: 18px;
    height: 18px;
  }
`

export const StatValue = styled.strong`
  ${token.flexLeft}
  align-items: flex-end;
  gap: 7px;
  color: ${token.colors.gray.gray100};
  line-height: 1;
  letter-spacing: -0.04em;
  ${token.typography('heading', 'xl', 'bold')}
`

export const StatUnit = styled.span`
  padding-bottom: 3px;
  color: ${token.colors.gray.gray80};
  ${token.typography('body', 'md', 'medium')}
`

export const StatHint = styled.span`
  color: ${token.colors.gray.gray50};
  line-height: 1.3;
  ${token.typography('caption', 'lg', 'medium')}
`

export const Table = styled.section`
  ${token.flexColumnStart}
  gap: 10px;
  width: 100%;
  padding: 22px;
  overflow-x: auto;
  border: 1px solid ${token.colors.gray.gray10};
  border-radius: ${token.shapes.xlarge};
  background: ${token.colors.white};
  ${token.elevation('black_1')}

  @media (max-width: 640px) {
    gap: 14px;
    padding: 16px 12px;
  }
`

export const Toolbar = styled.div`
  ${token.flexBetween}
  flex-wrap: wrap;
  gap: 14px;
  width: 100%;
`

export const ToolbarLeft = styled.div`
  ${token.flexLeft}
  flex-wrap: wrap;
  gap: 8px 12px;
  flex: 1 1 240px;
`

export const ToolbarTitle = styled.h2`
  color: ${token.colors.gray.gray100};
  line-height: 1.2;
  ${token.typography('heading', 'sm', 'bold')}
`

export const FilterBar = styled.div`
  ${token.flexLeft}
  gap: 4px;
  color: ${token.colors.gray.gray50};
  line-height: 1;
  white-space: nowrap;
  ${token.typography('body', 'sm', 'medium')}
`

export const FilterIcon = styled.span`
  color: ${token.colors.gray.gray30};
  font-size: 14px;
`

export const SortSelectWrap = styled.label`
  ${token.flexLeft}
  gap: 6px;
  padding: 7px 9px;
  border: 1px solid ${token.colors.gray.gray10};
  border-radius: ${token.shapes.small};
  background: ${token.colors.white};
  color: ${token.colors.gray.gray50};
`

export const SortSelect = styled.select`
  min-width: 108px;
  border: 0;
  outline: 0;
  background: transparent;
  color: ${token.colors.gray.gray50};
  line-height: 1;
  cursor: pointer;
  appearance: none;
  ${token.typography('body', 'sm', 'medium')}

  &:focus-visible {
    outline: 2px solid ${token.colors.primary.primary40};
    outline-offset: 2px;
  }
`

export const RadioFilterList = styled.div`
  ${token.flexLeft}
  flex-wrap: wrap;
  gap: 3px;
  padding: 3px;
  border: 1px solid ${token.colors.gray.gray10};
  border-radius: ${token.shapes.small};
  background: ${token.colors.gray.gray0};
  color: ${token.colors.gray.gray50};
  line-height: 1;
  white-space: nowrap;
  ${token.typography('body', 'sm', 'medium')}
`

export const RadioFilterItem = styled.label<{ $checked: boolean }>`
  ${token.flexCenter}
  position: relative;
  min-height: 32px;
  padding: 0 10px;
  border-radius: ${token.shapes.xsmall};
  background: ${({ $checked }) => ($checked ? token.colors.white : 'transparent')};
  box-shadow: ${({ $checked }) => ($checked ? token.elevations.black_1 : 'none')};
  color: ${({ $checked }) => ($checked ? token.colors.gray.gray90 : token.colors.gray.gray50)};
  cursor: pointer;
  transition:
    color 120ms ease,
    background-color 120ms ease,
    box-shadow 120ms ease;

  &:focus-within {
    outline: 2px solid ${token.colors.primary.primary50};
    outline-offset: 1px;
  }
`

export const HiddenRadioInput = styled.input`
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
`

export const SearchBox = styled.label`
  ${token.flexBetween}
  flex: 1 1 220px;
  max-width: 320px;
  min-width: min(100%, 180px);
  height: 42px;
  padding: 0 13px;
  border: 1px solid ${token.colors.gray.gray10};
  border-radius: ${token.shapes.small};
  background: ${token.colors.white};
  color: ${token.colors.gray.gray50};
  line-height: 1;
  ${token.typography('body', 'sm', 'medium')}

  &:focus-within {
    border-color: ${token.colors.primary.primary60};
    box-shadow: 0 0 0 3px ${token.colors.primary.primary10};
  }
`

export const SearchField = styled.input`
  flex: 1 1 auto;
  min-width: 0;
  border: 0;
  outline: 0;
  background: transparent;
  color: ${token.colors.gray.gray100};
  line-height: 1;
  ${token.typography('body', 'sm', 'medium')}

  &::placeholder {
    color: ${token.colors.gray.gray50};
  }
`

export const SearchIcon = styled.span`
  display: inline-flex;
  flex: 0 0 18px;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  color: ${token.colors.gray.gray40};

  svg {
    display: block;
  }
`

const tableColumns = {
  mentor: 'minmax(210px, 1.55fr) repeat(4, minmax(88px, 1fr))',
  question: 'minmax(280px, 1.8fr) repeat(4, minmax(110px, 1fr))',
}

export const TableHeader = styled.div<{ $columns: keyof typeof tableColumns }>`
  display: grid;
  grid-template-columns: ${({ $columns }) => tableColumns[$columns]};
  align-items: center;
  width: 100%;
  min-width: ${({ $columns }) => ($columns === 'question' ? '792px' : '634px')};
  min-height: 42px;
  gap: 12px;
  padding: 10px 12px;
  border-bottom: 1px solid ${token.colors.gray.gray10};
  background: ${token.colors.white};
  color: ${token.colors.gray.gray50};
  text-align: center;
  line-height: 1;
  ${token.typography('body', 'sm', 'medium')}

  > :first-child {
    text-align: left;
  }

  strong {
    color: ${token.colors.gray.gray100};
    ${token.typography('body', 'md', 'semibold')}
  }
`

export const TableRow = styled.button<{
  $columns: 'mentor' | 'question'
  $active?: boolean
}>`
  display: grid;
  grid-template-columns: ${({ $columns }) => tableColumns[$columns]};
  align-items: center;
  width: 100%;
  min-width: ${({ $columns }) => ($columns === 'question' ? '792px' : '634px')};
  min-height: 68px;
  gap: 12px;
  padding: 12px;
  border-radius: ${token.shapes.small};
  background: ${({ $active }) => ($active ? token.colors.primary.primary0 : token.colors.white)};
  text-align: center;
  transition:
    background-color 120ms ease,
    box-shadow 120ms ease;

  &:hover {
    background: ${({ $active }) =>
      $active ? token.colors.primary.primary10 : token.colors.gray.gray0};
  }

  &:focus-visible {
    outline: 2px solid ${token.colors.primary.primary50};
    outline-offset: 2px;
  }
`

export const TableCell = styled.span`
  color: ${token.colors.gray.gray100};
  line-height: 1;
  ${token.typography('body', 'sm', 'medium')}
`

export const StatusMessage = styled.p`
  width: 100%;
  padding: 24px 12px;
  color: ${token.colors.gray.gray50};
  line-height: 1;
  text-align: center;
  ${token.typography('body', 'sm', 'medium')}
`

export const MentorCell = styled.span`
  ${token.flexLeft}
  gap: 10px;
  min-width: 0;
  text-align: left;
`

export const MentorProfile = styled.span<{ $size?: 'xs' | 'sm' | 'lg' }>`
  flex: 0 0 ${({ $size }) => ($size === 'lg' ? '52px' : $size === 'sm' ? '34px' : $size === 'xs' ? '28px' : '42px')};
  width: ${({ $size }) => ($size === 'lg' ? '52px' : $size === 'sm' ? '34px' : $size === 'xs' ? '28px' : '42px')};
  height: ${({ $size }) => ($size === 'lg' ? '52px' : $size === 'sm' ? '34px' : $size === 'xs' ? '28px' : '42px')};
  overflow: hidden;
  border: 1px solid ${token.colors.gray.gray10};
  border-radius: ${token.shapes.circle};
  background: ${token.colors.primary.primary10};

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`

export const MentorInfo = styled.span`
  ${token.flexColumnStart}
  width: max-content;
  max-width: 100%;
  min-width: 0;
  gap: 6px;
`

export const MentorName = styled.strong`
  color: ${token.colors.gray.gray100};
  line-height: 1;
  white-space: nowrap;
  ${token.typography('body', 'md', 'semibold')}
`

export const MentorMeta = styled.span`
  display: block;
  max-width: 100%;
  overflow: hidden;
  color: ${token.colors.gray.gray60};
  line-height: 1;
  text-overflow: ellipsis;
  white-space: nowrap;
  ${token.typography('caption', 'lg', 'medium')}
`

export const StatusText = styled.span<{ $status: Status }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 28px;
  padding: 0 10px;
  border-radius: ${token.shapes.circle};
  background: ${({ $status }) => statusSurface[$status]};
  color: ${({ $status }) => statusColor[$status]};
  line-height: 1;
  text-align: center;
  white-space: nowrap;
  ${token.typography('caption', 'lg', 'semibold')}
`

export const DetailHeader = styled.section`
  display: grid;
  grid-template-columns: minmax(210px, 0.8fr) minmax(0, 2fr);
  align-items: center;
  gap: 28px;
  width: 100%;
  padding: 24px;
  border: 1px solid ${token.colors.gray.gray10};
  border-radius: ${token.shapes.xlarge};
  background: ${token.colors.white};
  ${token.elevation('black_1')}

  ${MentorCell} {
    width: 100%;
  }

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 22px;
  }

  @media (max-width: 520px) {
    padding: 18px 14px;
  }
`

export const DetailMetrics = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  align-items: center;
  min-width: 0;

  @media (max-width: 520px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 18px 0;
  }
`

export const DetailMetric = styled.div`
  ${token.flexColumnStart}
  gap: 8px;
  min-width: 0;
  padding: 4px 14px;
  border-left: 1px solid ${token.colors.gray.gray10};
  text-align: left;

  @media (max-width: 900px) {
    &:first-child {
      border-left: 0;
    }
  }

  @media (max-width: 520px) {
    padding: 2px 12px;

    &:nth-child(odd) {
      border-left: 0;
    }
  }
`

export const DetailMetricLabel = styled.span`
  color: ${token.colors.gray.gray50};
  line-height: 1;
  white-space: nowrap;
  ${token.typography('body', 'sm', 'medium')}
`

export const DetailMetricValue = styled.strong`
  color: ${token.colors.gray.gray100};
  line-height: 1.2;
  white-space: nowrap;
  ${token.typography('body', 'lg', 'bold')}
`

export const QuestionTitle = styled.span`
  overflow: hidden;
  color: ${token.colors.gray.gray100};
  line-height: 1;
  text-align: left;
  text-overflow: ellipsis;
  white-space: nowrap;
  ${token.typography('body', 'md', 'semibold')}
`

export const QuestionAuthor = styled.span`
  ${token.flexCenter}
  gap: 4px;
  color: ${token.colors.gray.gray100};
  line-height: 1;
  ${token.typography('body', 'sm', 'medium')}
`

export const ChatPanel = styled.aside<{ $isClosing?: boolean }>`
  ${token.flexColumnStart}
  position: absolute;
  top: 0;
  right: 0;
  width: 460px;
  height: 100dvh;
  gap: 22px;
  padding: 24px 20px;
  overflow: hidden;
  border-left: 1px solid ${token.colors.gray.gray10};
  background: ${token.colors.gray.gray0};
  box-shadow: 0 8px 28px rgb(28 27 23 / 14%);
  animation: ${({ $isClosing }) =>
    $isClosing ? slideOutToRight : slideInFromRight}
    180ms ease both;
  z-index: 2;

  @media (max-width: 1180px) {
    position: fixed;
    width: min(460px, 100vw);
  }
`

export const ClosePanelButton = styled.button`
  ${token.flexCenter}
  width: 36px;
  height: 36px;
  border-radius: ${token.shapes.small};
  color: ${token.colors.gray.gray50};
  font-size: 26px;
  line-height: 1;

  &:hover {
    background: ${token.colors.gray.gray10};
    color: ${token.colors.gray.gray90};
  }

  &:focus-visible {
    outline: 2px solid ${token.colors.primary.primary50};
    outline-offset: 2px;
  }
`

export const ChatPanelHeader = styled.header`
  ${token.flexColumnStart}
  gap: 12px;
  width: 100%;
`

export const ChatPanelTitle = styled.h2`
  color: ${token.colors.gray.gray100};
  line-height: 1.2;
  ${token.typography('heading', 'sm', 'bold')}
`

export const ChatTimestamp = styled.p`
  color: ${token.colors.gray.gray50};
  line-height: 1;
  ${token.typography('caption', 'lg', 'semibold')}
`

export const ChatCard = styled.section`
  ${token.flexColumnStart}
  flex: 1 1 0;
  width: 100%;
  min-height: 0;
  padding: 12px 8px;
  overflow: hidden;
  border-radius: ${token.shapes.large};
  background: ${token.colors.white};
`

export const ChatLog = styled.div`
  ${token.flexColumnStart}
  width: 100%;
  gap: 10px;
  overflow-y: auto;
`

export const MessageGroup = styled.div<{ $align?: 'right' }>`
  display: flex;
  justify-content: ${({ $align }) => ($align === 'right' ? 'flex-end' : 'flex-start')};
  align-items: flex-start;
  width: 100%;
  gap: 6px;
`

export const MessageStack = styled.div<{ $align?: 'right' }>`
  ${token.flexColumnStart}
  align-items: ${({ $align }) => ($align === 'right' ? 'flex-end' : 'flex-start')};
  gap: 8px;
  max-width: 78%;
  padding: 8px 0;
`

export const MessageAuthor = styled.span`
  color: ${token.colors.gray.gray100};
  line-height: 1;
  ${token.typography('body', 'sm', 'medium')}
`

export const MessageBubble = styled.p<{ $fromMentee?: boolean }>`
  width: fit-content;
  max-width: 100%;
  padding: 10px;
  border: ${({ $fromMentee }) =>
    $fromMentee ? '0' : `1px solid ${token.colors.gray.gray20}`};
  border-radius: ${token.shapes.small};
  background: ${({ $fromMentee }) =>
    $fromMentee ? token.colors.primary.primary30 : token.colors.white};
  color: ${token.colors.gray.gray100};
  line-height: 1.2;
  word-break: keep-all;
  overflow-wrap: anywhere;
  ${token.typography('body', 'md', 'medium')}
`

export const ChatMeta = styled.span<{ $align?: 'right' }>`
  width: 100%;
  color: ${token.colors.gray.gray20};
  line-height: 1;
  text-align: ${({ $align }) => ($align === 'right' ? 'right' : 'left')};
  ${token.typography('caption', 'md', 'medium')}
`
