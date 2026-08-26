import { apiClient } from './apiClient'

export type UploadFileResponse = {
  url: string
  key: string
  fileName: string
  fileType: string
  fileSize: number
}

// 파일을 서버 저장소에 업로드하고 서버가 관리하는 파일 URL을 반환한다.
export const uploadFile = async (file: File) => {
  const formData = new FormData()

  formData.append('file', file)

  const response = await apiClient.post<UploadFileResponse>(
    '/files/upload',
    formData,
  )

  return response.data
}
