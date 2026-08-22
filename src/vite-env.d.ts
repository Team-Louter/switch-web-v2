/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string
  readonly VITE_BASE_URL?: string
  readonly VITE_ENABLE_PROTECTED_API?: string
  readonly VITE_TURNSTILE_SITE_KEY?: string
  readonly VITE_ENABLE_PROTECTED_API?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
