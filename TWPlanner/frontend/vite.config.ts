import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import viteCompression from 'vite-plugin-compression';
import tailwindcss from '@tailwindcss/vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    viteCompression({ algorithm: 'gzip', ext: '.gz', compressionOptions: { level: 9 } }),
  ],
  build: {
    outDir: '../backend/public',
  },
});
