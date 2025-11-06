import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // *** 確保 base 被設為 '/' ***
  // 這樣打包後的 index.html 才會正確讀取 CSS 和 JS
  base: '/' 
})