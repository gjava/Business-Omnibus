// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/Business-Omnibus/', 
  build: {
    // Ensure this defaults to 'dist' so the action finds the folder
    // You can remove the 'outDir' line entirely if you want
  }
});
