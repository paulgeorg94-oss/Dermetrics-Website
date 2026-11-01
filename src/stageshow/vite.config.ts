import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// One script and one stylesheet for the static site; the signet is referenced
// from the site's own assets folder, so nothing is inlined as a data: URI
// (the pages' CSP allows img-src 'self' only).
export default defineConfig({
  plugins: [react()],
  base: './',
  define: { 'process.env.NODE_ENV': '"production"' },
  build: {
    outDir: '../../assets/stageshow',
    emptyOutDir: true,
    assetsInlineLimit: 0,
    cssCodeSplit: false,
    rollupOptions: {
      input: 'main.tsx',
      output: {
        format: 'es',
        entryFileNames: 'stageshow.js',
        assetFileNames: (info) => (info.names?.[0]?.endsWith('.css') ? 'stageshow.css' : '[name][extname]'),
      },
    },
  },
})
