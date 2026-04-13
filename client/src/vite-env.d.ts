/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DASHBOARD_PIN?: string
  readonly VITE_API_BASE?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
