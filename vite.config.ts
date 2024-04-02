import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import generate404Plugin from './vite-plugin-404';

export default defineConfig({
  plugins: [react(), tsconfigPaths(), generate404Plugin()],
  server: {
    host: '0.0.0.0',
    port: 3000,
  },
});
