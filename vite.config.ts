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
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/') || id.includes('node_modules/wouter/')) {
            return 'vendor';
          }
          if (id.includes('node_modules/gsap/') || id.includes('node_modules/framer-motion/') || id.includes('node_modules/@studio-freight/lenis/')) {
            return 'animations';
          }
        }
      }
    }
  }
})
