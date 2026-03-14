import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/multi-modal-generator/',
  server: {
    proxy: {
      '/comfyui': {
        target: 'https://riders-healthy-independently-showtimes.trycloudflare.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/comfyui/, ''),
        headers: {
          'ngrok-skip-browser-warning': 'true',
          'cf-access-client-id': '',
        },
      },
    },
  },
})
