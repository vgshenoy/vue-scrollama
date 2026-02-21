import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  build: {
    minify: false,
    lib: {
      entry: resolve(__dirname, 'src/index.js'),
      name: 'VueScrollama',
      formats: ['es', 'umd'],
      fileName: (format) => {
        if (format === 'es') return 'vue-scrollama.esm.js';
        return 'vue-scrollama.umd.js';
      },
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
});
