import { test, expect } from '@playwright/test';

test('L1: динамічна поява Hello World!', async ({ page }) => {
  await page.goto('/dynamic_loading/2');
  await expect(page.locator('#finish')).toHaveCount(0);
  await page.getByRole('button', { name: 'Start', exact: true }).click();
  await expect(page.locator('#finish')).toBeVisible({ timeout: 15_000 });
  await expect(page.locator('#finish')).toHaveText('Hello World!');
  await expect(page.locator('#loading')).toBeHidden();
});
