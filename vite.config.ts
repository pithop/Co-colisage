import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/pdfjs-dist')) return 'scanner-pdf';
          if (id.includes('node_modules/tesseract.js')) return 'scanner-ocr';
          if (id.includes('node_modules/qrcode') || id.includes('node_modules/jsqr')) return 'qr-tools';
          if (id.includes('node_modules/lucide-react')) return 'vendor-icons';
          if (
            id.includes('node_modules/react/') ||
            id.includes('node_modules/react-dom/') ||
            id.includes('node_modules/scheduler/')
          ) {
            return 'vendor-react';
          }
          if (
            id.includes('/src/components/Voyageur/') ||
            id.includes('/src/components/BagAndGo/') ||
            id.includes('/src/components/ShopAndGo/')
          ) {
            return 'platform-modes';
          }
          if (
            id.includes('/src/components/logistics/') ||
            id.includes('/src/components/Modals/')
          ) {
            return 'logistics-modals';
          }
        },
      },
    },
  },
  server: {
    port: 3000,
    host: true
  }
})
