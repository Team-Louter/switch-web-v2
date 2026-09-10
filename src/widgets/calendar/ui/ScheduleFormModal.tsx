import type { FormEvent } from 'react'

import type { Member } from '@/shared/types/member'
import { Button, Modal } from '@/shared/ui'

import type { ScheduleFormValues } from '../model/types'
import { useScheduleForm } from '../model/useScheduleForm'

import { ScheduleColorPicker } from './ScheduleColorPicker'
import { ScheduleDateField } from './ScheduleDateField'
import {
  FieldGroup,
  FieldRow,
  FormBody,
  ModalFooter,
  ModalForm,
  ModalHeader,
  ModalTitle,
  TextArea,
  TextInput,
} from './ScheduleModal.style'
import { ScheduleMemberDropdown } from './ScheduleMemberDropdown'

type ScheduleFormModalProps = {
  mode: 'create' | 'edit'
  initialValues: ScheduleFormValues
  members: Member[]
  onSubmit: (values: ScheduleFormValues) => void
  onClose: () => void
  onDelete?: () => void
}

const MODAL_TEXTS = {
  create: { title: '일정 추가', submit: '추가' },
  edit: { title: '일정 수정', submit: '저장' },
} as const

export function ScheduleFormModal({
  mode,
  initialValues,
  members,
  onSubmit,
  onClose,
  onDelete,
}: ScheduleFormModalProps) {
  const { values, handleValueChange, isSubmittable } =
    useScheduleForm(initialValues)
  const texts = MODAL_TEXTS[mode]

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (isSubmittable) {
      onSubmit(values)
    }
  }

  return (
    <Modal label={texts.title} onClose={onClose}>
      <ModalForm onSubmit={handleFormSubmit}>
        <ModalHeader>
          <ModalTitle>{texts.title}</ModalTitle>
          {onDelete && (
            <Button size="sm" variant="danger" onClick={onDelete}>
              삭제
            </Button>
          )}
        </ModalHeader>

        <FormBody>
          <FieldGroup>
            <TextInput
              aria-label="일정 제목"
              placeholder="제목을 입력해주세요."
              value={values.title}
              onChange={(event) =>
                handleValueChange('title', event.target.value)
              }
            />
            <TextArea
              aria-label="일정 내용"
              placeholder="내용을 입력해주세요."
              value={values.content}
              onChange={(event) =>
                handleValueChange('content', event.target.value)
              }
            />
          </FieldGroup>

          <FieldGroup>
            <FieldRow>
              <ScheduleDateField
                label="일정 시작일"
                suffix="부터"
                value={values.startDate}
                onChange={(value) => handleValueChange('startDate', value)}
              />
              <ScheduleDateField
                label="일정 종료일"
                suffix="까지"
                value={values.endDate}
                onChange={(value) => handleValueChange('endDate', value)}
              />
            </FieldRow>

            <ScheduleMemberDropdown
              members={members}
              value={values.userIds}
              onChange={(userIds) => handleValueChange('userIds', userIds)}
            />
          </FieldGroup>

          <ScheduleColorPicker
            value={values.color}
            onChange={(color) => handleValueChange('color', color)}
          />
        </FormBody>

        <ModalFooter>
          <Button size="md" variant="neutral" fullWidth onClick={onClose}>
            취소
          </Button>
          <Button size="md" type="submit" fullWidth disabled={!isSubmittable}>
            {texts.submit}
          </Button>
        </ModalFooter>
      </ModalForm>
    </Modal>
  )
}
