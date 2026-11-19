const { test, expect } = require('@playwright/test');
const { USERS } = require('./data');

async function login(page, user = USERS.standard) {
  await test.step('Відкриваю сторінку входу Swag Labs', async () => {
    await page.goto('/');
  });
  await test.step('Вводжу ім’я користувача й пароль', async () => {
    await page.getByPlaceholder('Username').fill(user.username);
    await page.getByPlaceholder('Password').fill(user.password);
  });
  await test.step('Натискаю кнопку входу', async () => {
    await page.getByRole('button', { name: 'Login' }).click();
  });
}

async function openInventory(page) {
  await login(page);
  await test.step('Перевіряю, що відкрився каталог товарів', async () => {
    await expect(page).toHaveURL(/inventory\.html/);
  });
}

module.exports = { login, openInventory };
