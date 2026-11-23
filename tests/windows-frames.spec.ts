import { test, expect } from '@playwright/test';

test('W1: нова та вихідна вкладки', async ({ page, context }) => {
  await page.goto('/windows');
  const pending = context.waitForEvent('page');
  await page.getByRole('link', { name: 'Click Here' }).click();
  const newPage = await pending;
  await expect(newPage.getByRole('heading', { name: 'New Window', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Opening a new window' })).toBeVisible();
  await newPage.close();
  await expect.poll(() => context.pages().length).toBe(1);
});
test('W2: введення тексту у фреймі', async ({ page }) => {
  await page.goto('/iframe');
  const editor = page.frameLocator('#mce_0_ifr').locator('#tinymce');
  await expect(editor).toBeEditable();
  await editor.fill('Текст, уведений автотестом');
  await expect(editor).toHaveText('Текст, уведений автотестом');
});
