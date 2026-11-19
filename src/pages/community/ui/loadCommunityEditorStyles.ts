import editorStylesUrl from './communityEditor.css?url'

let stylesheet: Promise<void> | undefined

export function loadCommunityEditorStyles() {
  // 작성기와 읽기 전용 BlockNote가 같은 스타일을 기다리며, 실패한 요청은 다음 진입에서 재시도합니다.
  stylesheet ??= new Promise<void>((resolve, reject) => {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = editorStylesUrl
    link.onload = () => resolve()
    link.onerror = () => {
      link.remove()
      stylesheet = undefined
      reject(new Error('커뮤니티 에디터 스타일을 불러오지 못했습니다.'))
    }
    document.head.append(link)
  })
  return stylesheet
}
