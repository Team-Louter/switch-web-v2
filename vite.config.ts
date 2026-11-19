
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import linkPreviewHandler from './api/link-preview.ts'

export default defineConfig({
  plugins: [
    {
      name: 'link-preview-api',
      configureServer(server) {
        server.middlewares.use((request, response, next) => {
          if (request.url?.split('?')[0] !== '/api/link-preview') return next()
          void linkPreviewHandler(request, response)
        })
      },
    },
    react(),
    svgr({
      svgrOptions: {
        replaceAttrValues: { '#CCA700': 'currentColor' },
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
