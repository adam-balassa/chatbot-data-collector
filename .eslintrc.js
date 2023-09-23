module.exports = {
  'env': {
    'node': true,
    'commonjs': true,
    'es2021': true,
    'jest': true
  },
  'extends': [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  'parser': '@typescript-eslint/parser',
  'parserOptions': {
    'ecmaVersion': 'latest'
  },
  'plugins': [
    '@typescript-eslint'
  ],
  'rules': {
    'indent': [
      'warn',
      2,
      { 'ignoredNodes': ['PropertyDefinition'] }
    ],
    'linebreak-style': [
      'error',
      'unix'
    ],
    'quotes': [
      'warn',
      'single'
    ],
    'no-trailing-spaces': 'error',
    'object-curly-spacing': [
      'warn', 'always'
    ],
    'arrow-spacing': [
      'warn', { 'before': true, 'after': true }
    ],
    'eqeqeq': ['warn', 'smart'],
    'no-console': 0,
    '@typescript-eslint/no-unused-vars': ['warn', { 'argsIgnorePattern': '^_' }],
    '@typescript-eslint/consistent-type-imports': 'warn'
  },
  'ignorePatterns': ['dist/*'],
}
