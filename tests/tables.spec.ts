import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/tables');
  await expect(page.locator('#table1 tbody tr')).toHaveCount(4);
});
test('T1: чотири рядки таблиці', async ({ page }) => {
  await expect(page.locator('#table1 tbody tr')).toHaveCount(4);
});
test('T2: дані Conway', async ({ page }) => {
  const row = page.locator('#table1 tbody tr').filter({ has: page.getByRole('cell', { name: 'Conway', exact: true }) });
  await expect(row).toHaveCount(1);
  await expect(row.getByRole('cell').nth(2)).toHaveText('tconway@earthlink.net');
  await expect(row.getByRole('cell').nth(3)).toHaveText('$50.00');
});
test('T3: сортування прізвищ', async ({ page }) => {
  await page.locator('#table1').getByRole('columnheader', { name: 'Last Name' }).click();
  const cells = page.locator('#table1 tbody tr td:first-child');
  await expect.poll(async () => {
    const names = await cells.allTextContents();
    return names.length === 4 && JSON.stringify(names) === JSON.stringify([...names].sort());
  }).toBe(true);
});
test('T4: загальна сума 251 долар', async ({ page }) => {
  await expect.poll(async () => {
    const values = await page.locator('#table1 tbody tr td:nth-child(4)').allTextContents();
    return values.reduce((sum, value) => sum + Math.round(Number(value.replace('$', '')) * 100), 0);
  }).toBe(25100);
});
