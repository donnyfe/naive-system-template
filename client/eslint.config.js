// eslint.config.js
import antfu from '@antfu/eslint-config'
import { Browsers } from '@vicons/ionicons5'

// https://github.com/antfu/eslint-config
// https://www.npmjs.com/package/@antfu/eslint-config
export default antfu(
  {
    stylistic: {
      indent: 2, // 4, or 'tab'
      quotes: 'single', // or 'double'
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    env: {
      browser: true,
      worker: true,
    },
    globals: {
      window: true,
      document: true,
      globalThis: true,
      localStorage: true,
      sessionStorage: true
    },
  },
  {
    // Remember to specify the file glob here, otherwise it might cause the vue plugin to handle non-vue files
    files: ['**/*.vue'],
    rules: {
      'vue/operator-linebreak': ['error', 'before'],
    },
  },
  {
    // Without `files`, they are general rules for all files
    rules: {
      'style/semi': ['off'],
      'no-console': 'off',
    },
  },
)
