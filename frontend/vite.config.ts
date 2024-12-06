import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',              // @ maps to /src (root folder)
      '@components': '/src/components',
      '@utils': '/src/utils',
      '@assets': '/src/assets',
      // If you want to map all folders inside src, you could use this
      '@*': '/src/*',            // This makes @*/* resolve to any folder inside src
    },
  },
})
