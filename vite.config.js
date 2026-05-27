import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/ai-hr-dashboard/',
  plugins: [vue(), tailwindcss()],
})
