import { defineESLintConfig } from '@sumomo015/eslint-config'

export default defineESLintConfig({
  mode: 'VUE_WITH_TS',
  internalRegex: '^#',
  tsconfigRootDir: import.meta.dirname,
  ignores: [
    '.nuxt',
    'dist',
    '.output',
    '.data',
    'coverage',
  ],
}, {
  files: [
    'app/pages/**/*.vue',
    'app/layouts/**/*.vue',
    'app/error.vue',
  ],
  rules: {
    'vue/multi-word-component-names': 'off',
  },
})
