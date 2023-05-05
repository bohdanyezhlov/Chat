/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import eslint from 'vite-plugin-eslint';

export default defineConfig(() => ({
  server: {
    open: true,
    proxy: {
      '/api': 'http://0.0.0.0:5001',
      '/socket.io': {
        target: 'ws://0.0.0.0:5001',
        ws: true,
      },
    },
  },
  build: {
    outDir: 'build',
  },
  plugins: [react(), eslint()],
}));
