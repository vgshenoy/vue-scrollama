import vue from 'rollup-plugin-vue';
import css from 'rollup-plugin-css-only';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import buble from "rollup-plugin-buble";
import { uglify } from 'rollup-plugin-uglify';

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
      css({
        output: 'dist/vue-scrollama.css'
      }),
      vue({css: false})
    ]
  },
  // Browser build.
  {
    input: './src/wrapper.js',
    output: {
      format: 'iife',
      file: 'dist/vue-scrollama.min.js'
    },
    plugins: [
      resolve(),
      commonjs(),
      css({
        output: 'dist/vue-scrollama.css'
      }),
      vue({css: false}),
      buble(),
      uglify()
    ]
  }
];
