import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:8080',
      '/login': {
        target: 'http://localhost:8080',
        bypass(req) {
          if (req.headers.accept?.includes('text/html')) return req.url;
        }
      },
      '/register': {
        target: 'http://localhost:8080',
        bypass(req) {
          if (req.headers.accept?.includes('text/html')) return req.url;
        }
      },
    }
  }
})