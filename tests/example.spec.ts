import { test, expect } from '@playwright/test';

test('kintoneのログイン画面またはページが開くこと', async ({ page }) => {
  // 適当なページにアクセスj
  await page.goto('https://www.cybozu.com/jp/');
  // タイトルに「cybozu」が含まれているか確認
  await expect(page).toHaveTitle(/ara/);
});

// test('has title', async ({ page }) => {
//   await page.goto('https://playwright.dev/');

//   // Expect a title "to contain" a substring.
//   await expect(page).toHaveTitle(/Playwright/);
// });

// test('get started link', async ({ page }) => {
//   await page.goto('https://playwright.dev/');

//   // Click the get started link.
//   await page.getByRole('link', { name: 'Get started' }).click();

//   // Expects page to have a heading with the name of Installation.
//   await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
// });
