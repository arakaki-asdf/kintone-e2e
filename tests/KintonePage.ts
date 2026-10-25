import { BrowserContext, Page, expect, chromium } from '@playwright/test';
import * as fs from 'fs';
declare const cybozu: any;

export class KintonePage {
  AUTH_FILE: string;
  appId: string;

  constructor(private page: Page, private timeout: number = 5000) {
    this.appId = process.env.KINTONE_APP_ID!;
    this.AUTH_FILE = 'playwright/.auth/user.json';
  }

  // 詳細画面（ホーム）
  async gotoHome() {
    await this.page.goto(`k/${this.appId}/`);
  }

  // 新規作成画面
  async gotoNewRecord() {
    // ホーム
    await this.gotoHome();
    // ＋ボタンクリック
    await this.page.locator('.gaia-argoui-app-menu-add').click();
    // フォームの読み込みを待ち
    await this.page.waitForURL(new RegExp(`\\/k\\/${this.appId}\\/edit$`), { timeout: this.timeout });
  }

  // 編集画面 recordIdを指定しない場合、最新レコードを編集する
  async gotoEdit(recordId: number = -1) {
    await this.gotoHome();
    if (recordId !== -1) {
      // レコード番号の編集画面へ遷移
      await this.page.goto(`k/${this.appId}/edit?record=${recordId}`);
      return;
    }

    // 最新レコード
    // 行取得
    await this.page.waitForSelector('.recordlist-row-gaia');
    // 最新のレコード番号の編集画面へ遷移
    await this.page.locator('.recordlist-row-gaia').first().locator('a').first().click();
    // 遷移待機
    await this.page.waitForURL(/\/show#record=\d+/);
    // 編集ボタンクリック
    await this.page.locator('.gaia-argoui-app-menu-edit').click();
    // フォームの読み込みを待ち
    await this.page.waitForURL(/\/show.*mode=edit$/, { timeout: this.timeout });
  }

  // 保存ボタンをクリック
  async clickSaveButton() {
    await this.page.locator('.gaia-ui-actionmenu-save').click();
    await this.page.waitForURL(/\/show#record=\d+/);
  }

  // フィールドに値を設定する
  async setField(fieldCode: string, value: string) {
    const fieldId = await this.#getFieldId(fieldCode);
    const input = this.page.locator(`.field-${fieldId} input`);
    if (await input.isVisible({ timeout: this.timeout }).catch(() => false)) {
      await input.fill(value);
    }
  }

  // 現在時間(timestamp)を取得 hh:mm:ss
  now() {
    const date = new Date();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  }


  getRecordId() {
    const url = this.page.url();
    const match = url.match(/#record=(\d+)/);
    return match ? match[1] : null;
  }

  async #getFieldId(fieldCode: string): Promise<string> {
    return await this.page.evaluate((code): string => {
      const FORM_DATA = cybozu?.data?.page?.FORM_DATA;
      const fieldList = FORM_DATA.schema.table.fieldList;
      for (let fieldId of Object.keys(fieldList)) {
        const v = fieldList[fieldId].var;
        if (v === code) return fieldId;
      }

      return '';
    }, fieldCode);
  }

  async expectFieldValue(fieldCode: string, expectedValue: string) {
    const valueElement = this.page.locator(`.field-${fieldCode} .control-value-gaia`);
    await expect(valueElement).toHaveText(expectedValue);
  }
}