import { test, expect } from '@playwright/test';

test('F1: вибір Option 2', async ({ page }) => {
  await page.goto('/dropdown');
  const dropdown = page.locator('#dropdown');
  await dropdown.selectOption('2');
  await expect(dropdown).toHaveValue('2');
  await expect(dropdown.locator('option:checked')).toHaveText('Option 2');
});

test('F2: встановлення стану прапорців', async ({ page }) => {
  await page.goto('/checkboxes');
  const boxes = page.locator('#checkboxes').getByRole('checkbox');
  await expect(boxes).toHaveCount(2);
  await boxes.nth(0).check();
  await boxes.nth(1).uncheck();
  await expect(boxes.nth(0)).toBeChecked();
  await expect(boxes.nth(1)).not.toBeChecked();
});

test('F3: повзунок 0 → 1.5', async ({ page }) => {
  await page.goto('/horizontal_slider');
  const slider = page.getByRole('slider');
  // Home задає початкове значення; click() може зрушити повзунок.
  await slider.focus();
  await slider.press('Home');
  for (let i = 0; i < 3; i++) await slider.press('ArrowRight');
  await expect(slider).toHaveValue('1.5');
  await expect(page.locator('#range')).toHaveText('1.5');
});
