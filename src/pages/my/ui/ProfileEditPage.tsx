import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { uploadFile } from '@/shared/api'
import { Button } from '@/shared/ui'

import { getMyProfile, updateMyProfile } from '../api'
import {
  createStudentId,
  isValidStudentId,
  profileMajorOptions,
} from '../model/profileEditModel'
import { createProfileImageFile } from '../model/profileImageUploadModel'
import {
  ProfileCropModal,
  ProfileFormField,
  ProfileMajorDropdown,
} from './components'
import { ProfileInputIcon } from './icons/ProfileInputIcon'
import * as S from './ProfileEditPage.style'
import type { ChangeEvent } from 'react'
import type { ProfileCropState } from '../model/useProfileCropModal'
import type { ProfileMajor } from '../types'

const defaultProfileCropState: ProfileCropState = {
  position: {
    x: 0,
    y: 0,
  },
  zoomValue: 0,
}

const isLocalProfileImageUrl = (url: string) => url.startsWith('data:')

const isManagedProfileImageUrl = (url: string) =>
  Boolean(url) && !isLocalProfileImageUrl(url)

export function ProfileEditPage() {
  const navigate = useNavigate()
  const profileImageInputRef = useRef<HTMLInputElement>(null)
  const [selectedMajorIds, setSelectedMajorIds] = useState<ProfileMajor[]>([])
  const [userName, setUserName] = useState('')
  const [studentId, setStudentId] = useState('')
  const [email, setEmail] = useState('')
  const [githubId, setGithubId] = useState('')
  const [linkedinId, setLinkedinId] = useState('')
  const [serverProfileImageUrl, setServerProfileImageUrl] = useState('')
  const [profileImageUrl, setProfileImageUrl] = useState('')
  const [profileImageSrc, setProfileImageSrc] = useState('')
  const [pendingProfileImageSrc, setPendingProfileImageSrc] = useState('')
  const [profileCropState, setProfileCropState] = useState(
    defaultProfileCropState,
  )
  const [isMajorOpen, setIsMajorOpen] = useState(false)
  const [isCropModalOpen, setIsCropModalOpen] = useState(false)
  const [isUploadingProfileImage, setIsUploadingProfileImage] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    let shouldIgnore = false

    const fetchProfile = async () => {
      try {
        const profile = await getMyProfile()

        if (shouldIgnore) {
          return
        }

        setUserName(profile.userName)
        setStudentId(
          profile.studentId
            ? String(profile.studentId)
            : createStudentId(profile.grade, profile.classRoom, profile.number),
        )
        setEmail(profile.userEmail)
        setGithubId(profile.githubUrl ?? '')
        setLinkedinId(profile.linkedinUrl ?? '')
        setServerProfileImageUrl(profile.profileImageUrl ?? '')
        setProfileImageUrl(profile.profileImageUrl ?? '')
        setProfileImageSrc(profile.profileImageUrl ?? '')
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

  const handleOpenProfileImageFileDialog = () => {
    profileImageInputRef.current?.click()
  }

  const handleProfileImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    if (!file.type.startsWith('image/')) {
      window.alert('이미지 파일만 업로드할 수 있어요')
      event.target.value = ''
      return
    }

    const reader = new FileReader()

    reader.onload = () => {
      if (typeof reader.result !== 'string') {
        return
      }

      setPendingProfileImageSrc(reader.result)
      setProfileCropState(defaultProfileCropState)
      setIsCropModalOpen(true)
      event.target.value = ''
    }

    reader.readAsDataURL(file)
  }

  const handleSaveProfile = async () => {
    const nextUserName = userName.trim()
    const nextStudentId = Number(studentId)
    const nextProfileImageUrl = isManagedProfileImageUrl(profileImageUrl)
      ? profileImageUrl
      : isManagedProfileImageUrl(serverProfileImageUrl)
        ? serverProfileImageUrl
        : undefined

    if (!nextUserName) {
      window.alert('성명을 입력해 주세요')
      return
    }

    if (!isValidStudentId(studentId) || Number.isNaN(nextStudentId)) {
      window.alert('학번을 2202 형식으로 입력해 주세요')
      return
    }

    if (isUploadingProfileImage) {
      window.alert('이미지 업로드가 끝난 뒤 저장해 주세요')
      return
    }

    if (
      isLocalProfileImageUrl(profileImageSrc) &&
      !isManagedProfileImageUrl(profileImageUrl)
    ) {
      window.alert('이미지 변경은 아직 저장할 수 없어요')
      return
    }

    try {
      setIsSaving(true)
      await updateMyProfile({
        githubId,
        linkedinId,
        majors: selectedMajorIds,
        profileImageUrl: nextProfileImageUrl,
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

  const handleCompleteProfileImageCrop = async (
    croppedImageSrc: string,
    nextCropState: ProfileCropState,
  ) => {
    setProfileImageSrc(croppedImageSrc)
    setPendingProfileImageSrc('')
    setProfileCropState(nextCropState)
    setIsCropModalOpen(false)
    setIsUploadingProfileImage(true)

    try {
      const profileImageFile = await createProfileImageFile(croppedImageSrc)
      const uploadedFile = await uploadFile(profileImageFile)

      setProfileImageUrl(uploadedFile.url)
      setProfileImageSrc(uploadedFile.url)
    } catch {
      setProfileImageUrl(serverProfileImageUrl)
      setProfileImageSrc(serverProfileImageUrl)
      window.alert('이미지를 업로드하지 못했어요')
    } finally {
      setIsUploadingProfileImage(false)
    }
  }

  return (
    <S.Page>
      <S.Content>
        <S.ProfileImageSection>
          <S.ProfileImageWrap>
            {profileImageSrc && <S.ProfileImage src={profileImageSrc} alt="" />}
          </S.ProfileImageWrap>
          <S.ImageActions>
            <S.LineButton
              type="button"
              onClick={handleOpenProfileImageFileDialog}
            >
              이미지 업로드
            </S.LineButton>
            <S.HiddenFileInput
              ref={profileImageInputRef}
              type="file"
              accept="image/*"
              onChange={handleProfileImageChange}
            />
            <S.DangerLineButton
              type="button"
              onClick={() => {
                setProfileImageUrl(serverProfileImageUrl)
                setProfileImageSrc(serverProfileImageUrl)
                setPendingProfileImageSrc('')
                setProfileCropState(defaultProfileCropState)
              }}
            >
              이미지 삭제
            </S.DangerLineButton>
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
              options={profileMajorOptions}
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
          <Button
            size="lg"
            disabled={isSaving || isUploadingProfileImage}
            onClick={handleSaveProfile}
          >
            {isUploadingProfileImage
              ? '이미지 업로드 중'
              : isSaving
                ? '저장 중'
                : '저장'}
          </Button>
        </S.SaveButtonWrap>
      </S.Content>

      {isCropModalOpen && pendingProfileImageSrc && (
        <ProfileCropModal
          imageSrc={pendingProfileImageSrc}
          initialState={profileCropState}
          onCancel={() => {
            setPendingProfileImageSrc('')
            setIsCropModalOpen(false)
          }}
          onComplete={handleCompleteProfileImageCrop}
        />
      )}
    </S.Page>
  )
}
