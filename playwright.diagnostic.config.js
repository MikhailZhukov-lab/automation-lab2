const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './diagnostics',
  timeout: 30_000,
  expect: { timeout: 7_000 },
  reporter: [['list'], ['html', { outputFolder: 'diagnostic-report', open: 'never' }]],
  use: {
    baseURL: 'https://www.saucedemo.com',
    trace: 'on',
    screenshot: 'only-on-failure',
    ...devices['Desktop Chrome'],
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
