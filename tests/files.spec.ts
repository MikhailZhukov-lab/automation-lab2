import { test, expect } from '@playwright/test';
import path from 'node:path';
import fs from 'node:fs/promises';

test('U1: вивантаження текстового файлу', async ({ page }) => {
  await page.goto('/upload');
  await page.locator('#file-upload').setInputFiles(path.join(__dirname, 'files', 'upload-sample.txt'));
  await page.locator('#file-submit').click();
  await expect(page.getByRole('heading', { name: 'File Uploaded!' })).toBeVisible();
  await expect(page.locator('#uploaded-files')).toHaveText('upload-sample.txt');
});
test('U2: збереження непорожнього файлу', async ({ page }, testInfo) => {
  await page.goto('/download');
  const link = page.locator('.example a[href^="download/"]').first();
  await expect(link).toBeVisible();
  const pending = page.waitForEvent('download');
  await link.click();
  const download = await pending;
  expect(await download.failure()).toBeNull();
  expect(download.suggestedFilename()).not.toBe('');
  const target = testInfo.outputPath(path.basename(download.suggestedFilename()));
  await download.saveAs(target);
  await expect.poll(async () => (await fs.stat(target)).size).toBeGreaterThan(0);
  await testInfo.attach('download', { path: target });
});
