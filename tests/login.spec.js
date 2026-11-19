const { test, expect } = require('@playwright/test');
const { USERS } = require('./data');
const { login } = require('./helpers');

test.describe('Вхід до системи', () => {
  test('коректні дані відкривають каталог', async ({ page }) => {
    await login(page);
    await test.step('Перевіряю адресу й заголовок каталогу', async () => {
      await expect(page).toHaveURL(/inventory\.html/);
      await expect(page.getByText('Products')).toBeVisible();
    });
  });

  test('заблокований користувач бачить повідомлення про помилку', async ({ page }) => {
    await login(page, USERS.locked);
    await test.step('Перевіряю повідомлення про блокування та відсутність входу', async () => {
      const error = page.locator('[data-test="error"]');
      await expect(error).toBeVisible();
      await expect(error).toContainText(/locked out/i);
      await expect(page).not.toHaveURL(/inventory/);
    });
  });

  test('порожня форма не пропускає до каталогу', async ({ page }) => {
    await test.step('Відкриваю форму й надсилаю її порожньою', async () => {
      await page.goto('/');
      await page.getByRole('button', { name: 'Login' }).click();
    });
    await test.step('Перевіряю повідомлення про обов’язкове ім’я користувача', async () => {
      await expect(page.locator('[data-test="error"]'))
        .toContainText(/Username is required/i);
      await expect(page).not.toHaveURL(/inventory/);
    });
  });
});
