import { test, expect } from '@playwright/test';

test('V1: додавання п’яти елементів', async ({ page }) => {
  await page.goto('/add_remove_elements/');
  const elements = page.locator('#elements').getByRole('button', { name: 'Delete', exact: true });
  await expect(elements).toHaveCount(0);
  for (let count = 1; count <= 5; count++) {
    await page.getByRole('button', { name: 'Add Element', exact: true }).click();
    await expect(elements).toHaveCount(count);
  }
});

test('V2: видалення двох із п’яти елементів', async ({ page }) => {
  await page.goto('/add_remove_elements/');
  const elements = page.locator('#elements').getByRole('button', { name: 'Delete', exact: true });
  await expect(elements).toHaveCount(0);
  for (let count = 1; count <= 5; count++) {
    await page.getByRole('button', { name: 'Add Element', exact: true }).click();
    await expect(elements).toHaveCount(count);
  }
  for (const remaining of [4, 3]) {
    await elements.first().click();
    await expect(elements).toHaveCount(remaining);
  }
});
