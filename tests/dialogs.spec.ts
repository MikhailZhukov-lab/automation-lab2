import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => { await page.goto('/javascript_alerts'); });
test('D1: прийняття alert', async ({ page }) => {
  page.once('dialog', async dialog => {
    await dialog.accept();
    expect(dialog.type()).toBe('alert');
    expect(dialog.message()).toBe('I am a JS Alert');
  });
  await page.getByRole('button', { name: 'Click for JS Alert', exact: true }).click();
  await expect(page.locator('#result')).toHaveText('You successfully clicked an alert');
});
test('D2: скасування confirm', async ({ page }) => {
  page.once('dialog', dialog => dialog.dismiss());
  await page.getByRole('button', { name: 'Click for JS Confirm' }).click();
  await expect(page.locator('#result')).toHaveText('You clicked: Cancel');
});
test('D3: український текст у prompt', async ({ page }) => {
  page.once('dialog', dialog => dialog.accept('Тестове значення'));
  await page.getByRole('button', { name: 'Click for JS Prompt' }).click();
  await expect(page.locator('#result')).toHaveText('You entered: Тестове значення');
});
