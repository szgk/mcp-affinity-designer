// ESLint configuration for MCP Affinity Designer Server
// MCP Affinity Designer サーバー用ESLint設定

module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
  ],
  plugins: ['@typescript-eslint'],
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
  env: {
    node: true,
    es2022: true,
  },
  rules: {
    // Allow console.error for MCP server logging
    // MCPサーバーログ用にconsole.errorを許可
    'no-console': ['error', { allow: ['error'] }],
    
    // TypeScript specific rules
    // TypeScript固有ルール
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    
    // General code quality rules
    // 一般的なコード品質ルール
    'prefer-const': 'error',
    'no-var': 'error',
    'eqeqeq': 'error',
  },
  ignorePatterns: [
    'dist/',
    'node_modules/',
    '*.js',
  ],
};