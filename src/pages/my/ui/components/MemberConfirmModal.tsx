import * as S from './MemberConfirmModal.style'

import type {
  ManagedMember,
  MemberConfirmAction,
} from '../../model/memberManagementModel'

type MemberConfirmModalProps = {
  action: MemberConfirmAction
  member: ManagedMember
  onCancel: () => void
  onConfirm: () => void
}

const confirmTextByAction: Record<MemberConfirmAction, string> = {
  mentor: '지정',
  mentee: '변경',
  leader: '지정',
  remove: '퇴출',
}

const titleByAction: Record<MemberConfirmAction, (name: string) => string> = {
  mentor: (name) => `${name}을 멘토로 지정할까요?`,
  mentee: (name) => `${name}을 멘티로 변경할까요?`,
  leader: (name) => `${name}을 부장으로 지정할까요?`,
  remove: (name) => `${name}을 동아리에서 퇴출할까요?`,
}

export function MemberConfirmModal({
  action,
  member,
  onCancel,
  onConfirm,
}: MemberConfirmModalProps) {
  const isRemoveAction = action === 'remove'

  return (
    <S.Scrim>
      <S.Card role="dialog" aria-modal="true">
        <S.Title>{titleByAction[action](member.name)}</S.Title>
        <S.Actions>
          <S.Button type="button" onClick={onCancel}>
            취소
          </S.Button>
          <S.Button
            type="button"
            $variant={isRemoveAction ? 'danger' : 'primary'}
            onClick={onConfirm}
          >
            {confirmTextByAction[action]}
          </S.Button>
        </S.Actions>
      </S.Card>
    </S.Scrim>
  )
}
