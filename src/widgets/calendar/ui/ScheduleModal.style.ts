import styled from 'styled-components'

import { UNSELECTED_SWATCH_OPACITY } from '@/shared/constants/calendar'
import * as token from '@/shared/styles/values/token'

const FIELD_HEIGHT = '44px'
const TEXTAREA_HEIGHT = '98px'
const DATE_INPUT_WIDTH = '108px' // "YYYY-MM-DD" 한 줄이 들어가는 너비

/* 공통 */

export const ModalSection = styled.div`
  ${token.flexColumnStart}
  flex: 0 0 auto;
  width: 100%;
`

export const ModalHeader = styled.div`
  ${token.flexBetween}
  align-items: flex-start;
  flex: 0 0 auto;
  width: 100%;
`

export const ModalTitle = styled.h2`
  color: ${token.colors.gray.gray80};
  line-height: 1;
  ${token.typography('heading', 'md', 'medium')}
`

export const ModalFooter = styled.div`
  ${token.flexLeft}
  flex: 0 0 auto;
  width: 100%;
  gap: 10px;
`

export const ModalForm = styled.form`
  ${token.flexColumnStart}
  width: 100%;
  gap: 32px;
`

/* 폼 (일정 추가 / 일정 수정) */

export const FormBody = styled.div`
  ${token.flexColumnStart}
  flex: 0 0 auto;
  width: 100%;
  gap: 16px;
`

export const FieldGroup = styled.div`
  ${token.flexColumnStart}
  flex: 0 0 auto;
  width: 100%;
  gap: 8px;
`

export const FieldRow = styled.div`
  ${token.flexLeft}
  align-items: stretch;
  flex: 0 0 auto;
  width: 100%;
  gap: 8px;
`

const fieldBoxStyle = `
  box-sizing: border-box;
  width: 100%;
  border-radius: 8px;
`

export const TextInput = styled.input`
  ${fieldBoxStyle}
  height: ${FIELD_HEIGHT};
  padding: 10px 12px;
  border: 0;
  outline: 0;
  color: ${token.colors.gray.gray90};
  background: ${token.colors.gray.gray0};
  ${token.typography('body', 'md', 'medium')}

  &::placeholder {
    color: ${token.colors.gray.gray30};
  }

  &:focus-visible {
    outline: 2px solid ${token.colors.primary.primary40};
    outline-offset: -2px;
  }
`

export const TextArea = styled.textarea`
  ${fieldBoxStyle}
  height: ${TEXTAREA_HEIGHT};
  padding: 10px 12px;
  border: 0;
  outline: 0;
  resize: none;
  color: ${token.colors.gray.gray90};
  background: ${token.colors.gray.gray0};
  line-height: 1.4;
  ${token.typography('body', 'md', 'medium')}

  &::placeholder {
    color: ${token.colors.gray.gray30};
  }

  &:focus-visible {
    outline: 2px solid ${token.colors.primary.primary40};
    outline-offset: -2px;
  }
`

export const DateField = styled.div`
  ${token.flexBetween}
  ${fieldBoxStyle}
  flex: 1 1 0;
  min-width: 0;
  height: ${FIELD_HEIGHT};
  overflow: hidden;
  padding: 10px 12px;
  background: ${token.colors.gray.gray0};
  cursor: pointer;

  &:focus-within {
    outline: 2px solid ${token.colors.primary.primary40};
    outline-offset: -2px;
  }
`

export const DateValue = styled.span`
  ${token.flexLeft}
  min-width: 0;
`

/* 값이 없을 때 브라우저 기본 표시("yyyy-mm-dd")를 디자인과 같은 대문자로 보여줍니다. */
export const DateInput = styled.input<{ $hasValue: boolean }>`
  width: ${DATE_INPUT_WIDTH};
  padding: 0;
  border: 0;
  outline: 0;
  color: ${({ $hasValue }) =>
    $hasValue ? token.colors.gray.gray90 : token.colors.gray.gray30};
  background: transparent;
  text-transform: uppercase;
  ${token.typography('body', 'md', 'medium')}

  &::-webkit-calendar-picker-indicator {
    display: none;
  }
`

export const DateSuffix = styled.span<{ $hasValue: boolean }>`
  color: ${({ $hasValue }) =>
    $hasValue ? token.colors.gray.gray90 : token.colors.gray.gray30};
  white-space: nowrap;
  ${token.typography('body', 'md', 'medium')}
`

export const FieldIcon = styled.img`
  flex: 0 0 20px;
  width: 20px;
  height: 20px;
`

export const SelectField = styled.div`
  position: relative;
  flex: 0 0 auto;
  width: 100%;
`

export const MemberSelect = styled.select<{ $hasValue: boolean }>`
  ${fieldBoxStyle}
  height: ${FIELD_HEIGHT};
  padding: 10px 40px 10px 12px;
  border: 0;
  outline: 0;
  appearance: none;
  color: ${({ $hasValue }) =>
    $hasValue ? token.colors.gray.gray90 : token.colors.gray.gray30};
  background: ${token.colors.gray.gray0};
  cursor: pointer;
  ${token.typography('body', 'md', 'medium')}

  &:focus-visible {
    outline: 2px solid ${token.colors.primary.primary40};
    outline-offset: -2px;
  }
`

/* 9x16 화살표를 90도 회전해 아래를 향하게 합니다. (회전 후 시각적 크기는 16x9) */
export const SelectIcon = styled.img`
  position: absolute;
  top: 50%;
  right: 15px;
  width: 9px;
  height: 16px;
  transform: translateY(-50%) rotate(90deg);
  pointer-events: none;
`

export const ColorSwatchList = styled.div`
  ${token.flexLeft}
  flex: 0 0 auto;
  gap: 11.25px;
  padding: 12px;
  border-radius: 8px;
  background: ${token.colors.gray.gray0};
`

export const ColorSwatch = styled.button<{ $color: string; $selected: boolean }>`
  flex: 0 0 20px;
  width: 20px;
  height: 20px;
  border-radius: ${token.shapes.circle};
  opacity: ${({ $selected }) => ($selected ? 1 : UNSELECTED_SWATCH_OPACITY)};
  background: ${({ $color }) => $color};
  transition: opacity 120ms ease;

  &:hover {
    opacity: 1;
  }

  &:focus-visible {
    outline: 2px solid ${token.colors.gray.gray70};
    outline-offset: 2px;
  }
`

/* 세부 조회 */

/* 남는 높이를 차지해 하단 버튼을 카드 아래쪽에 붙입니다. */
export const DetailBody = styled.div`
  ${token.flexColumnStart}
  flex: 1 1 auto;
  width: 100%;
  gap: 36px;
`

export const DetailHeading = styled.div`
  ${token.flexColumnStart}
  flex: 0 0 auto;
  width: 100%;
  gap: 12px;
`

export const DetailContent = styled.p`
  color: ${token.colors.gray.gray90};
  line-height: 1.4;
  word-break: break-word;
  ${token.typography('body', 'lg', 'regular')}
`

export const DetailPeriod = styled.div`
  ${token.flexLeft}
  flex: 0 0 auto;
  gap: 12px;
`

export const DetailPeriodText = styled.span`
  color: ${token.colors.gray.gray90};
  line-height: 1;
  ${token.typography('body', 'lg', 'regular')}
`

export const DetailFooter = styled.div`
  ${token.flexRight}
  flex: 0 0 auto;
  width: 100%;
`

export const DetailFooterGroup = styled.div`
  ${token.flexLeft}
  width: 326px;
  max-width: 100%;
  gap: 10px;
`
