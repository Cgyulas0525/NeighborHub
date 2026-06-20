import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

const proxyTarget = process.env.VITE_PROXY_TARGET || 'http://nginx:80';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    watch: { usePolling: true },
    proxy: {
      '/api': { target: proxyTarget, changeOrigin: true },
      '/sanctum': { target: proxyTarget, changeOrigin: true },
      '/storage': { target: proxyTarget, changeOrigin: true },
    },
  },
});
