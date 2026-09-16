import * as S from './MemberKebabMenu.style'

import type { MemberConfirmAction } from '../../model/memberManagementModel'

type MemberKebabMenuProps = {
  onCopyEmail: () => void
  onSelectAction: (action: MemberConfirmAction) => void
}

export function MemberKebabMenu({
  onCopyEmail,
  onSelectAction,
}: MemberKebabMenuProps) {
  return (
    <S.Menu>
      <S.MenuItem type="button" onClick={onCopyEmail}>
        이메일 복사
      </S.MenuItem>
      <S.MenuItem type="button" onClick={() => onSelectAction('mentor')}>
        멘토로 지정하기
      </S.MenuItem>
      <S.Divider />
      <S.MenuItem
        type="button"
        $danger
        onClick={() => onSelectAction('leader')}
      >
        부장으로 지정하기
      </S.MenuItem>
      <S.MenuItem
        type="button"
        $danger
        onClick={() => onSelectAction('remove')}
      >
        동아리에서 퇴출하기
      </S.MenuItem>
    </S.Menu>
  )
}
