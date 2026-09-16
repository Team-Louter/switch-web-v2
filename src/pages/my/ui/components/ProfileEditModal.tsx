import { useEffect, useRef, useState } from 'react'

import { useUserStore } from '@/entities/profile'
import { uploadFile } from '@/shared/api'

import { updateMyProfile } from '../../api'
import {
  createStudentId,
  isValidStudentId,
  profileMajorOptions,
} from '../../model/profileEditModel'
import { createProfileImageFile } from '../../model/profileImageUploadModel'
import {
  extractGithubHandle,
  extractLinkedinHandle,
} from '../../model/profileUrlUtils'
import { ProfileInputIcon } from '../icons/ProfileInputIcon'
import { ProfileCropModal } from './ProfileCropModal'
import * as S from './ProfileEditModal.style'

import type { ChangeEvent, MouseEvent } from 'react'
import type { ProfileResponse } from '../../api'
import type { ProfileCropState } from '../../model/useProfileCropModal'
import type { ProfileMajor } from '../../types'

const defaultProfileCropState: ProfileCropState = {
  position: { x: 0, y: 0 },
  zoomValue: 0,
}

const isLocalProfileImageUrl = (url: string) => url.startsWith('data:')
const isManagedProfileImageUrl = (url: string) =>
  Boolean(url) && !isLocalProfileImageUrl(url)

const getProfileImageFileName = (url: string) => {
  if (!url) {
    return '기본프로필.png'
  }

  const fileName = url.split('/').at(-1)?.split('?')[0]

  if (!fileName) {
    return '기본프로필.png'
  }

  try {
    return decodeURIComponent(fileName)
  } catch {
    return fileName
  }
}

interface ProfileEditModalProps {
  onClose: () => void
  onUpdated: (profile: ProfileResponse) => void
}

export function ProfileEditModal({
  onClose,
  onUpdated,
}: ProfileEditModalProps) {
  const storedUser = useUserStore((state) => state.user)
  const fetchUser = useUserStore((state) => state.fetchUser)
  const setUser = useUserStore((state) => state.setUser)
  const profileImageInputRef = useRef<HTMLInputElement>(null)
  const majorDropdownRef = useRef<HTMLDivElement>(null)
  const [selectedMajorIds, setSelectedMajorIds] = useState<ProfileMajor[]>([])
  const [userName, setUserName] = useState('')
  const [studentId, setStudentId] = useState('')
  const [githubId, setGithubId] = useState('')
  const [linkedinId, setLinkedinId] = useState('')
  const [serverProfileImageUrl, setServerProfileImageUrl] = useState('')
  const [profileImageUrl, setProfileImageUrl] = useState('')
  const [profileImageSrc, setProfileImageSrc] = useState('')
  const [profileImageFileName, setProfileImageFileName] = useState(
    '기본프로필.png',
  )
  const [pendingProfileImageSrc, setPendingProfileImageSrc] = useState('')
  const [pendingProfileImageFileName, setPendingProfileImageFileName] =
    useState('')
  const [profileCropState, setProfileCropState] = useState(
    defaultProfileCropState,
  )
  const [isMajorOpen, setIsMajorOpen] = useState(false)
  const [isLinkSectionOpen, setIsLinkSectionOpen] = useState(false)
  const [isCropModalOpen, setIsCropModalOpen] = useState(false)
  const [isUploadingProfileImage, setIsUploadingProfileImage] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    let shouldIgnore = false

    const fetchProfile = async () => {
      try {
        const profile = storedUser ?? (await fetchUser())

        if (shouldIgnore) {
          return
        }

        setUserName(profile.userName)
        setStudentId(
          profile.studentId
            ? String(profile.studentId)
            : createStudentId(profile.grade, profile.classRoom, profile.number),
        )
        setGithubId(extractGithubHandle(profile.githubUrl ?? ''))
        setLinkedinId(extractLinkedinHandle(profile.linkedinUrl ?? ''))
        setServerProfileImageUrl(profile.profileImageUrl ?? '')
        setProfileImageUrl(profile.profileImageUrl ?? '')
        setProfileImageSrc(profile.profileImageUrl ?? '')
        setProfileImageFileName(
          getProfileImageFileName(profile.profileImageUrl ?? ''),
        )
        setSelectedMajorIds(profile.majors ?? [])
      } catch {
        window.alert('프로필 정보를 불러오지 못했어요')
        onClose()
      }
    }

    void fetchProfile()

    return () => {
      shouldIgnore = true
    }
  }, [fetchUser, onClose, storedUser])

  useEffect(() => {
    const handleClickOutside = (event: globalThis.MouseEvent) => {
      if (
        majorDropdownRef.current &&
        !majorDropdownRef.current.contains(event.target as Node)
      ) {
        setIsMajorOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') {
        return
      }

      if (isCropModalOpen) {
        setPendingProfileImageSrc('')
        setPendingProfileImageFileName('')
        setIsCropModalOpen(false)
        return
      }

      onClose()
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isCropModalOpen, onClose])

  const handleModalClick = (event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation()
  }

  const handleMajorToggle = (optionId: ProfileMajor) => {
    setSelectedMajorIds((currentMajorIds) =>
      currentMajorIds.includes(optionId)
        ? currentMajorIds.filter((id) => id !== optionId)
        : [...currentMajorIds, optionId],
    )
  }

  const handleStudentIdChange = (value: string) => {
    setStudentId(value.replace(/\D/g, '').slice(0, 4))
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
      setPendingProfileImageFileName(file.name)
      setProfileCropState(defaultProfileCropState)
      setIsCropModalOpen(true)
      event.target.value = ''
    }

    reader.readAsDataURL(file)
  }

  const handleSaveProfile = async () => {
    const nextUserName = userName.trim()
    const nextStudentId = Number(studentId)
    const nextGithubId = githubId.trim()
    const nextLinkedinId = linkedinId.trim()
    const nextProfileImageUrl = isManagedProfileImageUrl(profileImageUrl)
      ? profileImageUrl
      : isManagedProfileImageUrl(serverProfileImageUrl)
        ? serverProfileImageUrl
        : undefined

    if (!nextUserName) {
      window.alert('이름을 입력해 주세요')
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
      const updatedProfile = await updateMyProfile({
        githubId: nextGithubId ? `https://github.com/${nextGithubId}` : '',
        linkedinId: nextLinkedinId
          ? `https://www.linkedin.com/in/${nextLinkedinId}`
          : '',
        majors: selectedMajorIds,
        profileImageUrl: nextProfileImageUrl,
        studentId: nextStudentId,
        userName: nextUserName,
      })

      setUser(updatedProfile)
      onUpdated(updatedProfile)
      onClose()
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
      setProfileImageFileName(
        pendingProfileImageFileName || getProfileImageFileName(uploadedFile.url),
      )
    } catch {
      setProfileImageUrl(serverProfileImageUrl)
      setProfileImageSrc(serverProfileImageUrl)
      window.alert('이미지를 업로드하지 못했어요')
    } finally {
      setPendingProfileImageFileName('')
      setIsUploadingProfileImage(false)
    }
  }

  const isSaveDisabled =
    isSaving ||
    isUploadingProfileImage ||
    !userName.trim() ||
    !isValidStudentId(studentId)
  const selectedMajorText =
    selectedMajorIds.length === 0
      ? '전공 선택'
      : selectedMajorIds.length <= 2
        ? selectedMajorIds.join(', ')
        : `${selectedMajorIds.slice(0, 2).join(', ')} 외 ${selectedMajorIds.length - 2}개`

  return (
    <>
      <S.Overlay onClick={onClose}>
        <S.Modal
          role="dialog"
          aria-modal="true"
          aria-labelledby="profile-edit-title"
          onClick={handleModalClick}
        >
          <S.Title id="profile-edit-title">프로필 수정하기</S.Title>

          <S.Row>
            <S.Label htmlFor="profile-name">이름</S.Label>
            <S.InputWrapper>
              <S.Input
                id="profile-name"
                type="text"
                value={userName}
                maxLength={50}
                onChange={(event) => setUserName(event.target.value)}
              />
              <S.CharCount>{userName.length}/50</S.CharCount>
            </S.InputWrapper>
          </S.Row>

          <S.Row>
            <S.Label htmlFor="profile-student-id">학번</S.Label>
            <S.Input
              id="profile-student-id"
              type="text"
              inputMode="numeric"
              value={studentId}
              maxLength={4}
              onChange={(event) => handleStudentIdChange(event.target.value)}
            />
          </S.Row>

          <S.Row>
            <S.Label>전공</S.Label>
            <S.MajorContainer ref={majorDropdownRef}>
              <S.MajorDropdownButton
                type="button"
                $hasSelection={selectedMajorIds.length > 0}
                $isOpen={isMajorOpen}
                aria-expanded={isMajorOpen}
                onClick={() => setIsMajorOpen((currentValue) => !currentValue)}
              >
                <span>{selectedMajorText}</span>
                <S.MajorArrow $isOpen={isMajorOpen} aria-hidden="true">
                  ‹
                </S.MajorArrow>
              </S.MajorDropdownButton>

              {isMajorOpen && (
                <S.MajorDropdownMenu>
                  {profileMajorOptions.map((option) => {
                    const isSelected = selectedMajorIds.includes(option.id)

                    return (
                      <S.MajorItem
                        key={option.id}
                        type="button"
                        $selected={isSelected}
                        onClick={() => handleMajorToggle(option.id)}
                      >
                        <S.MajorItemLabel $selected={isSelected}>
                          {option.label}
                        </S.MajorItemLabel>
                      </S.MajorItem>
                    )
                  })}
                </S.MajorDropdownMenu>
              )}
            </S.MajorContainer>
          </S.Row>

          <S.Row>
            <S.Label>프로필</S.Label>
            <S.ProfileFileName>{profileImageFileName}</S.ProfileFileName>
          </S.Row>

          <S.Row>
            <S.Label>프로필 변경</S.Label>
            <S.UploadButton type="button" onClick={() => profileImageInputRef.current?.click()}>
              {isUploadingProfileImage ? '업로드 중...' : '이미지 업로드하기'}
            </S.UploadButton>
            <S.HiddenFileInput
              ref={profileImageInputRef}
              type="file"
              accept="image/*"
              onChange={handleProfileImageChange}
            />
          </S.Row>

          {!isLinkSectionOpen && (
            <S.LinkToggle
              type="button"
              onClick={() => setIsLinkSectionOpen(true)}
            >
              <S.LinkToggleIcon>⊕</S.LinkToggleIcon>
              링크 추가하기
            </S.LinkToggle>
          )}

          {isLinkSectionOpen && (
            <S.LinkSection>
              <S.LinkRow>
                <S.LinkIconWrapper>
                  <ProfileInputIcon type="github" />
                  GitHub
                </S.LinkIconWrapper>
                <S.LinkInputWrapper>
                  <S.LinkPrefix>https://github.com/</S.LinkPrefix>
                  <S.LinkInput
                    type="text"
                    value={githubId}
                    placeholder="username"
                    onChange={(event) => setGithubId(event.target.value)}
                  />
                </S.LinkInputWrapper>
              </S.LinkRow>
              <S.LinkRow>
                <S.LinkIconWrapper>
                  <ProfileInputIcon type="linkedin" />
                  LinkedIn
                </S.LinkIconWrapper>
                <S.LinkInputWrapper>
                  <S.LinkPrefix>https://www.linkedin.com/in/</S.LinkPrefix>
                  <S.LinkInput
                    type="text"
                    value={linkedinId}
                    placeholder="username"
                    onChange={(event) => setLinkedinId(event.target.value)}
                  />
                </S.LinkInputWrapper>
              </S.LinkRow>
            </S.LinkSection>
          )}

          <S.Divider />

          <S.ButtonRow>
            <S.CancelButton type="button" onClick={onClose}>
              취소
            </S.CancelButton>
            <S.SaveButton
              type="button"
              disabled={isSaveDisabled}
              onClick={handleSaveProfile}
            >
              {isSaving ? '저장 중...' : '저장'}
            </S.SaveButton>
          </S.ButtonRow>
        </S.Modal>
      </S.Overlay>

      {isCropModalOpen && pendingProfileImageSrc && (
        <ProfileCropModal
          imageSrc={pendingProfileImageSrc}
          initialState={profileCropState}
          onCancel={() => {
            setPendingProfileImageSrc('')
            setPendingProfileImageFileName('')
            setIsCropModalOpen(false)
          }}
          onComplete={handleCompleteProfileImageCrop}
        />
      )}
    </>
  )
}
