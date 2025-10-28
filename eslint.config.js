import js from '@eslint/js'
import globals from 'globals'
import vue from 'eslint-plugin-vue'

export default [
  {
    files: ['**/*.{js,vue}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node
      }
    },
    plugins: {
      vue
    },
    rules: {
      ...js.configs.recommended.rules,
      ...vue.configs.recommended.rules,
      'no-unused-vars': 'warn',
      'no-console': 'warn'
    }
  }
]