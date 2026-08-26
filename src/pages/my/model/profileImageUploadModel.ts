const PROFILE_IMAGE_FILE_TYPE = 'image/jpeg'

// 크롭 미리보기 data URL을 서버 업로드용 File 객체로 변환한다.
export const createProfileImageFile = async (imageDataUrl: string) => {
  const response = await fetch(imageDataUrl)
  const blob = await response.blob()

  return new File([blob], `profile-image-${Date.now()}.jpg`, {
    type: PROFILE_IMAGE_FILE_TYPE,
  })
}
