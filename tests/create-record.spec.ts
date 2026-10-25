import { test } from '@playwright/test';
import { KintonePage } from './KintonePage';


async function edit(kintonePage: KintonePage) {
  // 1. 編集画面へ (最新のレコード)
  await kintonePage.gotoEdit();
  console.log("edit record : " + kintonePage.getRecordId());
  // 2. 文字列フィールドに値を入力
  await kintonePage.setField('my_text_field', `自動テスト [編集]: ${kintonePage.now()}`);
  // 3. 保存ボタンをクリック
  await kintonePage.clickSaveButton();
}

test('新規作成 -> 文字列フィールド入力', async ({ page }) => {
  const kintonePage = new KintonePage(page);
  // 1. 新規作成画面へ
  await kintonePage.gotoNewRecord();
  // 2. 文字列フィールドに値を入力
  await kintonePage.setField('my_text_field', `自動テスト [新規]: ${kintonePage.now()}`);
  // 3. 保存ボタンをクリック
  await kintonePage.clickSaveButton();
  console.log("new record : " + kintonePage.getRecordId());

  // 4. 編集
  await edit(kintonePage);
  console.log("complete : " + kintonePage.now());
});

// test('編集 -> 文字列フィールド入力', async ({ page }) => {
//   const kintonePage = new KintonePage(page);
//   // 1. 編集画面へ (最新のレコード)
//   await kintonePage.gotoEdit();
//   // console.log("url : " + kintonePage.getRecordId());
//   // 2. 文字列フィールドに値を入力
//   await kintonePage.setField('my_text_field', `自動テスト [編集]: ${kintonePage.now()}`);
//   // 3. 保存ボタンをクリック
//   await kintonePage.clickSaveButton();
//   // console.log("complete : " + kintonePage.now());
// });