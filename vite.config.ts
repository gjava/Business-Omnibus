// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './',//'/Business-Omnibus/',  <--- THIS IS CRITICAL ./dist
  //<--! build : {
   // outDir: 'docs'// Repertoire de deploiement.
  //}-->
});
