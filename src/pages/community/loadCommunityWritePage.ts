import { loadCommunityEditorStyles } from './ui/loadCommunityEditorStyles'

async function importWritePage() {
  const [page] = await Promise.all([
    import('./ui/CommunityWritePage'),
    loadCommunityEditorStyles(),
  ])
  return { default: page.CommunityWritePage }
}

let preload: ReturnType<typeof importWritePage> | undefined

export function preloadCommunityWritePage() {
  if (!preload) {
    preload = importWritePage()
    void preload.catch(() => {})
  }
}

export function loadCommunityWritePage() {
  // 사전 로딩 도중 클릭해도 완료를 기다리고 실패한 경우에만 한 번 재시도합니다.
  return preload?.catch(importWritePage) ?? importWritePage()
}
