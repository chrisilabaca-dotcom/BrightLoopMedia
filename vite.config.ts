import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@server": path.resolve(__dirname, "./server"),
    },
  },
  ssr: {
    noExternal: ['gsap'],
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  }
})
