module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
  },
  rules: {
    'vue/multi-word-component-names': 'off',
  },
  overrides: [
    {
      files: ['src/wrapper.js'],
      globals: {
        Vue: 'readonly',
      },
      rules: {
        'valid-typeof': 'off',
      },
    },
  ],
};
