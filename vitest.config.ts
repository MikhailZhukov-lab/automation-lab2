import { configDefaults, defineConfig } from 'vitest/config';

// VITEST_EXPERIMENT=1 - режим Кроку 6: підключає службовий набір без тверджень
// (tests/experiment/no-assertion.test.ts) і вимикає пороги покриття, щоб
// експериментальні прогони завершувалися кодом 0. Основні пороги перевіряє `npm run coverage`.
const isExperiment = process.env.VITEST_EXPERIMENT === '1';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
    exclude: isExperiment
      ? configDefaults.exclude
      : [...configDefaults.exclude, 'tests/experiment/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'json', 'json-summary', 'lcov'],
      reportsDirectory: './coverage',
      include: ['src/**/*.ts'],
      thresholds: isExperiment
        ? { statements: 0, branches: 0, functions: 0, lines: 0 }
        : {
            statements: 90,
            branches: 90,
            functions: 90,
            lines: 90,
            'src/order.ts': {
              statements: 90,
              branches: 90,
              functions: 90,
              lines: 90,
            },
          },
    },
  },
});
