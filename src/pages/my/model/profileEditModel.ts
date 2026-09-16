import type { ProfileMajor } from '@/entities/profile'

export type ProfileMajorOption = {
  id: ProfileMajor
  label: string
}

export const profileMajorOptions: ProfileMajorOption[] = [
  { id: 'BACKEND', label: 'BACKEND' },
  { id: 'FRONTEND', label: 'FRONTEND' },
  { id: 'DESIGN', label: 'DESIGN' },
  { id: 'IOS', label: 'IOS' },
  { id: 'ANDROID', label: 'ANDROID' },
  { id: 'SECURITY', label: 'SECURITY' },
  { id: 'GAME', label: 'GAME' },
  { id: 'AI', label: 'AI' },
  { id: 'EMBEDDED', label: 'EMBEDDED' },
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
