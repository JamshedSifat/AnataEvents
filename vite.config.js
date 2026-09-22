import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // Bind to 0.0.0.0 so the preview proxy can reach the dev server, and
    // accept the generated preview hostname.
    host: true,
    allowedHosts: true,
    // Same-origin /api requests are forwarded to the Django backend.
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
    },
  },
})
