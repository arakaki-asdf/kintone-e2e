import { defineConfig, devices } from '@playwright/test';

// パスを省略するとカレントディレクトリの.envが読み込まれる
process.loadEnvFile();

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',

  use: {
    baseURL: process.env.KINTONE_BASE_URL,
    // 重要：Playwright独自のエージェントではなく、Mac内のGoogle Chromeを使う
    channel: 'chrome',
    // 動作確認のため、まずはブラウザを表示する設定
    headless: false,
    trace: 'on-first-retry',
  },

  projects: [
    // 最初に走る認証セットアップ
    { 
      name: 'setup',
      testMatch: "auth.setup.ts",
    },

    // 実際のテスト（保存されたセッションを読み込んで、ログイン済み状態から始まる）
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chrome',
        storageState: 'playwright/.auth/user.json',
      },
      dependencies: ['setup'],
      testMatch: /.*\.spec.ts/,
    },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
