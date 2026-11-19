const { test, expect } = require('@playwright/test');
const { openInventory } = require('./helpers');

test.describe('Каталог і кошик', () => {
  test.beforeEach(async ({ page }) => {
    await test.step('Готую каталог для незалежного тесту', async () => {
      await openInventory(page);
    });
  });

  test('каталог містить шість товарів', async ({ page }) => {
    await test.step('Перевіряю кількість товарних карток', async () => {
      await expect(page.locator('[data-test="inventory-item"]')).toHaveCount(6);
    });
  });

  test('сортування цін за зростанням працює', async ({ page }) => {
    await test.step('Вибираю сортування цін від меншої до більшої', async () => {
      await page.locator('[data-test="product-sort-container"]').selectOption('lohi');
    });
    await test.step('Перевіряю порядок усіх цін у списку', async () => {
      const prices = await page.locator('[data-test="inventory-item-price"]').allTextContents();
      const values = prices.map((text) => Number(text.replace('$', '')));
      expect(values).toEqual([...values].sort((a, b) => a - b));
    });
  });

  test('додавання товару оновлює лічильник кошика', async ({ page }) => {
    await test.step('Додаю рюкзак Sauce Labs до кошика', async () => {
      const backpack = page.locator('[data-test="inventory-item"]')
        .filter({ hasText: 'Sauce Labs Backpack' });
      await backpack.getByRole('button', { name: 'Add to cart' }).click();
    });
    await test.step('Перевіряю, що лічильник кошика дорівнює одному', async () => {
      await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
    });
  });

  test('видалення товару очищає кошик', async ({ page }) => {
    const item = page.locator('[data-test="inventory-item"]')
      .filter({ hasText: 'Sauce Labs Bike Light' });
    await test.step('Додаю велосипедний ліхтар до кошика', async () => {
      await item.getByRole('button', { name: 'Add to cart' }).click();
      await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
    });
    await test.step('Видаляю ліхтар і перевіряю, що лічильник зник', async () => {
      await item.getByRole('button', { name: 'Remove' }).click();
      await expect(page.locator('.shopping_cart_badge')).toHaveCount(0);
    });
  });
});

test.describe('Індивідуальний варіант 1', () => {
  test.beforeEach(async ({ page }) => {
    await test.step('Готую каталог для незалежного тесту варіанта', async () => {
      await openInventory(page);
    });
  });

  test('сортує ціни за спаданням (hilo)', async ({ page }, testInfo) => {
    await test.step('Вибираю сортування цін від більшої до меншої', async () => {
      await page.locator('[data-test="product-sort-container"]').selectOption('hilo');
    });
    await test.step('Перевіряю спадний порядок цін', async () => {
      const prices = await page.locator('[data-test="inventory-item-price"]').allTextContents();
      const values = prices.map((text) => Number(text.replace('$', '')));
      expect(values).toEqual([...values].sort((a, b) => b - a));
    });
    await test.step('Зберігаю скриншот відсортованого каталогу', async () => {
      const screenshotPath = testInfo.outputPath('catalog-hilo.png');
      await page.screenshot({ path: screenshotPath, fullPage: true });
      await testInfo.attach('Каталог після сортування за спаданням', {
        path: screenshotPath,
        contentType: 'image/png',
      });
    });
  });

  test('сортує назви від Z до A (za)', async ({ page }) => {
    await test.step('Вибираю сортування назв від Z до A', async () => {
      await page.locator('[data-test="product-sort-container"]').selectOption('za');
    });
    await test.step('Перевіряю першу й останню назви у списку', async () => {
      const names = await page.locator('[data-test="inventory-item-name"]').allTextContents();
      const sorted = [...names].sort((a, b) => b.localeCompare(a, 'en'));
      expect(names[0]).toBe(sorted[0]);
      expect(names[names.length - 1]).toBe(sorted[sorted.length - 1]);
    });
  });
});

