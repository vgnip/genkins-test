import { defineConfig, type AliasOptions } from 'vite'
import { fileURLToPath, URL } from 'node:url';
import vueJsx from '@vitejs/plugin-vue-jsx'

import vue from '@vitejs/plugin-vue'




const alias: AliasOptions = {
  '@': fileURLToPath(new URL('./src', import.meta.url)),
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(),vueJsx()],
  resolve: {
    alias: {
      ...alias,
    },
  },
})
