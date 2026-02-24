module.exports = {
  root: true,
  parser: 'vue-eslint-parser',
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
  ],
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
    parser: '@typescript-eslint/parser',
  },
  overrides: [
    {
      files: ['**/*.ts'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: 'module',
      },
      rules: {
        'no-unused-vars': 'off',
      },
    },
  ],
  rules: {
    'vue/multi-word-component-names': 'off',
  },
  globals: {
    Vue: 'readonly',
  },
};
