import { defineConfig, splitVendorChunkPlugin } from 'vite';
import react from '@vitejs/plugin-react';
import viteCompression from 'vite-plugin-compression';
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    viteCompression({ algorithm: 'gzip', ext: '.gz', compressionOptions: { level: 9 } }),
    // Without splitVendor react-responsive doesnt export in builds correctly as of vite 3.1.8 and react-responsive 9.0.0
    splitVendorChunkPlugin(),
  ],
  build: {
    outDir: '../backend/public',
  },
});
