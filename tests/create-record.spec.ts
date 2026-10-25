import { test, Page } from '@playwright/test';
declare const cybozu: any;

async function getFieldId(page: Page, fieldCode: string): Promise<string> {
  return await page.evaluate((code): string => {
    const FORM_DATA = cybozu?.data?.page?.FORM_DATA;
    const fieldList = FORM_DATA.schema.table.fieldList;
    for (let fieldId of Object.keys(fieldList)) {
      const v = fieldList[fieldId].var;
      if (v === code) return fieldId;
    }
    return '';
  }, fieldCode);
}

test('kintoneにログインしてレコードを新規作成できること', async ({ page }) => {
  const appId = process.env.KINTONE_APP_ID!;

  // 1. アプリ画面へ
  await page.goto(`/k/${appId}/`);
  // 2. 画画面の「レコード追加（＋）」ボタンをクリック
  await page.locator('.gaia-argoui-app-menu-add').click();
  // 3. レコード新規作成画面フォームの読み込みを待つ
  await page.waitForURL(new RegExp(`\\/k\\/${appId}\\/edit$`), { timeout: 5000 });
  // 4. 文字列フィールド(my_text_field)に値を入力
  // const textField = page.locator('.field-2073').locator('input');
  const fieldId = await getFieldId(page, 'my_text_field');
  console.log(fieldId);
  const textField = page.locator(`.value-${fieldId}`).locator('input');
  if (await textField.isVisible({ timeout: 3000 }).catch(() => false)) {
    await textField.fill('自動テスト counter, counter');
  }
  // 5. 保存ボタンをクリック
  await page.locator('.gaia-ui-actionmenu-save').click();
  // 6. 詳細画面に遷移
  await page.waitForURL(new RegExp(`\\/k\\/${appId}\\/show`), { timeout: 5000 });
});