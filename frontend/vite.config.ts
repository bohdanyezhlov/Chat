import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import eslint from 'vite-plugin-eslint';

export default defineConfig(() => ({
  server: {
    open: true,
    proxy: {
      '/api': import.meta.env.VITE_API_URL,
      '/socket.io': {
        target: import.meta.env.VITE_SOCKET_URL,
        ws: true,
      },
    },
  },
  build: {
    outDir: 'build',
  },
  plugins: [react(), eslint()],
}));
