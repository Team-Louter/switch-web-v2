import { createContext } from 'react'

interface CommunityEditorFile {
  fileKey: string
  fileName: string
  fileType: string
  fileSize: number
}

export const CommunityEditorFilesContext = createContext<readonly CommunityEditorFile[]>([])
