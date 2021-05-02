import vue from 'rollup-plugin-vue';
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import buble from "@rollup/plugin-buble";
import { terser } from 'rollup-plugin-terser';

export default [
  {
    input: 'src/index.js',
    output: {
      format: 'umd',
      file: 'dist/vue-scrollama.umd.js',
      name: 'VueScrollama',
      exports: 'named'
    },
    plugins: [
      nodeResolve({exportConditions: ['node']}),
      commonjs({include: 'node_modules/**'}),
      vue()
    ]
  },
  // ESM build to be used with webpack/rollup.
  {
    input: 'src/index.js',
    output: {
      format: 'esm',
      file: 'dist/vue-scrollama.esm.js',
      exports: 'named'
    },
    plugins: [
      nodeResolve({exportConditions: ['node']}),
      commonjs({include: 'node_modules/**'}),
      vue()
    ]
  },
  // Browser build.
  {
    input: 'src/wrapper.js',
    output: {
      format: 'iife',
      file: 'dist/vue-scrollama.min.js',
      name: 'VueScrollama',
      exports: 'named'
    },
    plugins: [
      nodeResolve({exportConditions: ['node']}),
      commonjs({include: 'node_modules/**'}),
      vue(),
      buble(),
      terser()
    ]
  }
];
