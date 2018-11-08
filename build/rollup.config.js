// rollup.config.js
import vue from 'rollup-plugin-vue';
import buble from 'rollup-plugin-buble';
import uglify from 'rollup-plugin-uglify-es';
import minimist from 'minimist';
import resolve from 'rollup-plugin-node-resolve';
import cjs from 'rollup-plugin-commonjs'
import css from 'rollup-plugin-css-only'

const argv = minimist(process.argv.slice(2));

const config = {
  input: 'src/entry.js',
  output: {
    name: 'VueScrollama'
  },
  plugins: [
    resolve({
      jsnext: true,
      main: true,
      browser: true,
    }),
    cjs({
      include: 'node_modules/**',
    }),
    css({ output: 'dist/vue-scrollama.css' }),
    vue({ css: false }),
    buble()
  ],
};

// Only minify browser (iife) version
if (argv.format === 'iife') {
  config.plugins.push(uglify());
}

export default config;
