module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/essential',
    '@vue/standard',
    '@vue/typescript'
  ],
    rules: {
    // 'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',

    'indent': 0,

        'no-trailing-spaces': 0,
        'no-unused-vars': 0,
    '@typescript-eslint/no-unused-vars': 0,
    'no-undef': 0,
    'no-var': 0,
    'no-redeclare': 0,
    'no-unreachable': 0,
    'no-unused-expressions': 0,
    'brace-style': 0,
    'comma-dangle': 0,

    'import/no-mutable-exports': 0,
    'import/order': 0,
    'import/no-duplicates': 0,

    'vue/no-unused-components': 0,
    'vue/valid-v-for': 0,
    'vue/require-component-is': 0,
  },
  parserOptions: {
    parser: '@typescript-eslint/parser'
  }
}
