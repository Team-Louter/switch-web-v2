import { useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { FiEdit } from 'react-icons/fi'

import type { ClubApplicationInput } from '@/entities/club'
import {
  PALETTE_OPTIONS,
  PALETTES,
  type PaletteId,
} from '@/shared/styles/values/_palettes'

import * as S from './ClubCreateForm.style'

interface ClubCreateFormProps {
  onSubmit?: (values: ClubApplicationInput) => void
  onLogoPreviewChange?: (preview: string) => void
  onRepresentativeImagePreviewChange?: (preview: string) => void
}

function readImagePreview(
  file: File,
  setPreview: (preview: string) => void,
  onPreviewChange?: (preview: string) => void,
) {
  const reader = new FileReader()
  reader.addEventListener('load', () => {
    if (typeof reader.result === 'string') {
      setPreview(reader.result)
      onPreviewChange?.(reader.result)
    }
  })
  reader.readAsDataURL(file)
}

export function ClubCreateForm({
  onSubmit,
  onLogoPreviewChange,
  onRepresentativeImagePreviewChange,
}: ClubCreateFormProps) {
  const [koreanName, setKoreanName] = useState('')
  const [englishName, setEnglishName] = useState('')
  const [clubLogo, setClubLogo] = useState<File | null>(null)
  const [clubLogoPreview, setClubLogoPreview] = useState('')
  const [representativeImage, setRepresentativeImage] = useState<File | null>(
    null,
  )
  const [representativeImagePreview, setRepresentativeImagePreview] =
    useState('')
  const [selectedPaletteId, setSelectedPaletteId] = useState<PaletteId>('yellow')
  const [clubOlga, setClubOlga] = useState('')
  const selectedPalette = PALETTES[selectedPaletteId]

  const isSubmitDisabled =
    !koreanName.trim() ||
    !englishName.trim() ||
    !clubLogo ||
    !representativeImage ||
    !clubOlga.trim()

  function handleImageChange(
    event: ChangeEvent<HTMLInputElement>,
    setFile: (file: File) => void,
    setPreview: (preview: string) => void,
    onPreviewChange?: (preview: string) => void,
  ) {
    const file = event.currentTarget.files?.[0]
    if (!file) {
      return
    }

    setFile(file)
    readImagePreview(file, setPreview, onPreviewChange)
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (isSubmitDisabled) {
      return
    }

    onSubmit?.({
      koreanName: koreanName.trim(),
      englishName: englishName.trim(),
      clubLogoPreview,
      representativeImagePreview,
      paletteId: selectedPaletteId,
      clubOlga: clubOlga.trim(),
    })
  }

  return (
    <S.Form
      $accentColor={selectedPalette.colors.primary50}
      $isDarkAccent={selectedPalette.colors.foreground === '#FFFFFF'}
      onSubmit={handleSubmit}
      noValidate
    >
      <S.FieldGroup>
        <S.Label htmlFor="club-korean-name">
          동아리명(한글)
          <S.RequiredMark aria-hidden="true">*</S.RequiredMark>
        </S.Label>
        <S.TextInput
          id="club-korean-name"
          value={koreanName}
          onChange={(event) => setKoreanName(event.target.value)}
          placeholder="한글 동아리명을 입력해주세요"
          maxLength={30}
          required
        />
      </S.FieldGroup>

      <S.FieldGroup>
        <S.Label htmlFor="club-english-name">
          동아리명(영문)
          <S.RequiredMark aria-hidden="true">*</S.RequiredMark>
        </S.Label>
        <S.TextInput
          id="club-english-name"
          value={englishName}
          onChange={(event) => setEnglishName(event.target.value)}
          placeholder="영문 동아리명을 입력해주세요"
          maxLength={50}
          required
        />
      </S.FieldGroup>

      <S.FieldGroup>
        <S.Label htmlFor="club-logo">
          동아리 로고
          <S.RequiredMark aria-hidden="true">*</S.RequiredMark>
        </S.Label>
        <S.FilePicker>
          {clubLogoPreview && (
            <S.ImagePreviewButton
              htmlFor="club-logo"
              $isLogo
              aria-label="동아리 로고 변경"
            >
              <S.ImagePreview
                src={clubLogoPreview}
                alt="선택한 동아리 로고 미리보기"
                $isLogo
              />
              <S.ImageEditOverlay aria-hidden="true">
                <S.ImageEditIcon>
                  <FiEdit />
                </S.ImageEditIcon>
              </S.ImageEditOverlay>
            </S.ImagePreviewButton>
          )}
          {!clubLogoPreview && (
            <S.FilePickerButton htmlFor="club-logo">파일 선택</S.FilePickerButton>
          )}
          <S.HiddenFileInput
            id="club-logo"
            type="file"
            accept="image/png,image/svg+xml"
            onChange={(event) =>
              handleImageChange(
                event,
                setClubLogo,
                setClubLogoPreview,
                onLogoPreviewChange,
              )
            }
          />
          <S.FileInfo>
            <S.FileName>
              {clubLogo?.name ?? '선택된 파일이 없습니다'}
            </S.FileName>
            <S.FileHint>
              PNG 또는 SVG · 권장 256×256px 이상 (정사각형)
            </S.FileHint>
          </S.FileInfo>
        </S.FilePicker>
      </S.FieldGroup>

      <S.FieldGroup>
        <S.Label htmlFor="club-representative-image">
          동아리 대표 이미지
          <S.RequiredMark aria-hidden="true">*</S.RequiredMark>
        </S.Label>
        <S.FilePicker>
          {representativeImagePreview && (
            <S.ImagePreviewButton
              htmlFor="club-representative-image"
              aria-label="동아리 대표 이미지 변경"
            >
              <S.ImagePreview
                src={representativeImagePreview}
                alt="선택한 동아리 대표 이미지 미리보기"
              />
              <S.ImageEditOverlay aria-hidden="true">
                <S.ImageEditIcon>
                  <FiEdit />
                </S.ImageEditIcon>
              </S.ImageEditOverlay>
            </S.ImagePreviewButton>
          )}
          {!representativeImagePreview && (
            <S.FilePickerButton htmlFor="club-representative-image">
              파일 선택
            </S.FilePickerButton>
          )}
          <S.HiddenFileInput
            id="club-representative-image"
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={(event) =>
              handleImageChange(
                event,
                setRepresentativeImage,
                setRepresentativeImagePreview,
                onRepresentativeImagePreviewChange,
              )
            }
          />
          <S.FileInfo>
            <S.FileName>
              {representativeImage?.name ?? '선택된 파일이 없습니다'}
            </S.FileName>
            <S.FileHint>
              PNG, JPG 또는 WEBP · 권장 1600×1464px 이상 (600:549 비율)
            </S.FileHint>
          </S.FileInfo>
        </S.FilePicker>
      </S.FieldGroup>

      <S.FieldGroup>
        <S.Label id="club-color-label">
          색상
          <S.RequiredMark aria-hidden="true">*</S.RequiredMark>
        </S.Label>
        <S.Palette role="radiogroup" aria-labelledby="club-color-label">
          {PALETTE_OPTIONS.map((palette) => (
            <S.ColorOption
              key={palette.id}
              type="button"
              role="radio"
              aria-label={palette.label}
              aria-checked={selectedPaletteId === palette.id}
              $color={palette.swatch}
              $selected={selectedPaletteId === palette.id}
              onClick={() => setSelectedPaletteId(palette.id)}
            />
          ))}
        </S.Palette>
      </S.FieldGroup>

      <S.FieldGroup>
        <S.Label htmlFor="club-olga">
          동아리 올가
          <S.RequiredMark aria-hidden="true">*</S.RequiredMark>
        </S.Label>
        <S.TextInput
          id="club-olga"
          value={clubOlga}
          onChange={(event) => setClubOlga(event.target.value)}
          placeholder="동아리 올가를 입력해주세요"
          maxLength={100}
          required
        />
      </S.FieldGroup>

      <S.SubmitButton type="submit" disabled={isSubmitDisabled}>
        동아리 생성 신청
      </S.SubmitButton>

      <S.CreateBrand>
        <S.CreateBrandDivider aria-hidden="true" />
        <S.CreateBrandText>ⓒ Switch</S.CreateBrandText>
      </S.CreateBrand>
    </S.Form>
  )
}
