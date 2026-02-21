import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  build: {
    emptyOutDir: false,
    minify: true,
    lib: {
      entry: resolve(__dirname, 'src/wrapper.js'),
      name: 'VueScrollama',
      formats: ['iife'],
      fileName: () => 'vue-scrollama.min.js',
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
