import { apiClient } from '@/shared/api'
import type { PostFileRequest } from '@/entities/post'

interface FileUploadResponse {
  url: string
  key: string
  fileName: string
  fileType: string
  fileSize: number
}

/**
 * 파일을 업로드하고 게시글에 첨부할 수 있는 형태로 돌려준다.
 *
 * @param file 업로드할 파일
 * @param prefix 서버 저장 경로 접두사
 */
export const uploadFile = async (
  file: File,
  prefix = 'posts',
): Promise<PostFileRequest> => {
  const formData = new FormData()
  formData.append('file', file)

  const response = await apiClient.post<FileUploadResponse>(
    '/files/upload',
    formData,
    {
      params: { prefix },
      headers: { 'Content-Type': 'multipart/form-data' },
    },
  )

  return {
    fileUrl: response.data.url,
    fileName: response.data.fileName,
    fileType: response.data.fileType,
    fileSize: response.data.fileSize,
  }
}
