import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import profileImage from '@/shared/assets/sidebar/profile.png'
import { hasApiAccessToken } from '@/shared/api'
import { Button } from '@/shared/ui'

import { getMyProfile, updateMyProfile } from '../model/myApi'
import { ProfileCropModal } from './component/ProfileCropModal'
import { ProfileFormField } from './component/ProfileFormField'
import { ProfileMajorDropdown } from './component/ProfileMajorDropdown'
import { ProfileInputIcon } from './icons/ProfileInputIcon'
import * as S from './ProfileEditPage.style'
import type { MajorOption } from './component/ProfileMajorDropdown'
import type { ProfileCropState } from '../model/useProfileCropModal'
import type { ProfileMajor } from '../model/myApi'

const defaultProfileCropState: ProfileCropState = {
  position: {
    x: 0,
    y: 0,
  },
  zoomValue: 0,
}

const majorOptions: MajorOption[] = [
  { id: 'FRONTEND', label: '프론트엔드' },
  { id: 'BACKEND', label: '백엔드' },
  { id: 'DESIGN', label: '디자인' },
  { id: 'IOS', label: 'ios' },
  { id: 'ANDROID', label: '안드로이드' },
]

const createStudentId = (grade?: number, classRoom?: number, number?: number) => {
  if (!grade || !classRoom || !number) {
    return ''
  }

  return `${grade}${classRoom}${number}`
}

export function ProfileEditPage() {
  const navigate = useNavigate()
  const [selectedMajorIds, setSelectedMajorIds] = useState<ProfileMajor[]>([])
  const [userName, setUserName] = useState('')
  const [studentId, setStudentId] = useState('')
  const [email, setEmail] = useState('')
  const [githubId, setGithubId] = useState('')
  const [linkedinId, setLinkedinId] = useState('')
  const [profileImageUrl, setProfileImageUrl] = useState('')
  const [profileImageSrc, setProfileImageSrc] = useState(profileImage)
  const [profileCropState, setProfileCropState] = useState(
    defaultProfileCropState,
  )
  const [isMajorOpen, setIsMajorOpen] = useState(false)
  const [isCropModalOpen, setIsCropModalOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    let shouldIgnore = false

    const fetchProfile = async () => {
      if (!hasApiAccessToken()) {
        return
      }

      try {
        const profile = await getMyProfile()

        if (shouldIgnore) {
          return
        }

        setUserName(profile.userName)
        setStudentId(
          createStudentId(profile.grade, profile.classRoom, profile.number),
        )
        setEmail(profile.userEmail)
        setGithubId(profile.githubUrl ?? '')
        setLinkedinId(profile.linkedinUrl ?? '')
        setProfileImageUrl(profile.profileImageUrl ?? '')
        setProfileImageSrc(profile.profileImageUrl || profileImage)
        setSelectedMajorIds(profile.majors ?? [])
      } catch {
        window.alert('프로필 정보를 불러오지 못했어요')
      }
    }

    fetchProfile()

    return () => {
      shouldIgnore = true
    }
  }, [])

  const handleMajorToggle = (optionId: string) => {
    const nextOptionId = optionId as ProfileMajor

    setSelectedMajorIds((prevIds) =>
      prevIds.includes(nextOptionId)
        ? prevIds.filter((id) => id !== nextOptionId)
        : [...prevIds, nextOptionId],
    )
  }

  const handleStudentIdChange = (value: string) => {
    setStudentId(value.replace(/\D/g, '').slice(0, 4))
  }

  const handleSaveProfile = async () => {
    if (!hasApiAccessToken()) {
      window.alert('로그인 기능이 연결된 뒤 저장할 수 있어요')
      return
    }

    const nextUserName = userName.trim()
    const nextStudentId = Number(studentId)

    if (!nextUserName) {
      window.alert('성명을 입력해 주세요')
      return
    }

    if (!studentId || Number.isNaN(nextStudentId)) {
      window.alert('학번을 입력해 주세요')
      return
    }

    try {
      setIsSaving(true)
      await updateMyProfile({
        githubId,
        linkedinId,
        majors: selectedMajorIds,
        profileImageUrl,
        studentId: nextStudentId,
        userName: nextUserName,
      })
      navigate('/my')
    } catch {
      window.alert('프로필을 저장하지 못했어요')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <S.Page>
      <S.Content>
        <S.ProfileImageSection>
          <S.ProfileImageWrap>
            <S.ProfileImage src={profileImageSrc} alt="" />
          </S.ProfileImageWrap>
          <S.ImageActions>
            <S.LineButton type="button" onClick={() => setIsCropModalOpen(true)}>
              이미지 업로드
            </S.LineButton>
            <S.DangerLineButton type="button">이미지 삭제</S.DangerLineButton>
          </S.ImageActions>
        </S.ProfileImageSection>

        <S.FormRows>
          <S.FieldRow>
            <ProfileFormField
              label="성명"
              value={userName}
              onChange={(event) => setUserName(event.target.value)}
            />
            <ProfileFormField
              label="학번"
              value={studentId}
              inputMode="numeric"
              maxLength={4}
              onChange={(event) => handleStudentIdChange(event.target.value)}
            />
          </S.FieldRow>
          <S.FieldRow>
            <ProfileFormField
              label="이메일"
              value={email}
              disabled
            />
            <ProfileMajorDropdown
              options={majorOptions}
              selectedIds={selectedMajorIds}
              isOpen={isMajorOpen}
              onToggleOpen={() => setIsMajorOpen((prev) => !prev)}
              onToggleOption={handleMajorToggle}
            />
          </S.FieldRow>
          <S.FieldRow>
            <ProfileFormField
              label="Github"
              value={githubId}
              placeholder="깃허브 링크를 입력해 주세요"
              onChange={(event) => setGithubId(event.target.value)}
              iconSlot={
                <S.IconSlot aria-hidden="true">
                  <ProfileInputIcon type="github" />
                </S.IconSlot>
              }
            />
            <ProfileFormField
              label="LinkedIn"
              value={linkedinId}
              placeholder="링크드인 링크를 입력해 주세요"
              onChange={(event) => setLinkedinId(event.target.value)}
              iconSlot={
                <S.IconSlot aria-hidden="true">
                  <ProfileInputIcon type="linkedin" />
                </S.IconSlot>
              }
            />
          </S.FieldRow>
        </S.FormRows>

        <S.SaveButtonWrap>
          <Button size="lg" disabled={isSaving} onClick={handleSaveProfile}>
            {isSaving ? '저장 중' : '저장'}
          </Button>
        </S.SaveButtonWrap>
      </S.Content>

      {isCropModalOpen && (
        <ProfileCropModal
          imageSrc={profileImage}
          initialState={profileCropState}
          onCancel={() => setIsCropModalOpen(false)}
          onComplete={(croppedImageSrc, nextCropState) => {
            setProfileImageSrc(croppedImageSrc)
            setProfileCropState(nextCropState)
            setIsCropModalOpen(false)
          }}
        />
      )}
    </S.Page>
  )
}
