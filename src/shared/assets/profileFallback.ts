// 빌드 자산은 프론트 origin에 고정해 API 상대 경로 보정을 받지 않게 한다.
export const profileFallbackImage = new URL('./sidebar/profile.webp', import.meta.url).href
