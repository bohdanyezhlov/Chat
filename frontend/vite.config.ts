import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import eslint from 'vite-plugin-eslint';

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return defineConfig({
    server: {
      open: true,
      proxy: {
        '/api': env.VITE_API_URL,
        '/socket.io': {
          target: env.VITE_SOCKET_URL,
          ws: true,
        },
      },
    },
    build: {
      outDir: 'build',
    },
    plugins: [react(), eslint()],
  });
};
