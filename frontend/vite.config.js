/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import eslint from 'vite-plugin-eslint';

export default defineConfig(() => ({
  server: {
    open: true,
    proxy: {
      '/api': 'http://localhost:5001',
    },
  },
  build: {
    outDir: 'build',
  },
  plugins: [react(), eslint()],
}));
