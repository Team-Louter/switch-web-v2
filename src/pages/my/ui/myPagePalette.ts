import * as token from '@/shared/styles/values/token'

// v1 Profile 화면의 중립 색은 유지하고, 동아리 accent만 런타임 팔레트를 따른다.
export const myPagePalette = {
  text: '#333333',
  strongText: '#15181B',
  mutedText: '#727272',
  coolText: '#8A95A0',
  socialText: '#4E5968',
  line: '#E2E4E1',
  lightLine: '#EEEEEE',
  avatarBorder: '#FFFFFF',
  buttonBorder: '#B8B8B8',
  metricGray: '#A0A0A0',
  yellow: token.colors.primary.primary50,
  gold: token.colors.primary.text,
  categoryText: token.colors.primary.primary70,
  categoryBackground: token.colors.primary.primary0,
  red: '#FF3535',
  danger: '#FC675F',
} as const
