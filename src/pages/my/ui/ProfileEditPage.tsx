import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import profileImage from '@/shared/assets/sidebar/profile.png'
import { Button } from '@/shared/ui'

import {
  type MajorOption,
  ProfileMajorDropdown,
} from './component/ProfileMajorDropdown'
import { ProfileCropModal } from './component/ProfileCropModal'
import { ProfileFormField } from './component/ProfileFormField'
import { ProfileInputIcon } from './icons/ProfileInputIcon'
import type { ProfileCropState } from '../model/useProfileCropModal'
import * as S from './ProfileEditPage.style'

const defaultProfileCropState: ProfileCropState = {
  position: {
    x: 0,
    y: 0,
  },
  zoomValue: 0,
}

const majorOptions: MajorOption[] = [
  { id: 'frontend', label: '프론트엔드' },
  { id: 'backend', label: '백엔드' },
  { id: 'design', label: '디자인' },
  { id: 'ios', label: 'ios' },
  { id: 'android', label: '안드로이드' },
]

export function ProfileEditPage() {
  const navigate = useNavigate()
  const [selectedMajorIds, setSelectedMajorIds] = useState([
    'frontend',
    'design',
  ])
  const [profileImageSrc, setProfileImageSrc] = useState(profileImage)
  const [profileCropState, setProfileCropState] = useState(
    defaultProfileCropState,
  )
  const [isMajorOpen, setIsMajorOpen] = useState(false)
  const [isCropModalOpen, setIsCropModalOpen] = useState(false)

  const handleMajorToggle = (optionId: string) => {
    setSelectedMajorIds((prevIds) =>
      prevIds.includes(optionId)
        ? prevIds.filter((id) => id !== optionId)
        : [...prevIds, optionId],
    )
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
            <ProfileFormField label="성명" defaultValue="ㅇㅇ" />
            <ProfileFormField label="학번" defaultValue="2202" />
          </S.FieldRow>
          <S.FieldRow>
            <ProfileFormField
              label="이메일"
              defaultValue="djfnskdjsdhkg@dgsw.hs.kr"
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
              placeholder="깃허브 링크를 입력해 주세요"
              iconSlot={
                <S.IconSlot aria-hidden="true">
                  <ProfileInputIcon type="github" />
                </S.IconSlot>
              }
            />
            <ProfileFormField
              label="LinkedIn"
              placeholder="링크드인 링크를 입력해 주세요"
              iconSlot={
                <S.IconSlot aria-hidden="true">
                  <ProfileInputIcon type="linkedin" />
                </S.IconSlot>
              }
            />
          </S.FieldRow>
        </S.FormRows>

        <S.SaveButtonWrap>
          <Button size="lg" onClick={() => navigate('/my')}>
            저장
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
