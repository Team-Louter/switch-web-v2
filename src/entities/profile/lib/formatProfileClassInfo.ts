import type { ProfileResponse } from '../model/types'

export const formatProfileClassInfo = (
  profile: Pick<ProfileResponse, 'classRoom' | 'grade' | 'number'>,
) =>
  `${profile.grade}학년 ${profile.classRoom}반 ${profile.number}번`
