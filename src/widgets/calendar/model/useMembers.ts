/**
 * 담당자 선택용 멤버 목록 훅
 */
import { useEffect, useState } from 'react'

import type { Member } from '@/shared/types/member'

import { getMembers } from '../api/memberApi'

export function useMembers() {
  const [members, setMembers] = useState<Member[]>([])

  useEffect(() => {
    let isCancelled = false

    getMembers()
      .then((loadedMembers) => {
        if (!isCancelled) setMembers(loadedMembers)
      })
      .catch(() => {
        // 조회 실패 시 담당자 선택만 비어 있고 일정 확인은 가능하도록 둡니다.
      })

    return () => {
      isCancelled = true
    }
  }, [])

  return { members }
}
