import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Always ignore data/ (the JSON "database" the backend writes to on every
      // search / wishlist / price-alert action) and dist/ (build output) so those
      // writes are never picked up as a source change. Without this, every backend
      // write triggers Vite's watcher to do a full page reload, which resets React
      // state and kicks the user back to the splash screen / sign-in modal.
      watch: process.env.DISABLE_HMR === 'true' ? null : {
        ignored: ['**/data/**', '**/dist/**'],
      },
    },
  };
});
