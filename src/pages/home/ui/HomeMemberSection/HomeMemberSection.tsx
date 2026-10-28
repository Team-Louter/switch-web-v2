import { useEffect, useMemo, useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { FaGithub, FaLinkedin } from 'react-icons/fa'

import { memberDirectoryOptions, type Member } from '@/entities/member'
import { useUserStore } from '@/entities/profile'
import { UserName } from '@/entities/user'
import { getNameStyleKey } from '@/shared/styles'
import * as S from './HomeMemberSection.style'

const ALL_GENERATIONS = '전체'
const DEFAULT_GENERATIONS = [1, 2, 3]
const MEMBER_BATCH_SIZE = 5

export function HomeMemberSection() {
  const userId = useUserStore((state) => state.user?.userId ?? null)
  const [shouldLoad, setShouldLoad] = useState(false)
  const [visibleCount, setVisibleCount] = useState(MEMBER_BATCH_SIZE)
  const [selectedGeneration, setSelectedGeneration] = useState(ALL_GENERATIONS)
  const [isVisible, setIsVisible] = useState(false)
  const membersQuery = useQuery({
    ...memberDirectoryOptions(userId),
    enabled: shouldLoad && userId !== null,
  })
  const members = useMemo(() => membersQuery.data ?? [], [membersQuery.data])
  const isLoading = shouldLoad && membersQuery.isPending
  const sectionRef = useRef<HTMLElement>(null)
  const loadMoreRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      setIsVisible(true)
      setShouldLoad(true)
      observer.unobserve(entry.target)
    }, { rootMargin: '240px 0px', threshold: 0.01 })

    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  const generations = useMemo(
    () => [...new Set([...DEFAULT_GENERATIONS, ...members.map((member) => member.generation)])].sort((a, b) => a - b),
    [members],
  )
  const visibleMembers = useMemo(
    () => selectedGeneration === ALL_GENERATIONS
      ? members
      : members.filter((member) => member.generation === Number(selectedGeneration)),
    [members, selectedGeneration],
  )

  const renderedMembers = visibleMembers.slice(0, visibleCount)
  const hasMoreMembers = visibleCount < visibleMembers.length

  useEffect(() => {
    const trigger = loadMoreRef.current
    if (!trigger || !shouldLoad || isLoading || !hasMoreMembers) return

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      observer.unobserve(entry.target)
      setVisibleCount((count) => Math.min(count + MEMBER_BATCH_SIZE, visibleMembers.length))
    }, { rootMargin: '160px 0px' })

    observer.observe(trigger)
    return () => observer.disconnect()
  }, [hasMoreMembers, isLoading, shouldLoad, visibleCount, visibleMembers])

  function handleGenerationChange(generation: string) {
    setSelectedGeneration(generation)
    setVisibleCount(MEMBER_BATCH_SIZE)
  }

  return (
    <S.Section ref={sectionRef} aria-label="Louter Member" $visible={isVisible}>
      <S.Title>Louter Member</S.Title>
      <S.FilterList aria-label="기수 필터">
        <S.FilterButton
          type="button"
          $active={selectedGeneration === ALL_GENERATIONS}
          onClick={() => handleGenerationChange(ALL_GENERATIONS)}
        >
          전체
        </S.FilterButton>
        {generations.map((generation) => (
          <S.FilterButton
            key={generation}
            type="button"
            $active={selectedGeneration === String(generation)}
            onClick={() => handleGenerationChange(String(generation))}
          >
            {generation}기
          </S.FilterButton>
        ))}
      </S.FilterList>
    <S.MemberList key={selectedGeneration} $loaded={shouldLoad && !isLoading}>
      {isLoading
        ? Array.from({ length: 5 }, (_, index) => <MemberSkeleton key={index} />)
          : shouldLoad && renderedMembers.map((member) => <MemberRow key={member.userId} member={member} />)}
        {shouldLoad && hasMoreMembers && <S.LoadMoreTrigger ref={loadMoreRef} aria-label="다음 멤버 불러오는 중" />}
      </S.MemberList>
    </S.Section>
  )
}

interface MemberRowProps {
  member: Member
}

function MemberRow({ member }: MemberRowProps) {
  const [failedImageUrl, setFailedImageUrl] = useState<string>()
  const roleLabel = member.role === 'LEADER' ? '부장' : '부원'
  const majorText = member.majors.length > 0
    ? `${member.majors.join(' & ')} Developer`
    : 'Developer'
  const profileNameColor = member.equippedItems?.nameColor
  const profileNameStyleKey = getNameStyleKey(
    profileNameColor?.styleKey ??
      profileNameColor?.valueColor ??
      profileNameColor?.value_color ??
      profileNameColor?.valueText ??
      profileNameColor?.itemName,
  )
  const profileBorder = member.equippedItems?.border
  const profileBorderImageUrl = profileBorder?.valueImageUrl ??
    profileBorder?.imageUrl ??
    profileBorder?.itemImageUrl ??
    profileBorder?.originalImageUrl ??
    profileBorder?.previewImageUrl ??
    profileBorder?.thumbnailUrl
  const hasCustomBorder = Boolean(profileBorderImageUrl?.trim())
  const profileTitle = member.equippedItems?.title
  const profileTitleText = profileTitle?.valueText ?? profileTitle?.itemName
  const profileTitleStyleKey = getNameStyleKey(
    profileTitle?.valueColor ?? profileTitle?.value_color,
  )

  return (
    <S.MemberRow>
      {member.profileImageUrl && member.profileImageUrl !== failedImageUrl ? (
        <S.MemberProfileAvatar
          alt={`${member.userName} 프로필`}
          $hasBorder={hasCustomBorder}
          equippedItems={member.equippedItems}
          imageUrl={member.profileImageUrl}
          showLoadingState
          onImageError={() => setFailedImageUrl(member.profileImageUrl)}
          size={96}
        />
      ) : (
        <S.MemberAvatarFallback aria-label={`${member.userName} 프로필`}>{member.userName.slice(0, 1)}</S.MemberAvatarFallback>
      )}
      <S.MemberInfo>
        <S.RoleBadge $leader={member.role === 'LEADER'}>{member.generation}기 {roleLabel}</S.RoleBadge>
        <S.MemberName>
          <UserName styleKey={profileNameStyleKey}>{member.userName}</UserName> ({majorText})
        </S.MemberName>
        <S.SocialLinks>
          {member.githubUrl && <a href={member.githubUrl} target="_blank" rel="noopener noreferrer" aria-label={`${member.userName} GitHub`}><FaGithub /></a>}
          {member.linkedinUrl && <a href={member.linkedinUrl} target="_blank" rel="noopener noreferrer" aria-label={`${member.userName} LinkedIn`}><FaLinkedin /></a>}
        </S.SocialLinks>
        <S.Generation>
          Louter {member.generation}기
          {profileTitleText && (
            <>
              <S.GenerationSeparator aria-hidden="true">·</S.GenerationSeparator>
              <S.GenerationTitle>
                {profileTitleStyleKey ? (
                  <UserName styleKey={profileTitleStyleKey}>{profileTitleText}</UserName>
                ) : (
                  profileTitleText
                )}
              </S.GenerationTitle>
            </>
          )}
        </S.Generation>
      </S.MemberInfo>
    </S.MemberRow>
  )
}

function MemberSkeleton() {
  return (
    <S.MemberSkeletonRow aria-hidden="true">
      <S.MemberImageSkeleton />
      <S.MemberSkeletonInfo>
        <S.SkeletonLine $width="80px" $height="23px" />
        <S.SkeletonLine $width="280px" $height="20px" />
        <S.SkeletonLine $width="92px" $height="14px" />
      </S.MemberSkeletonInfo>
    </S.MemberSkeletonRow>
  )
}
