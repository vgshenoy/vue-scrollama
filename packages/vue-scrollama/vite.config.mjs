import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'VueScrollama',
      formats: ['es'],
      fileName: () => 'vue-scrollama.mjs',
    },
    rollupOptions: {
      external: ['vue'],
    },
  },
});
