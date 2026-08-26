import { Button } from '@/shared/ui'

import { useMentoringEntryPage } from '../model/useMentoringEntryPage'
import * as S from './MentoringEntryPage.style'

export function MentoringEntryPage() {
  const { handleDashboardClick } = useMentoringEntryPage()

  return (
    <S.Page>
      <S.ActionWrap>
        <Button size="md" onClick={handleDashboardClick}>
          대시보드로 이동
        </Button>
      </S.ActionWrap>
    </S.Page>
  )
}
