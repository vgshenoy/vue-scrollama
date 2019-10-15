import vue from 'rollup-plugin-vue';
import css from 'rollup-plugin-css-only';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';

export default [
  // ESM build to be used with webpack/rollup.
  {
    input: './src/Scrollama.vue',
    output: {
      format: 'esm',
      file: 'dist/vue-scrollama.esm.js'
    },
    plugins: [
      resolve(),
      commonjs(),
      css({output: false}),
      vue({css: false})
    ]
  },
  // Browser build.
  {
    input: './src/wrapper.js',
    output: {
      format: 'iife',
      file: 'dist/vue-scrollama.js'
    },
    plugins: [
      resolve(),
      commonjs(),
      css(),
      vue({css: false})
    ]
  }
];
