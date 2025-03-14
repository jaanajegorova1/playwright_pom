import typescriptPlugin from '@typescript-eslint/eslint-plugin'
import typescriptParser from '@typescript-eslint/parser'

export default [
  {
    files: ['**/*.js', '**/*.ts'], // Target JavaScript and TypeScript files
    ignores: ['node_modules', 'dist', 'build'], // Ignore common folders
    languageOptions: {
      parserOptions: {
        ecmaVersion: 'latest', // Support the latest ECMAScript features
        sourceType: 'module', // Enable ES Modules
      },
      parser: typescriptParser, // Use TypeScript parser
    },
    plugins: {
      '@typescript-eslint': typescriptPlugin,
    },
    rules: {
      quotes: ['error', 'single'],
      'no-unused-vars': 'warn', // Warn about unused variables
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
]
