// Службовий скрипт для Кроку 6 лабораторної роботи.
//
// Запускає Vitest у режимі експерименту (VITEST_EXPERIMENT=1), у якому
// підключається набір tests/experiment/no-assertion.test.ts - тести без тверджень.
// Аргументи командного рядка передаються Vitest без змін, наприклад:
//   node scripts/experiment.mjs tests/order.test.ts tests/experiment/no-assertion.test.ts
import { spawnSync } from 'node:child_process';

const vitestArgs = [
  'node_modules/vitest/vitest.mjs',
  'run',
  '--coverage',
  ...process.argv.slice(2),
];

const result = spawnSync(process.execPath, vitestArgs, {
  stdio: 'inherit',
  env: { ...process.env, VITEST_EXPERIMENT: '1' },
});

process.exit(result.status ?? 1);
