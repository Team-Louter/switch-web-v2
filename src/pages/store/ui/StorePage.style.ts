import styled, { css } from 'styled-components'

import { UserName } from '@/entities/user'
import * as token from '@/shared/styles/values/token'

import { StoreItemImage } from './components/StoreItemImage'

import type { StoreEffectStatus, StoreEffectType } from '../types'

export const Page = styled.section`
  ${token.flexColumn}
  align-items: center;
  box-sizing: border-box;
  min-height: 100dvh;
  min-width: 970px;
  padding: 50px 30px 80px;
  overflow: hidden;
  background: ${token.colors.white};
`

export const Content = styled.div`
  ${token.flexColumn}
  gap: 40px;
  width: 910px;
`

export const Toolbar = styled.div`
  ${token.flexRow}
  align-items: center;
  gap: 10px;
  box-sizing: border-box;
  width: 100%;
  padding: 6px;
  overflow: hidden;
  border-radius: ${token.shapes.xlarge};
  background: ${token.colors.gray.gray0};
`

export const FilterBar = styled.div`
  ${token.flexRow}
  align-items: center;
  gap: 10px;
  flex: 0 0 auto;
`

export const FilterButton = styled.button<{ $isActive: boolean }>`
  ${token.flexCenter}
  flex: 0 0 auto;
  padding: 12px;
  border-radius: ${token.shapes.large};
  color: ${({ $isActive }) =>
    $isActive ? token.colors.gray.gray90 : token.colors.gray.gray50};
  background: ${({ $isActive }) =>
    $isActive ? token.colors.white : 'transparent'};
  ${token.typography('body', 'lg', 'medium')}
  transition:
    background-color 120ms ease,
    color 120ms ease,
    transform 120ms ease;

  &:hover {
    color: ${token.colors.gray.gray100};
    transform: translateY(-1px);
  }
`

export const PointButton = styled.button`
  ${token.flexRow}
  align-items: center;
  gap: 15px;
  flex: 0 0 auto;
  margin-left: auto;
  padding: 12px;
  color: ${token.colors.primary.primary70};
`

export const PointTextGroup = styled.span`
  ${token.flexRow}
  align-items: center;
  gap: 5px;
  color: ${token.colors.primary.primary70};
  ${token.typography('body', 'lg', 'medium')}

  svg {
    color: ${token.colors.primary.primary60};
  }
`

export const PointValue = styled.span`
  color: ${token.colors.primary.primary100};
  ${token.typography('body', 'lg', 'medium')}
`

export const IconButton = styled.span`
  ${token.flexCenter}
  width: 20px;
  height: 20px;
  color: ${token.colors.gray.gray50};
`

export const Section = styled.section`
  ${token.flexColumn}
  gap: 20px;
  width: 100%;
`

export const EffectSections = styled.div`
  ${token.flexColumn}
  gap: 24px;
  width: 100%;
`

export const FeedbackMessage = styled.p`
  margin: 0;
  color: ${token.colors.gray.gray50};
  ${token.typography('body', 'sm', 'medium')}
`

export const SectionTitle = styled.h2`
  margin: 0;
  color: ${token.colors.gray.gray80};
  ${token.typography('body', 'lg', 'medium')}
`

export const CardGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  align-content: flex-start;
  gap: 10px;
  width: 100%;
`

export const CategoryGroups = styled.div`
  ${token.flexColumn}
  align-items: flex-start;
  gap: 24px;
  width: 100%;
`

export const CategoryGroup = styled.div`
  ${token.flexColumn}
  align-items: flex-start;
  gap: 10px;
  width: 100%;
`

export const CategoryTitle = styled.p`
  margin: 0;
  color: ${token.colors.gray.gray50};
  ${token.typography('caption', 'lg', 'medium')}
`

const cardHoverButtonStyle = css`
  background: ${token.colors.primary.primary50};
  color: ${token.colors.gray.gray100};
`

export const EffectCard = styled.article`
  ${token.flexColumn}
  box-sizing: border-box;
  align-items: flex-start;
  justify-content: space-between;
  width: 220px;
  height: 230px;
  padding: 20px;
  border: 1px solid ${token.colors.gray.gray10};
  border-radius: ${token.shapes.large};
  background: ${token.colors.white};
  transition:
    border-color 120ms ease,
    box-shadow 120ms ease,
    transform 120ms ease;

  &:hover {
    border-color: ${token.colors.primary.primary30};
    box-shadow: 0 8px 20px rgb(14 13 12 / 8%);
    transform: translateY(-2px);
  }
`

export const EffectPreview = styled.div<{ $type: StoreEffectType }>`
  ${token.flexCenter}
  position: relative;
  overflow: hidden;
  width: 180px;
  height: 130px;
  border-radius: ${token.shapes.medium};
  background: ${({ $type }) =>
    $type === 'outline' ? 'transparent' : token.colors.gray.gray0};
  transition: height 120ms ease;

  ${EffectCard}:hover & {
    height: 120px;
  }
`

export const EffectPreviewText = styled(UserName)`
  font-family: ${token.fontFamily.system};
  font-size: ${token.fontSize.heading.lg};
  white-space: nowrap;
`

export const EffectOutlinePreview = styled.div`
  ${token.flexCenter}
  width: 130px;
  height: 130px;
  box-sizing: border-box;
  border: 12px solid ${token.colors.primary.primary50};
  border-radius: ${token.shapes.circle};
  color: ${token.colors.gray.gray30};
  ${token.typography('body', 'md', 'semibold')}
  transition:
    width 120ms ease,
    height 120ms ease,
    border-width 120ms ease;

  ${EffectCard}:hover & {
    width: 120px;
    height: 120px;
    border-width: 10px;
  }
`

export const EffectImage = styled(StoreItemImage)<{
  $hasHoverImage?: boolean
  $isHoverImage?: boolean
}>`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  opacity: ${({ $isHoverImage }) => ($isHoverImage ? 0 : 1)};
  transition: opacity 120ms ease;

  ${EffectCard}:hover & {
    opacity: ${({ $hasHoverImage, $isHoverImage }) =>
      $isHoverImage || !$hasHoverImage ? 1 : 0};
  }
`

export const EffectPreviewPlaceholder = styled.p`
  margin: 0;
  color: ${token.colors.gray.gray50};
  text-align: center;
  word-break: keep-all;
  ${token.typography('body', 'sm', 'medium')}
`

export const EffectTextGroup = styled.div`
  ${token.flexColumn}
  align-items: flex-start;
  gap: 4px;
  width: 100%;
`

export const EffectTitle = styled.p`
  margin: 0;
  color: ${token.colors.gray.gray100};
  ${token.typography('body', 'sm', 'medium')}
`

export const EffectConditionText = styled.p`
  width: 100%;
  margin: 0;
  overflow: hidden;
  color: ${token.colors.gray.gray50};
  text-overflow: ellipsis;
  white-space: nowrap;
  ${token.typography('caption', 'md', 'medium')}
`

export const CardActionArea = styled.div`
  position: relative;
  width: 100%;
  height: 17px;
  transition: height 120ms ease;

  ${EffectCard}:hover & {
    height: 33px;
  }
`

export const StatusText = styled.p<{ $status: StoreEffectStatus }>`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  position: absolute;
  inset: 0;
  margin: 0;
  color: ${({ $status }) =>
    $status === 'equipped'
      ? token.colors.primary.primary60
      : token.colors.gray.gray50};
  ${token.typography('body', 'sm', 'semibold')}
  opacity: 1;
  transition: opacity 120ms ease;

  ${EffectCard}:hover & {
    opacity: 0;
  }
`

export const PriceRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  position: absolute;
  inset: 0;
  gap: 2px;
  color: ${token.colors.primary.primary70};
  ${token.typography('body', 'sm', 'semibold')}
  opacity: 1;
  transition: opacity 120ms ease;

  svg {
    color: ${token.colors.primary.primary60};
  }

  ${EffectCard}:hover & {
    opacity: 0;
  }
`

export const CardButton = styled.button<{ $isDanger?: boolean }>`
  ${token.flexCenter}
  position: absolute;
  inset: 0;
  gap: 4px;
  border-radius: ${token.shapes.small};
  color: ${({ $isDanger }) =>
    $isDanger ? token.colors.danger.danger20 : token.colors.primary.primary90};
  ${token.typography('body', 'sm', 'medium')}
  opacity: 0;
  pointer-events: none;
  transition:
    background-color 120ms ease,
    opacity 120ms ease,
    transform 120ms ease;
  ${cardHoverButtonStyle}

  svg {
    color: ${token.colors.primary.primary60};
  }

  ${EffectCard}:hover & {
    opacity: 1;
    pointer-events: auto;
  }

  &:hover {
    background: ${token.colors.primary.primary60};
    transform: translateY(-1px);
  }

  &:disabled {
    cursor: not-allowed;
  }

  ${EffectCard}:hover &:disabled {
    opacity: 0.5;
  }
`

export const EmptyGridMessage = styled.p`
  grid-column: 1 / -1;
  margin: 0;
  padding: 48px 0;
  color: ${token.colors.gray.gray50};
  text-align: center;
  ${token.typography('body', 'sm', 'medium')}
`

export const Overlay = styled.div`
  ${token.flexCenter}
  position: fixed;
  inset: 0;
  z-index: 20;
  padding: 40px;
  background: rgb(14 13 12 / 70%);
`

export const Modal = styled.div`
  ${token.flexColumn}
  gap: 20px;
  box-sizing: border-box;
  width: 454px;
  max-height: calc(100dvh - 80px);
  margin: 0;
  padding: 30px;
  overflow: auto;
  border: 0;
  border-radius: ${token.shapes.large};
  background: ${token.colors.white};
  box-shadow: 0 20px 60px rgb(14 13 12 / 18%);
`

export const ModalHeader = styled.header`
  ${token.flexRow}
  align-items: center;
  justify-content: space-between;
  width: 100%;
`

export const ModalTitle = styled.h2`
  margin: 0;
  color: ${token.colors.gray.gray80};
  ${token.typography('heading', 'md', 'medium')}
`

export const CloseButton = styled.button`
  ${token.flexCenter}
  width: 24px;
  height: 24px;
  color: ${token.colors.gray.gray50};
`

export const PreviewSection = styled.div`
  ${token.flexColumn}
  align-items: center;
  gap: 20px;
  width: 100%;
`

export const ProfilePreview = styled.div`
  ${token.flexCenter}
  width: 200px;
  height: 200px;
  overflow: hidden;
  border-radius: ${token.shapes.circle};
  background: ${token.colors.gray.gray0};
`

export const PreviewImage = styled(StoreItemImage)`
  width: 100%;
  height: 100%;
  object-fit: contain;
`

export const PreviewName = styled(UserName)`
  font-family: ${token.fontFamily.system};
  font-size: ${token.fontSize.heading.xl};
`

export const PurchaseEffectTitle = styled.p`
  margin: 0;
  color: ${token.colors.gray.gray100};
  ${token.typography('heading', 'md', 'medium')}
`

export const ConditionList = styled.div`
  ${token.flexColumn}
  gap: 10px;
  width: 100%;
`

export const ConditionFirstRow = styled.div`
  ${token.flexRow}
  align-items: flex-start;
  justify-content: space-between;
  width: 100%;
`

export const ConditionRow = styled.div`
  ${token.flexRight}
  width: 100%;
`

export const ConditionText = styled.p`
  margin: 0;
  color: ${token.colors.primary.primary70};
  ${token.typography('body', 'lg', 'medium')}
`

export const PointSummary = styled.div`
  ${token.flexRow}
  justify-content: space-between;
  width: 100%;
  color: ${token.colors.gray.gray50};
  ${token.typography('body', 'lg', 'medium')}
`

export const ModalButton = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  ${token.flexCenter}
  flex: 1 1 0;
  gap: 4px;
  min-width: 0;
  padding: 10px 20px;
  border-radius: ${token.shapes.small};
  color: ${token.colors.gray.gray100};
  background: ${({ $variant = 'primary' }) =>
    $variant === 'primary'
      ? token.colors.primary.primary50
      : token.colors.gray.gray10};
  ${token.typography('body', 'md', 'medium')}
  transition:
    background-color 120ms ease,
    color 120ms ease,
    transform 120ms ease;

  &:hover:not(:disabled) {
    background: ${({ $variant = 'primary' }) =>
      $variant === 'primary'
        ? token.colors.primary.primary60
        : token.colors.gray.gray20};
    transform: translateY(-1px);
  }

  &:disabled {
    color: ${token.colors.gray.gray50};
    background: ${token.colors.gray.gray10};
    cursor: not-allowed;
    opacity: 0.5;
  }

  svg {
    color: ${token.colors.primary.primary60};
  }
`

export const ModalButtonRow = styled.div`
  ${token.flexRow}
  gap: 10px;
  width: 100%;
`


export const CustomizeModal = styled.div`
  ${token.flexColumn}
  gap: 20px;
  box-sizing: border-box;
  width: 1000px;
  height: min(700px, calc(100dvh - 80px));
  padding: 30px;
  overflow: hidden;
  border-radius: ${token.shapes.large};
  background: ${token.colors.white};
  box-shadow: 0 20px 60px rgb(14 13 12 / 18%);
`

export const CustomizeBody = styled.div`
  ${token.flexRow}
  align-items: flex-start;
  gap: 20px;
  min-height: 0;
  width: 100%;
  height: 100%;
`

export const CustomizeTabList = styled.div`
  ${token.flexColumn}
  gap: 10px;
  flex: 0 0 200px;
  height: 100%;
  overflow: hidden;
`

export const CustomizeTabButton = styled.button<{ $isActive: boolean }>`
  width: 100%;
  padding: 15px 20px;
  border-radius: ${token.shapes.medium};
  color: ${({ $isActive }) =>
    $isActive ? token.colors.gray.gray90 : token.colors.gray.gray50};
  text-align: left;
  background: ${({ $isActive }) =>
    $isActive ? token.colors.gray.gray10 : token.colors.white};
  ${token.typography('body', 'lg', 'medium')}
  transition:
    background-color 120ms ease,
    color 120ms ease;

  &:hover {
    color: ${token.colors.gray.gray90};
    background: ${token.colors.gray.gray0};
  }
`

export const CustomizeEffectPanel = styled.div`
  ${token.flexColumn}
  align-items: flex-start;
  gap: 10px;
  flex: 1 1 0;
  min-width: 0;
  min-height: 0;
  height: 100%;
  overflow: hidden;
`

export const CustomizeEffectScrollArea = styled.div`
  ${token.flexColumn}
  align-items: flex-start;
  gap: 10px;
  flex: 1 1 auto;
  min-height: 0;
  width: 100%;
  overflow-y: auto;
`

export const CustomizeSectionTitle = styled.p`
  margin: 0;
  color: ${token.colors.gray.gray80};
  ${token.typography('body', 'lg', 'medium')}
`

export const CustomizeOptionGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  align-items: flex-start;
  gap: 10px;
  width: 350px;
  min-height: 110px;
`

export const CustomizeEffectOption = styled.button<{
  $isLocked: boolean
  $isSelected: boolean
}>`
  ${token.flexCenter}
  position: relative;
  flex-direction: column;
  flex: 0 0 110px;
  width: 110px;
  height: 110px;
  padding: 12px;
  overflow: hidden;
  border: ${({ $isSelected }) =>
    $isSelected
      ? `2px solid ${token.colors.primary.primary50}`
      : '2px solid transparent'};
  border-radius: ${token.shapes.medium};
  background: ${({ $isSelected }) =>
    $isSelected ? token.colors.white : token.colors.gray.gray0};
  transition:
    border-color 120ms ease,
    background-color 120ms ease,
    transform 120ms ease;

  &:hover:not(:disabled) {
    border-color: ${token.colors.primary.primary40};
    transform: translateY(-1px);
  }

  &:disabled {
    cursor: not-allowed;
  }
`

export const CustomizeNonePreview = styled.span`
  ${token.flexColumn}
  align-items: center;
  gap: 6px;
  color: ${token.colors.gray.gray70};
`

export const CustomizeNoneIcon = styled.span`
  ${token.flexCenter}
  width: 28px;
  height: 28px;
  border: 2px solid ${token.colors.gray.gray40};
  border-radius: ${token.shapes.circle};
  color: ${token.colors.gray.gray40};
  ${token.typography('body', 'lg', 'semibold')}
`

export const CustomizeNoneLabel = styled.span`
  color: ${token.colors.gray.gray70};
  ${token.typography('caption', 'lg', 'medium')}
`

export const CustomizeOptionImage = styled(StoreItemImage)`
  width: 100%;
  height: 100%;
  object-fit: contain;
`

export const CustomizeNameSample = styled(UserName)`
  font-family: ${token.fontFamily.system};
  font-size: ${token.fontSize.body.lg};
  white-space: nowrap;
`

export const CustomizeOptionText = styled.span`
  color: ${token.colors.gray.gray70};
  text-align: center;
  word-break: keep-all;
  ${token.typography('body', 'sm', 'medium')}
`

export const CustomizeLockOverlay = styled.div`
  ${token.flexCenter}
  position: absolute;
  inset: 0;
  border-radius: ${token.shapes.medium};
  background: rgb(255 255 255 / 70%);
`

export const CustomizeEmptyText = styled.p`
  margin: 0;
  padding: 20px 0;
  color: ${token.colors.gray.gray50};
  ${token.typography('body', 'sm', 'medium')}
`

export const CustomizeStoreButton = styled.button`
  ${token.flexCenter}
  width: 100%;
  flex-shrink: 0;
  padding: 10px 20px;
  border: 1px solid ${token.colors.primary.primary80};
  border-radius: ${token.shapes.small};
  color: ${token.colors.primary.primary80};
  ${token.typography('body', 'md', 'medium')}
  transition:
    border-color 120ms ease,
    color 120ms ease,
    transform 120ms ease;

  &:hover {
    border-color: ${token.colors.primary.primary60};
    color: ${token.colors.primary.primary60};
    transform: translateY(-1px);
  }
`

export const CustomizePreviewPanel = styled.div`
  ${token.flexColumn}
  align-items: stretch;
  justify-content: space-between;
  flex: 1 1 0;
  min-width: 0;
  height: 100%;
`

export const CustomizePreviewTop = styled.div`
  ${token.flexColumn}
  align-items: center;
  gap: 20px;
  width: 100%;
`

export const CustomizePreviewTextGroup = styled.div`
  ${token.flexColumn}
  align-items: center;
  gap: 10px;
  width: 100%;
`
export const CustomizePreviewTitle = styled.p`
  margin: 0;
  color: #FFA20A;
  ${token.typography('body', 'lg', 'regular')}
`

export const CustomizePreviewName = styled(UserName)`
  font-family: ${token.fontFamily.system};
  font-size: ${token.fontSize.heading.xl};
`

export const CustomizePreviewDescription = styled.p`
  margin: 0;
  color: ${token.colors.gray.gray60};
  text-align: center;
  ${token.typography('body', 'lg', 'regular')}
`

export const CustomizeActionGroup = styled.div`
  ${token.flexColumn}
  gap: 10px;
  width: 100%;
`

export const PointHistoryList = styled.div`
  ${token.flexColumn}
  width: 100%;
`

export const PointHistoryRow = styled.div`
  ${token.flexRow}
  align-items: center;
  justify-content: space-between;
  min-height: 56px;
  width: 100%;
`

export const PointHistoryInfo = styled.div`
  ${token.flexColumn}
  gap: 6px;
`

export const PointHistoryTitle = styled.p`
  margin: 0;
  color: ${token.colors.gray.gray100};
  ${token.typography('body', 'md', 'medium')}
`

export const PointHistoryDescription = styled.p`
  margin: 0;
  color: ${token.colors.gray.gray40};
  ${token.typography('caption', 'lg', 'medium')}
`

export const PointHistoryAmount = styled.p<{ $isPositive: boolean }>`
  margin: 0;
  color: ${({ $isPositive }) =>
    $isPositive ? token.colors.primary.primary60 : token.colors.danger.danger20};
  ${token.typography('body', 'md', 'medium')}
`
