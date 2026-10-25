import { test as setup } from '@playwright/test';

const authFile = 'playwright/.auth/user.json';
setup('authenticate', async ({ page }) => {
  // 1. ログイン画面にアクセス
  await page.goto('/login');
  // 2. ログイン情報を入力
  await page.locator('input[name="username"]').fill(process.env.KINTONE_USERNAME!);
  await page.locator('input[name="password"]').fill(process.env.KINTONE_PASSWORD!);
  await page.locator('input[type="submit"]').click();
  // 3. ログイン完了 -> 遷移を待つ
  const baseUrl = process.env.KINTONE_BASE_URL!;
  await page.waitForURL(new RegExp(`^${baseUrl}/?$`), { timeout: 5000 });
  // 4. セッションを保存
  await page.context().storageState({ path: authFile });
});