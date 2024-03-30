import { defineConfig, splitVendorChunkPlugin } from 'vite';
import react from '@vitejs/plugin-react';
import viteCompression from 'vite-plugin-compression';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteCompression({ algorithm: 'gzip', ext: '.gz', compressionOptions: { level: 9 } }),
    // Without splitVendor react-responsive doesnt export in builds correctly as of vite 3.1.8 and react-responsive 9.0.0
    splitVendorChunkPlugin(),
  ],
  build: {
    outDir: '../backend/public',
  },
});
