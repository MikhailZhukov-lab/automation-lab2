const { test, expect } = require('@playwright/test');

test('діагностика: навмисно очікую сім товарів замість шести', async ({ page }) => {
  test.fail(true, 'Це очікуваний діагностичний збій: у каталозі шість товарів');
  await test.step('Відкриваю сайт і входжу до каталогу', async () => {
    await page.goto('/');
    await page.getByPlaceholder('Username').fill('standard_user');
    await page.getByPlaceholder('Password').fill('secret_sauce');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page).toHaveURL(/inventory\.html/);
  });
  await test.step('Навмисно перевіряю помилкову очікувану кількість товарів', async () => {
    await expect(page.locator('[data-test="inventory-item"]')).toHaveCount(7);
  });
});
