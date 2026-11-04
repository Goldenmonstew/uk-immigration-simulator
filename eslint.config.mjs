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
  {
    files: ['packages/engine/src/**/*.ts'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: 'Literal[value>=1000]',
          message:
            'Policy thresholds must come from packages/policy-data/src/parameters; do not hardcode numeric literals >= 1000.',
        },
        {
          selector:
            "CallExpression[callee.object.name='Date'][callee.property.name='now']",
          message: 'Use the request simulationDate instead of Date.now().',
        },
        {
          selector: "NewExpression[callee.name='Date'][arguments.length=0]",
          message: 'Use an explicit simulation date instead of new Date().',
        },
      ],
    },
  },
];
