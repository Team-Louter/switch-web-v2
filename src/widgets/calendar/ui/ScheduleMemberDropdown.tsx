import { useEffect, useMemo, useRef, useState } from 'react'

import chevronDownIcon from '@/shared/assets/calendar/chevron-down.svg'
import type { Member } from '@/shared/types/member'

import {
  MemberDropdown,
  MemberDropdownButton,
  MemberDropdownIcon,
  MemberDropdownMenu,
  MemberGenerationButton,
  MemberGroup,
  MemberItemButton,
  MemberList,
} from './ScheduleModal.style'

type ScheduleMemberDropdownProps = {
  members: Member[]
  value: number[]
  onChange: (userIds: number[]) => void
}

export function ScheduleMemberDropdown({
  members,
  value,
  onChange,
}: ScheduleMemberDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [expandedGenerations, setExpandedGenerations] = useState<number[]>([])
  const containerRef = useRef<HTMLDivElement>(null)
  const membersByGeneration = useMemo(() => {
    const grouped = new Map<number, Member[]>()

    members.forEach((member) => {
      const generation = member.generation ?? 0
      grouped.set(generation, [...(grouped.get(generation) ?? []), member])
    })

    return [...grouped.entries()].sort(([left], [right]) => left - right)
  }, [members])

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [])

  const toggleMember = (userId: number) => {
    onChange(
      value.includes(userId)
        ? value.filter((selectedId) => selectedId !== userId)
        : [...value, userId],
    )
  }

  const toggleGeneration = (generationMembers: Member[]) => {
    const generationIds = generationMembers.map(({ userId }) => userId)
    const isFullySelected = generationIds.every((userId) => value.includes(userId))

    onChange(
      isFullySelected
        ? value.filter((userId) => !generationIds.includes(userId))
        : [...new Set([...value, ...generationIds])],
    )
  }

  const selectedNames = members
    .filter(({ userId }) => value.includes(userId))
    .map(({ userName }) => userName)

  return (
    <MemberDropdown ref={containerRef}>
      <MemberDropdownButton
        type="button"
        $hasValue={value.length > 0}
        onClick={() => setIsOpen((previous) => !previous)}
      >
        {selectedNames.length > 0 ? selectedNames.join(', ') : '담당자 선택'}
        <MemberDropdownIcon src={chevronDownIcon} alt="" $isOpen={isOpen} />
      </MemberDropdownButton>

      {isOpen && (
        <MemberDropdownMenu>
          {membersByGeneration.map(([generation, generationMembers]) => {
            const isExpanded = expandedGenerations.includes(generation)
            const isFullySelected = generationMembers.every(({ userId }) =>
              value.includes(userId),
            )

            return (
              <MemberGroup key={generation}>
                <MemberGenerationButton
                  type="button"
                  $selected={isFullySelected}
                  onClick={() => toggleGeneration(generationMembers)}
                >
                  {generation === 0 ? '기수 미지정' : `${generation}기`}
                </MemberGenerationButton>
                <MemberDropdownIcon
                  src={chevronDownIcon}
                  alt=""
                  $isOpen={isExpanded}
                  onClick={() =>
                    setExpandedGenerations((previous) =>
                      isExpanded
                        ? previous.filter((item) => item !== generation)
                        : [...previous, generation],
                    )
                  }
                />
                {isExpanded && (
                  <MemberList>
                    {generationMembers.map((member) => (
                      <MemberItemButton
                        key={member.userId}
                        type="button"
                        $selected={value.includes(member.userId)}
                        onClick={() => toggleMember(member.userId)}
                      >
                        {member.userName}
                      </MemberItemButton>
                    ))}
                  </MemberList>
                )}
              </MemberGroup>
            )
          })}
        </MemberDropdownMenu>
      )}
    </MemberDropdown>
  )
}
