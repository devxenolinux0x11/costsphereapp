import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      // REST Countries API proxy
      '/rest-countries': {
        target: 'https://restcountries.com/v3.1',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/rest-countries/, ''),
      },
      // Weather API proxy
      '/weather-api': {
        target: 'https://api.weatherapi.com/v1',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/weather-api/, ''),
      },
      // GNews API proxy
      '/gnews': {
        target: 'https://gnews.io/api/v4',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/gnews/, ''),
      },
      // No need for proxies for static files in public folder
    },
  },
  resolve: {
    alias: {
      'react-toastify': '/node_modules/react-toastify',
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});
