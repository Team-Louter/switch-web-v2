import styled, { css } from 'styled-components'

import * as token from '@/shared/styles/values/token'

type Status = '원활' | '답변 지연' | '비활성' | '대기' | '진행' | '완료'

const statusColor: Record<Status, string> = {
  원활: token.colors.info.info20,
  '답변 지연': token.colors.warning.warning20,
  비활성: token.colors.danger.danger20,
  대기: token.colors.warning.warning20,
  진행: token.colors.info.info20,
  완료: token.colors.gray.gray50,
}

export const MentoringLayout = styled.section`
  position: relative;
  display: flex;
  min-height: 100dvh;
  width: 100%;
  overflow: hidden;
  background: ${token.colors.white};
`

export const Content = styled.div<{ $withPanel?: boolean }>`
  ${token.flexColumnStart}
  flex: 1 1 auto;
  gap: 40px;
  min-width: 0;
  min-height: 100dvh;
  padding: 80px 100px;
  transition: padding-right 160ms ease;

  ${({ $withPanel }) =>
    $withPanel &&
    css`
      padding-right: 560px;
    `}

  @media (max-width: 1180px) {
    padding: 56px 48px;

    ${({ $withPanel }) =>
      $withPanel &&
      css`
        padding-right: 48px;
      `}
  }
`

export const Header = styled.div`
  ${token.flexLeft}
  gap: 20px;
  width: 100%;
`

export const HeaderCopy = styled.div`
  ${token.flexLeft}
  gap: 16px;
  min-width: 0;
`

export const HeaderTitle = styled.h1`
  flex: 0 0 auto;
  color: ${token.colors.gray.gray100};
  line-height: 1;
  ${token.typography('heading', 'lg', 'semibold')}
`

export const HeaderDescription = styled.p`
  overflow: hidden;
  color: ${token.colors.gray.gray50};
  line-height: 1;
  text-overflow: ellipsis;
  white-space: nowrap;
  ${token.typography('body', 'lg', 'medium')}
`

export const BackButton = styled.button`
  ${token.flexCenter}
  flex: 0 0 30px;
  width: 30px;
  height: 30px;
  border-radius: ${token.shapes.circle};
  background: ${token.colors.gray.gray30};
  color: ${token.colors.white};
  font-size: 28px;
  line-height: 1;
`

export const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 20px;
  width: 100%;

  @media (max-width: 1180px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`

export const StatCard = styled.article<{ $tone?: 'danger' }>`
  ${token.flexColumnStart}
  justify-content: center;
  height: 100px;
  gap: 5px;
  padding: 16px;
  border-radius: ${token.shapes.medium};
  background: ${({ $tone }) =>
    $tone === 'danger' ? token.colors.danger.danger0 : token.colors.gray.gray0};
`

export const StatLabel = styled.span`
  color: ${token.colors.gray.gray80};
  line-height: 1;
  ${token.typography('body', 'sm', 'medium')}
`

export const StatValue = styled.strong`
  ${token.flexLeft}
  align-items: flex-end;
  gap: 5px;
  color: ${token.colors.gray.gray100};
  line-height: 1;
  ${token.typography('heading', 'xl', 'semibold')}
`

export const StatUnit = styled.span`
  padding-bottom: 4px;
  color: ${token.colors.gray.gray80};
  ${token.typography('body', 'md', 'medium')}
`

export const Table = styled.section`
  ${token.flexColumnStart}
  gap: 20px;
  width: 100%;
`

export const Toolbar = styled.div`
  ${token.flexBetween}
  gap: 24px;
  width: 100%;
`

export const ToolbarLeft = styled.div`
  ${token.flexLeft}
  gap: 10px;
  flex: 0 0 auto;
`

export const ToolbarTitle = styled.h2`
  color: ${token.colors.gray.gray100};
  line-height: 1;
  ${token.typography('body', 'lg', 'semibold')}
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
  gap: 4px;
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
  gap: 12px;
  color: ${token.colors.gray.gray50};
  line-height: 1;
  white-space: nowrap;
  ${token.typography('body', 'sm', 'medium')}
`

export const RadioFilterItem = styled.label`
  ${token.flexLeft}
  gap: 4px;
  cursor: pointer;
`

export const HiddenRadioInput = styled.input`
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
`

export const RadioIndicator = styled.span<{ $checked?: boolean }>`
  flex: 0 0 22px;
  width: 22px;
  height: 22px;
  border: 1px solid ${token.colors.primary.primary50};
  border-radius: ${token.shapes.circle};
  background: ${({ $checked }) =>
    $checked ? token.colors.primary.primary50 : token.colors.white};
  box-shadow: ${({ $checked }) =>
    $checked ? `inset 0 0 0 3px ${token.colors.white}` : 'none'};

  ${HiddenRadioInput}:focus-visible + & {
    outline: 2px solid ${token.colors.primary.primary40};
    outline-offset: 2px;
  }
`

export const SearchBox = styled.label`
  ${token.flexBetween}
  flex: 0 0 347px;
  height: 38px;
  padding: 0 12px;
  border-radius: ${token.shapes.small};
  background: ${token.colors.gray.gray0};
  color: ${token.colors.gray.gray50};
  line-height: 1;
  ${token.typography('body', 'sm', 'medium')}

  &:focus-within {
    outline: 2px solid ${token.colors.primary.primary40};
    outline-offset: 2px;
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
  flex: 0 0 auto;
  color: ${token.colors.gray.gray40};
  font-size: 18px;
`

const tableColumns = {
  mentor: 'minmax(210px, 1.55fr) repeat(5, minmax(88px, 1fr))',
  question: 'minmax(280px, 1.8fr) repeat(4, minmax(110px, 1fr))',
}

export const TableHeader = styled.div<{ $columns: keyof typeof tableColumns }>`
  display: grid;
  grid-template-columns: ${({ $columns }) => tableColumns[$columns]};
  align-items: center;
  width: 100%;
  min-height: 41px;
  gap: 12px;
  padding: 12px;
  border-radius: ${token.shapes.small};
  background: ${token.colors.gray.gray0};
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
  min-height: 49px;
  gap: 12px;
  padding: 12px;
  border-radius: ${token.shapes.medium};
  background: ${({ $active }) => ($active ? token.colors.gray.gray0 : token.colors.white)};
  text-align: center;
  transition:
    background-color 120ms ease,
    transform 120ms ease;

  &:hover,
  &:focus-visible {
    background: ${token.colors.gray.gray0};
  }

  &:focus-visible {
    outline: 2px solid ${token.colors.primary.primary40};
    outline-offset: 2px;
  }
`

export const TableCell = styled.span`
  color: ${token.colors.gray.gray100};
  line-height: 1;
  ${token.typography('body', 'sm', 'medium')}
`

export const MentorCell = styled.span`
  ${token.flexLeft}
  gap: 10px;
  min-width: 0;
  text-align: left;
`

export const MentorProfile = styled.span<{ $size?: 'xs' | 'sm' | 'lg' }>`
  flex: 0 0 ${({ $size }) => ($size === 'lg' ? '50px' : $size === 'sm' ? '32px' : $size === 'xs' ? '25px' : '25px')};
  width: ${({ $size }) => ($size === 'lg' ? '50px' : $size === 'sm' ? '32px' : $size === 'xs' ? '25px' : '25px')};
  height: ${({ $size }) => ($size === 'lg' ? '50px' : $size === 'sm' ? '32px' : $size === 'xs' ? '25px' : '25px')};
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
  color: ${({ $status }) => statusColor[$status]};
  line-height: 1;
  text-align: center;
  white-space: nowrap;
  ${token.typography('body', 'sm', 'medium')}
`

export const DetailHeader = styled.section`
  ${token.flexLeft}
  gap: 40px;
  width: 100%;

  ${MentorCell} {
    flex: 0 0 171px;
  }

`

export const DetailMetrics = styled.div`
  display: grid;
  grid-template-columns: repeat(5, minmax(96px, 1fr));
  flex: 1 1 auto;
  align-items: center;
  min-width: 0;
`

export const DetailMetric = styled.div`
  ${token.flexColumnCenter}
  gap: 10px;
  min-width: 0;
  text-align: center;
`

export const DetailMetricLabel = styled.span`
  color: ${token.colors.gray.gray50};
  line-height: 1;
  white-space: nowrap;
  ${token.typography('body', 'sm', 'medium')}
`

export const DetailMetricValue = styled.strong`
  color: ${token.colors.gray.gray100};
  line-height: 1;
  white-space: nowrap;
  ${token.typography('body', 'md', 'semibold')}
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

export const ChatPanel = styled.aside`
  ${token.flexColumnStart}
  position: absolute;
  top: 0;
  right: 0;
  width: 460px;
  height: 100dvh;
  gap: 28px;
  padding: 24px 16px;
  overflow: hidden;
  background: ${token.colors.gray.gray0};
  box-shadow: 0 4px 12.6px rgb(0 0 0 / 12%);
  z-index: 2;

  @media (max-width: 1180px) {
    position: fixed;
    width: min(460px, 100vw);
  }
`

export const ClosePanelButton = styled.button`
  color: ${token.colors.gray.gray30};
  font-size: 32px;
  line-height: 22px;
`

export const ChatPanelHeader = styled.header`
  ${token.flexColumnStart}
  gap: 12px;
  width: 100%;
`

export const ChatPanelTitle = styled.h2`
  color: #404040;
  line-height: 1.2;
  ${token.typography('heading', 'sm', 'bold')}
`

export const ChatTimestamp = styled.p`
  color: ${token.colors.gray.gray30};
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

export const MessageStack = styled.div`
  ${token.flexColumnStart}
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
  ${token.typography('body', 'md', 'medium')}
`

export const ChatMeta = styled.span<{ $align?: 'right' }>`
  width: 100%;
  color: ${token.colors.gray.gray20};
  line-height: 1;
  text-align: ${({ $align }) => ($align === 'right' ? 'right' : 'left')};
  ${token.typography('caption', 'md', 'medium')}
`
