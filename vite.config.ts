import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    // 'base: "./"' ensures assets are linked relatively, which is required for GitHub Pages
    base: './',
    // This allows process.env.API_KEY to work in the browser for the Gemini SDK
    define: {
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    }
  }
})