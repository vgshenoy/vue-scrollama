import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.js'),
      name: 'VueScrollama',
      formats: ['es', 'cjs'],
      fileName: (format) => {
        if (format === 'es') return 'vue-scrollama.mjs';
        return 'vue-scrollama.cjs';
      },
    },
    rollupOptions: {
      external: ['vue'],
    },
  },
});
