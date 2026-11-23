import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 45_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  workers: 2,
  retries: 0,
  reporter: [['html', { open: 'never' }], ['list'], ['json', { outputFile: 'artifacts/results.json' }]],
  use: {
    baseURL: process.env.BASE_URL || 'https://the-internet.herokuapp.com',
    trace: 'retain-on-failure', screenshot: 'only-on-failure',
    actionTimeout: 15_000,
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
