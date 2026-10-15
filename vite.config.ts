import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src/client'),
      '@resources': path.resolve(import.meta.dirname, './src/resources'),
      path: 'path-browserify',
    },
  },
  server: {
    port: 3000,
    open: false,
  },
  build: {
    outDir: 'dist',
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('redux')) {
              return 'react-vendor'
            }
            if (id.includes('codemirror')) {
              return 'codemirror-vendor'
            }
            if (id.includes('prettier')) {
              return 'prettier-vendor'
            }
            if (id.includes('jszip')) {
              return 'jszip-vendor'
            }
          }
        },
      },
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
        silenceDeprecations: ['import', 'global-builtin', 'color-functions'],
      } as any,
    },
  },
})
