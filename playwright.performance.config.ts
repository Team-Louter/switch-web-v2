import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests/performance',
  workers: 1,
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:4173',
    viewport: { width: 1440, height: 900 },
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  webServer: {
    command: 'npm run build && npm run preview -- --host 127.0.0.1 --port 4173 --strictPort',
    url: 'http://127.0.0.1:4173',
    timeout: 120_000,
    env: { VITE_API_BASE_URL: 'http://127.0.0.1:4173/api' },
    reuseExistingServer: false,
  },
})
