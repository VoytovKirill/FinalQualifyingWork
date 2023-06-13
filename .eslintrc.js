module.exports = {
  settings: {
    react: {
      version: 'detect',
    },
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: 'tsconfig.json',
      },
    },
  },
  env: {
    browser: true,
    es6: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  extends: [
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'google',
    'prettier',
  ],
  plugins: ['@typescript-eslint/eslint-plugin', 'import'],
  ignorePatterns: ['modernizr-custom.js'],
  rules: {
    'no-console': 'warn',
    'require-jsdoc': 'off',
    'no-invalid-this': 'off',
    'no-unused-vars': 'warn',
    'import/no-unresolved': 'warn',
    'no-irregular-whitespace': 'warn',
    quotes: ['warn', 'single'], 
    'react/react-in-jsx-scope': 0, 
    'react/display-name': 'off', 
    'react/prop-types': 'off', 
    'spaced-comment': ['warn', 'always', {markers: ['/']}],
    'react-hooks/exhaustive-deps': 'off',
    '@typescript-eslint/indent': ['warn', 2, {flatTernaryExpressions: true, SwitchCase: 1}],
    '@typescript-eslint/no-unused-vars': ['warn', {vars: 'all', args: 'after-used', ignoreRestSiblings: true}],
    '@typescript-eslint/ban-types': ['warn'],
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/naming-convention': [
      'warn',
      {
        selector: 'default',
        format: ['strictCamelCase'],
      },
      {
        selector: 'variable',
        format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
      },
      {
        selector: ['property'],
        format: ['camelCase'],
        leadingUnderscore: 'allow',
      },
      {
        selector: 'typeLike',
        format: ['PascalCase'],
      },
    ],
    'import/order': [
      1,
      {
        groups: ['external', 'builtin', 'internal', 'sibling', 'parent', 'index'],
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
        'newlines-between': 'always',
      },
    ],
    'import/newline-after-import': 'error',
    'import/no-default-export': 'warn',
  },
};
