module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['prettier', 'import', '@typescript-eslint'],
  rules: {
    'prettier/prettier': 'error',
    'arrow-parens': [2, 'always'],
    'no-console': 'warn',
  },
};
