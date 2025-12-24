import js from '@eslint/js';
import globals from 'globals';
import prettier from 'eslint-config-prettier';

export default [
  // IGNORES FIRST
  {
    ignores: [
      'node_modules/',
      'dist/',
      'build/',
      'coverage/',
      '*.log',
      '*.min.js',
      'package.json',
      'package-lock.json',
      'yarn.lock',
      'pnpm-lock.yaml',
      'eslint.config.*',
      '.eslintrc.*',
      '.prettierrc',
      '.prettierignore',
      'public/',
      '.eslintignore',
    ],
  },
  
  js.configs.recommended,
  prettier, // Turns off ESLint rules that conflict with Prettier
  
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node,
        process: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        Buffer: 'readonly',
        setImmediate: 'readonly',
        clearImmediate: 'readonly',
      },
    },
    rules: {
      'no-unused-vars': ['warn', { 
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrors: 'none',
      }],
      'no-multiple-empty-lines': ['warn', { 
        max: 1,
        maxEOF: 1,
        maxBOF: 0,
      }],
      'no-var': 'warn',
      'dot-notation': 'warn',
      'no-console': 'off',
      'prefer-const': 'warn',
      'eqeqeq': ['warn', 'always'],
      'no-undef': 'error',
    },
  },
];