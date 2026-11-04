import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default [
  {
    ignores: [
      '**/dist/**',
      '**/.next/**',
      '**/out/**',
      '**/coverage/**',
      '**/next-env.d.ts',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
];
