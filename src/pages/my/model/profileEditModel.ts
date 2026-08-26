import type { ProfileMajor } from '@/entities/profile'

export type ProfileMajorOption = {
  id: ProfileMajor
  label: string
}

export const profileMajorOptions: ProfileMajorOption[] = [
  { id: 'FRONTEND', label: '프론트엔드' },
  { id: 'BACKEND', label: '백엔드' },
  { id: 'DESIGN', label: '디자인' },
  { id: 'IOS', label: 'ios' },
  { id: 'ANDROID', label: '안드로이드' },
]

export const createStudentId = (
  grade?: number,
  classRoom?: number,
  number?: number,
) => {
  if (!grade || !classRoom || !number) {
    return ''
  }

  return `${grade}${classRoom}${String(number).padStart(2, '0')}`
}

export const isValidStudentId = (studentId: string) => /^\d{4}$/.test(studentId)
