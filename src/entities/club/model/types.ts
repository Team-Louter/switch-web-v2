import type { PaletteId } from '@/shared/styles/values/_palettes'

export interface ClubApplication {
  slug: string
  koreanName: string
  englishName: string
  clubLogoPreview: string
  representativeImagePreview: string
  paletteId: PaletteId
  clubOlga: string
  createdAt: string
}

export interface ClubApplicationInput {
  koreanName: string
  englishName: string
  clubLogoPreview: string
  representativeImagePreview: string
  paletteId: PaletteId
  clubOlga: string
}
