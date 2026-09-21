import {
  saveClubApplication,
  type ClubApplication,
  type ClubApplicationInput,
} from '@/entities/club'

export class InvalidClubSlugError extends Error {
  constructor() {
    super('영문 동아리명을 확인해주세요.')
    this.name = 'InvalidClubSlugError'
  }
}

export function createClubSlug(englishName: string): string {
  return englishName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function createClubApplication(
  input: ClubApplicationInput,
): ClubApplication {
  const slug = createClubSlug(input.englishName)
  if (!slug) {
    throw new InvalidClubSlugError()
  }

  const application: ClubApplication = {
    ...input,
    slug,
    createdAt: new Date().toISOString(),
  }

  saveClubApplication(application)
  return application
}
