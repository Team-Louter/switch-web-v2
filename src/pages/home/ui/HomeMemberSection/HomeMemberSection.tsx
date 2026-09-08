import { useEffect, useMemo, useRef, useState } from 'react'
import { FaGithub, FaLinkedin } from 'react-icons/fa'

import { getMember } from '@/entities/member'
import type { Member } from '@/entities/member'
import * as S from './HomeMemberSection.style'

const ALL_GENERATIONS = '전체'
const DEFAULT_GENERATIONS = [1, 2, 3]
const MEMBER_BATCH_SIZE = 5

export function HomeMemberSection() {
  const [members, setMembers] = useState<Member[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [shouldLoad, setShouldLoad] = useState(false)
  const [visibleCount, setVisibleCount] = useState(0)
  const [selectedGeneration, setSelectedGeneration] = useState(ALL_GENERATIONS)
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const loadMoreRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!shouldLoad) return

    let cancelled = false

    getMember()
      .then(async (response) => {
        const initialMembers = response.slice(0, MEMBER_BATCH_SIZE)
        await preloadMemberImages(initialMembers)
        if (!cancelled) {
          setMembers(response)
          setVisibleCount(initialMembers.length)
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => { cancelled = true }
  }, [shouldLoad])

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      setIsVisible(true)
      setIsLoading(true)
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
    if (!trigger || !shouldLoad || isLoading || isLoadingMore || !hasMoreMembers) return

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      observer.unobserve(entry.target)
      const nextMembers = visibleMembers.slice(visibleCount, visibleCount + MEMBER_BATCH_SIZE)
      setIsLoadingMore(true)
      void preloadMemberImages(nextMembers).then(() => {
        setVisibleCount((count) => count + nextMembers.length)
        setIsLoadingMore(false)
      })
    }, { rootMargin: '160px 0px' })

    observer.observe(trigger)
    return () => observer.disconnect()
  }, [hasMoreMembers, isLoading, isLoadingMore, shouldLoad, visibleCount, visibleMembers])

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
      <S.MemberList $loaded={shouldLoad && !isLoading}>
        {isLoading
          ? Array.from({ length: 5 }, (_, index) => <MemberSkeleton key={index} />)
          : shouldLoad && renderedMembers.map((member) => <MemberRow key={member.userId} member={member} />)}
        {isLoadingMore && Array.from({ length: Math.min(MEMBER_BATCH_SIZE, visibleMembers.length - visibleCount) }, (_, index) => <MemberSkeleton key={`more-${index}`} />)}
        {shouldLoad && hasMoreMembers && <S.LoadMoreTrigger ref={loadMoreRef} aria-label="다음 멤버 불러오는 중" />}
      </S.MemberList>
    </S.Section>
  )
}

interface MemberRowProps {
  member: Member
}

function MemberRow({ member }: MemberRowProps) {
  const roleLabel = member.role === 'LEADER' ? '부장' : '부원'
  const majorText = member.majors.length > 0
    ? `${member.majors.join(' & ')} Developer`
    : 'Developer'

  return (
    <S.MemberRow>
      {member.profileImageUrl ? (
        <S.MemberImage src={member.profileImageUrl} alt={`${member.userName} 프로필`} />
      ) : (
        <S.MemberAvatarFallback aria-label={`${member.userName} 프로필`}>{member.userName.slice(0, 1)}</S.MemberAvatarFallback>
      )}
      <S.MemberInfo>
        <S.RoleBadge $leader={member.role === 'LEADER'}>{member.generation}기 {roleLabel}</S.RoleBadge>
        <S.MemberName>{member.userName} ({majorText})</S.MemberName>
        <S.SocialLinks>
          {member.githubUrl && <a href={member.githubUrl} target="_blank" rel="noopener noreferrer" aria-label={`${member.userName} GitHub`}><FaGithub /></a>}
          {member.linkedinUrl && <a href={member.linkedinUrl} target="_blank" rel="noopener noreferrer" aria-label={`${member.userName} LinkedIn`}><FaLinkedin /></a>}
        </S.SocialLinks>
        <S.Generation>Louter {member.generation}기</S.Generation>
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

async function preloadMemberImages(members: Member[]): Promise<void> {
  await Promise.all(members
    .filter((member) => Boolean(member.profileImageUrl))
    .map((member) => new Promise<void>((resolve) => {
      const image = new Image()
      image.onload = () => resolve()
      image.onerror = () => resolve()
      image.src = member.profileImageUrl
    })))
}
